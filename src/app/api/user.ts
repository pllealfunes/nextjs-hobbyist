// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    console.error("Invalid User ID:", userId);
    return res
      .status(400)
      .json({ error: "User ID is required and must be a string" });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
}
