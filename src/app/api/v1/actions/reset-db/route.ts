import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { seedDatabase } from "@/lib/seeding";

export async function POST() {
  try {
    await seedDatabase(prisma);
    return NextResponse.json(
      { message: "Database reset and seeded successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during DB reset:", error);
    return NextResponse.json(
      {
        message: "An error occurred during the reset process.",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
