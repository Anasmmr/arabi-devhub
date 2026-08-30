import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  fetchDepartmentsWithCourses,
  fetchFounders,
  fetchLeaderboard,
  fetchStats,
} from "./community.server";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const [departments, leaderboard, stats] = await Promise.all([
    fetchDepartmentsWithCourses(),
    fetchLeaderboard(6),
    fetchStats(),
  ]);
  return { departments, leaderboard, stats };
});

export const getDepartments = createServerFn({ method: "GET" }).handler(async () => ({
  departments: await fetchDepartmentsWithCourses(),
}));

export const getDepartment = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const departments = await fetchDepartmentsWithCourses();
    const department = departments.find((d) => d.slug === data.slug) ?? null;
    return { department };
  });

export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => ({
  leaderboard: await fetchLeaderboard(50),
}));

export const getFounders = createServerFn({ method: "GET" }).handler(async () => ({
  founders: await fetchFounders(),
}));

export const getAboutData = createServerFn({ method: "GET" }).handler(async () => ({
  stats: await fetchStats(),
}));
