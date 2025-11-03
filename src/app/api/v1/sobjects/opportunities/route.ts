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

    if (
      !body.account_id ||
      !body.name ||
      !body.stage ||
      !body.close_date ||
      !body.forecast_category
    ) {
      return NextResponse.json(
        {
          message:
            "Account ID, Name, Stage, Close Date, and Forecast Category are required.",
        },
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const queryOptions: any = {
      include: {
        accounts: {
          select: { name: true },
        },
      },
      orderBy: { created_at: "desc" },
    };

    if (search) {
      queryOptions.where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          {
            accounts: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const opportunities = await prisma.opportunities.findMany(queryOptions);

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching opportunities." },
      { status: 500 }
    );
  }
}
