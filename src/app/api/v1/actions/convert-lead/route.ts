import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/actions/convert-lead:
 *   post:
 *     summary: Convert a lead
 *     description: Converts a lead into a new Account, Contact, and Opportunity in a single transaction.
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *             properties:
 *               leadId:
 *                 type: integer
 *                 description: The ID of the lead to convert.
 *     responses:
 *       '200':
 *         description: Lead converted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConvertLeadResult'
 *       '400':
 *         description: Bad request (e.g., lead already converted).
 *       '404':
 *         description: Lead not found.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json(
        { message: "Lead ID is required" },
        { status: 400 }
      );
    }

    const leadToConvert = await prisma.leads.findUnique({
      where: { id: leadId },
    });

    if (!leadToConvert) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    if (leadToConvert.status === "Converted") {
      return NextResponse.json(
        { message: "Lead has already been converted" },
        { status: 400 }
      );
    }
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newAccount = await tx.accounts.create({
          data: {
            name:
              leadToConvert.company ||
              `${leadToConvert.first_name} ${leadToConvert.last_name}`,
            website: leadToConvert.website,
            phone: leadToConvert.phone,
            billing_street: leadToConvert.street,
            billing_city: leadToConvert.city,
            billing_state_province: leadToConvert.state_province,
            billing_zip_postal_code: leadToConvert.zip_postal_code,
            billing_country: leadToConvert.country,
          },
        });

        const newContact = await tx.contacts.create({
          data: {
            account_id: newAccount.id,
            first_name: leadToConvert.first_name,
            last_name: leadToConvert.last_name,
            email: leadToConvert.email,
            phone: leadToConvert.phone,
            title: leadToConvert.title,
            mailing_street: leadToConvert.street,
            mailing_city: leadToConvert.city,
            mailing_state_province: leadToConvert.state_province,
            mailing_zip_postal_code: leadToConvert.zip_postal_code,
            mailing_country: leadToConvert.country,
          },
        });

        const newOpportunity = await tx.opportunities.create({
          data: {
            account_id: newAccount.id,
            name: `${newAccount.name} - Opportunity`,
            stage: "Qualification",
            close_date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ),
            forecast_category: "Pipeline",
          },
        });

        await tx.leads.update({
          where: { id: leadId },
          data: { status: "Converted" },
        });

        return { newAccount, newContact, newOpportunity };
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error converting lead:", error);
    return NextResponse.json(
      { message: "An error occurred during lead conversion." },
      { status: 500 }
    );
  }
}
