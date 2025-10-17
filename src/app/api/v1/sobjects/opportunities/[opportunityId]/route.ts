import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ opportunityId: string }>;
}

/**
 * @swagger
 * /api/v1/sobjects/opportunities/{opportunityId}:
 *   get:
 *     summary: Retrieve a single opportunity
 *     tags: [Opportunities]
 *     parameters:
 *       - in: path
 *         name: opportunityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the opportunity to retrieve.
 *     responses:
 *       '200':
 *         description: A single opportunity record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       '404':
 *         description: Opportunity not found.
 *   patch:
 *     summary: Update an opportunity
 *     tags: [Opportunities]
 *     parameters:
 *       - in: path
 *         name: opportunityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the opportunity to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpportunityInput'
 *     responses:
 *       '200':
 *         description: Opportunity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *   delete:
 *     summary: Delete an opportunity
 *     tags: [Opportunities]
 *     parameters:
 *       - in: path
 *         name: opportunityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the opportunity to delete.
 *     responses:
 *       '204':
 *         description: Opportunity deleted successfully. No content.
 */

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { opportunityId: opportunityIdStr } = await params;
    const opportunityId = parseInt(opportunityIdStr, 10);
    if (isNaN(opportunityId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunities.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { opportunityId: opportunityIdStr } = await params;
    const opportunityId = parseInt(opportunityIdStr, 10);
    const body = await request.json();

    if (isNaN(opportunityId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedOpportunity = await prisma.opportunities.update({
      where: { id: opportunityId },
      data: body,
    });

    return NextResponse.json(updatedOpportunity);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { opportunityId: opportunityIdStr } = await params;
    const opportunityId = parseInt(opportunityIdStr, 10);
    if (isNaN(opportunityId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    await prisma.opportunities.delete({
      where: { id: opportunityId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
