import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildDashboard, ensureProfile, normalizePhone } from "./me.server";

export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const meta = context.claims?.["user_metadata"] as
      | { full_name?: string; name?: string; whatsapp_phone?: string }
      | undefined;
    return buildDashboard(context.supabase, context.userId, meta?.full_name ?? meta?.name, meta?.whatsapp_phone);
  });


export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        full_name: z.string().trim().min(2).max(60),
        headline: z.string().trim().max(80).optional().or(z.literal("")),
        city: z.string().trim().max(40).optional().or(z.literal("")),
        bio: z.string().trim().max(400).optional().or(z.literal("")),
        github_url: z.string().trim().url().max(200).optional().or(z.literal("")),
        linkedin_url: z.string().trim().url().max(200).optional().or(z.literal("")),
        x_url: z.string().trim().url().max(200).optional().or(z.literal("")),
        website_url: z.string().trim().url().max(200).optional().or(z.literal("")),
        whatsapp_phone: z
          .string()
          .trim()
          .regex(/^\+?[\d\s-]{8,20}$/u, "رقم واتساب غير صالح")
          .optional()
          .or(z.literal("")),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await ensureProfile(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        headline: data.headline || null,
        city: data.city || null,
        bio: data.bio || null,
        github_url: data.github_url || null,
        linkedin_url: data.linkedin_url || null,
        x_url: data.x_url || null,
        website_url: data.website_url || null,
        whatsapp_phone: data.whatsapp_phone ? normalizePhone(data.whatsapp_phone) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Records a verified course completion: awards points once (idempotent by
 * reference), issues the certificate, and refreshes the leaderboard totals.
 */
export const completeCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ courseId: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await ensureProfile(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("complete_course", {
      p_user_id: context.userId,
      p_course_id: data.courseId,
    });
    if (error) throw new Error(error.message);
    return result as {
      already_completed: boolean;
      points_awarded: number;
      course_title: string;
      department_name: string;
      certificate_serial: string;
      total_points: number;
    };
  });
