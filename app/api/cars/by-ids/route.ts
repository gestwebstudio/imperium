import { NextResponse } from "next/server";
import { z } from "zod";
import { getCarsByIds } from "@/lib/cars";

const CarsByIdsRequest = z.object({
  ids: z.array(z.string().trim().min(1).max(128)).max(100),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CarsByIdsRequest.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректный список автомобилей" },
      { status: 400 },
    );
  }

  const cars = await getCarsByIds(parsed.data.ids);
  return NextResponse.json(
    { cars },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
