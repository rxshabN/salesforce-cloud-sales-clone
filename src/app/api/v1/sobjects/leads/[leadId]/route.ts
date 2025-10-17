import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ leadId: string }>;
}

/**
 * @swagger
 * /api/v1/sobjects/leads/{leadId}:
 *   get:
 *     summary: Retrieve a single lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lead to retrieve.
 *     responses:
 *       '200':
 *         description: A single lead record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       '404':
 *         description: Lead not found.
 *   patch:
 *     summary: Update a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lead to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       '200':
 *         description: Lead updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the lead to delete.
 *     responses:
 *       '204':
 *         description: Lead deleted successfully. No content.
 */

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { leadId: leadIdStr } = await params;
    const leadId = parseInt(leadIdStr, 10);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const lead = await prisma.leads.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { leadId: leadIdStr } = await params;
    const leadId = parseInt(leadIdStr, 10);
    const body = await request.json();

    if (isNaN(leadId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedLead = await prisma.leads.update({
      where: { id: leadId },
      data: body,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { leadId: leadIdStr } = await params;
    const leadId = parseInt(leadIdStr, 10);

    if (isNaN(leadId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    await prisma.leads.delete({
      where: { id: leadId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
