import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchDepartmentScores, fetchMembersDirectory } from "./members.server";

/** Public: كل الأعضاء المسجّلين، المشرفون والمديرون أولاً. */
export const getMembers = createServerFn({ method: "GET" }).handler(async () => ({
  members: await fetchMembersDirectory(),
}));

/** Public: مجموع نقاط كل مسار. */
export const getDepartmentScores = createServerFn({ method: "GET" }).handler(async () => ({
  scores: await fetchDepartmentScores(),
}));

/** المشرفون والمديرون فقط: إضافة نقاط لمسار في لوحة الصدارة. */
export const addDepartmentPoints = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        departmentId: z.string().uuid(),
        amount: z.number().int().min(-1000).max(1000).refine((n) => n !== 0),
        reason: z.string().trim().max(200).optional().or(z.literal("")),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const { data: roles, error: rErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (rErr) throw new Error(rErr.message);
    const list = (roles ?? []).map((r) => r.role);
    if (!list.includes("admin") && !list.includes("moderator")) throw new Error("not_authorized");

    const { error } = await context.supabase.from("department_points").insert({
      department_id: data.departmentId,
      amount: data.amount,
      reason_ar: data.reason || null,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
