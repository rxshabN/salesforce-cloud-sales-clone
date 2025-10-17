import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sobjects/leads:
 *   post:
 *     summary: Create a new lead
 *     description: Creates a new lead record in the database.
 *     tags:
 *       - Leads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       '201':
 *         description: Lead created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       '500':
 *         description: Internal server error.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newLead = await prisma.leads.create({
      data: body,
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the lead." },
      { status: 500 }
    );
  }
}
