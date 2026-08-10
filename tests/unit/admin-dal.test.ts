import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  news: { findMany: vi.fn(), findUnique: vi.fn() },
  review: { findMany: vi.fn(), findUnique: vi.fn() },
}));
const auth = vi.hoisted(() => ({ requireAdmin: vi.fn() }));

vi.mock("@/lib/db", () => ({ prisma: db }));
vi.mock("@/lib/admin-auth", () => auth);

import {
  getAdminNewsById,
  getAdminNewsList,
  getAdminReviewById,
  getAdminReviewsList,
} from "@/lib/admin-dal";

beforeEach(() => {
  vi.clearAllMocks();
  auth.requireAdmin.mockResolvedValue({ id: "session" });
});

describe("admin DAL authorization", () => {
  it("checks auth before every list query", async () => {
    db.news.findMany.mockResolvedValue([]);
    db.review.findMany.mockResolvedValue([]);
    await getAdminNewsList();
    await getAdminReviewsList();
    expect(auth.requireAdmin).toHaveBeenCalledTimes(2);
    expect(db.news.findMany).toHaveBeenCalledWith({ orderBy: { date: "desc" } });
    expect(db.review.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "asc" },
    });
  });

  it("does not query by an invalid id", async () => {
    await expect(getAdminNewsById("../secret")).resolves.toBeNull();
    await expect(getAdminReviewById("bad/id")).resolves.toBeNull();
    expect(db.news.findUnique).not.toHaveBeenCalled();
    expect(db.review.findUnique).not.toHaveBeenCalled();
  });

  it("never reaches Prisma if authorization fails", async () => {
    auth.requireAdmin.mockRejectedValue(new Error("UNAUTHORIZED"));
    await expect(getAdminNewsList()).rejects.toThrow("UNAUTHORIZED");
    await expect(getAdminReviewById("review-id")).rejects.toThrow(
      "UNAUTHORIZED",
    );
    expect(db.news.findMany).not.toHaveBeenCalled();
    expect(db.review.findUnique).not.toHaveBeenCalled();
  });
});
