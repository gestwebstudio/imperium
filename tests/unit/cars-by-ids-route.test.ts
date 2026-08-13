import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/cars/by-ids/route";
import { getAllCars } from "@/lib/cars";

describe("POST /api/cars/by-ids", () => {
  it("возвращает только существующие автомобили в порядке ID", async () => {
    const all = getAllCars();
    const request = new Request("http://localhost/api/cars/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [all[2].id, "removed-car", all[0].id] }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { cars: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(payload.cars.map((car) => car.id)).toEqual([all[2].id, all[0].id]);
  });

  it("отклоняет повреждённый и чрезмерный список ID", async () => {
    const malformed = await POST(
      new Request("http://localhost/api/cars/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{broken",
      }),
    );
    const oversized = await POST(
      new Request("http://localhost/api/cars/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from({ length: 101 }, () => "car") }),
      }),
    );

    expect(malformed.status).toBe(400);
    expect(oversized.status).toBe(400);
  });
});
