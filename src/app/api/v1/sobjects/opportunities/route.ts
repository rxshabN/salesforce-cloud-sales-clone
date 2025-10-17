import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sobjects/opportunities:
 *   post:
 *     summary: Create a new opportunity
 *     tags: [Opportunities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpportunityInput'
 *     responses:
 *       '201':
 *         description: Opportunity created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.account_id || !body.name || !body.stage || !body.close_date) {
      return NextResponse.json(
        { message: "Account ID, Name, Stage, and Close Date are required." },
        { status: 400 }
      );
    }

    const newOpportunity = await prisma.opportunities.create({
      data: body,
    });

    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the opportunity." },
      { status: 500 }
    );
  }
}
