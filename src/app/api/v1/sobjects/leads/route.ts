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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const whereClause: any = {
      orderBy: { created_at: "desc" },
    };

    if (search) {
      whereClause.where = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const leads = await prisma.leads.findMany(whereClause);
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching leads." },
      { status: 500 }
    );
  }
}
