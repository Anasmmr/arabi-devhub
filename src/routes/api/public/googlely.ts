import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const payloadSchema = z.object({
  event: z.enum(["correct_answer", "activity"]),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{8,20}$/u),
  reference: z.string().trim().min(3).max(120),
  points: z.number().int().min(1).max(100),
  reason_ar: z.string().trim().min(3).max(200),
  department_slug: z.enum(["ai", "app", "security", "uiux"]).optional(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/**
 * Googlely (WhatsApp) → website bridge.
 * Verified events award points once, then the member's profile, department
 * points and leaderboard position update automatically.
 */
export const Route = createFileRoute("/api/public/googlely")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["GOOGLELY_WEBHOOK_SECRET"];
        if (!secret) return json({ error: "not_configured" }, 500);

        const raw = await request.text();
        const provided = request.headers.get("x-googlely-signature") ?? "";
        const expected = createHmac("sha256", secret).update(raw).digest("hex");
        const a = Buffer.from(provided);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return json({ error: "invalid_signature" }, 401);
        }

        let parsed;
        try {
          parsed = payloadSchema.parse(JSON.parse(raw));
        } catch {
          return json({ error: "invalid_payload" }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const phone = `+${parsed.phone.replace(/[^\d]/g, "")}`;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id, full_name")
          .eq("whatsapp_phone", phone)
          .maybeSingle();

        if (!profile) return json({ error: "member_not_linked" }, 404);

        let departmentId: string | null = null;
        if (parsed.department_slug) {
          const { data: dept } = await supabaseAdmin
            .from("departments")
            .select("id")
            .eq("slug", parsed.department_slug)
            .maybeSingle();
          departmentId = dept?.id ?? null;
        }

        const { data: awarded, error } = await supabaseAdmin.rpc("award_points", {
          p_user_id: profile.id,
          p_amount: parsed.points,
          p_reason_ar: parsed.reason_ar,
          p_kind: "whatsapp",
          ...(departmentId ? { p_department_id: departmentId } : {}),
          p_reference: `whatsapp:${parsed.reference}`,
        });
        if (error) return json({ error: "award_failed" }, 500);

        const { data: updated } = await supabaseAdmin
          .from("profiles")
          .select("total_points")
          .eq("id", profile.id)
          .maybeSingle();

        return json({
          ok: true,
          awarded: awarded === true,
          duplicate: awarded !== true,
          total_points: updated?.total_points ?? null,
        });
      },
    },
  },
});
