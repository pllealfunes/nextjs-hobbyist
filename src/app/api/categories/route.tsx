import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching categories from database...");

    const categories = await prisma.category.findMany();

    console.log("Fetched categories:", categories); // Log fetched data

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Prisma error:", error); // Log Prisma error details

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
