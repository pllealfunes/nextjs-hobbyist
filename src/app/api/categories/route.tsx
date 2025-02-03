import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
