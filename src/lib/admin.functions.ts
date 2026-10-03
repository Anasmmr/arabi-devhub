import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Roles of the signed-in user. */
export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role);
    return { roles, isAdmin: roles.includes("admin"), isModerator: roles.includes("moderator") };
  });

/** Admin-only: list members with their emails and roles. */
export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("not_authorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: users, error: uErr }, { data: roles }, { data: profiles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("profiles").select("id, full_name, whatsapp_phone, total_points"),
    ]);
    if (uErr) throw new Error(uErr.message);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    return {
      members: (users?.users ?? []).map((u) => {
        const p = profileMap.get(u.id);
        return {
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          full_name: p?.full_name ?? (u.user_metadata?.["full_name"] as string | undefined) ?? "عضو",
          phone:
            p?.whatsapp_phone ?? (u.user_metadata?.["whatsapp_phone"] as string | undefined) ?? null,
          total_points: p?.total_points ?? 0,
          roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role),
        };
      }),
    };
  });

/** Admin-only: grant moderator to a member by email. */
export const grantModeratorByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ email: z.string().trim().email().max(255) }).parse(data))
  .handler(async ({ context, data }) => {
    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("not_authorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = data.email.toLowerCase();
    let found: string | null = null;
    for (let page = 1; page <= 10 && !found; page++) {
      const { data: res, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      const u = res.users.find((x) => (x.email ?? "").toLowerCase() === target);
      if (u) found = u.id;
      if (res.users.length < 200) break;
    }
    if (!found) return { ok: false as const, reason: "not_found" as const };

    const { error } = await context.supabase.rpc("set_user_role", {
      _user_id: found,
      _role: "moderator",
      _grant: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Admin-only: create a moderator account by email (or grant moderator if the account exists).
 *  Returns a temporary password for newly created accounts so the admin can share it. */
export const createModeratorAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ email: z.string().trim().email().max(255) }).parse(data))
  .handler(async ({ context, data }) => {
    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("not_authorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = data.email.toLowerCase();

    let userId: string | null = null;
    for (let page = 1; page <= 10 && !userId; page++) {
      const { data: res, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      const u = res.users.find((x) => (x.email ?? "").toLowerCase() === target);
      if (u) userId = u.id;
      if (res.users.length < 200) break;
    }

    let tempPassword: string | null = null;
    if (!userId) {
      tempPassword = `gdg-${Math.random().toString(36).slice(2, 10)}`;
      const { data: created, error: cErr } = await supabaseAdmin.auth.admin.createUser({
        email: target,
        password: tempPassword,
        email_confirm: true,
      });
      if (cErr) throw new Error(cErr.message);
      userId = created.user.id;
    }

    const { error } = await context.supabase.rpc("set_user_role", {
      _user_id: userId,
      _role: "moderator",
      _grant: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const, created: Boolean(tempPassword), tempPassword };
  });

/** Admin-only: grant or revoke a role for a member. */
export const setMemberRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "moderator"]),
        grant: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.rpc("set_user_role", {
      _user_id: data.userId,
      _role: data.role,
      _grant: data.grant,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
