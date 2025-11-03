import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/actions/convert-lead:
 * post:
 * summary: Convert a lead
 * description: Converts a lead into a new or existing Account, Contact, and optionally an Opportunity. Updates the lead's status upon successful conversion.
 * tags: [Actions]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - leadId
 * - convertedStatus
 * properties:
 * leadId:
 * type: integer
 * description: The ID of the lead to convert.
 * convertedStatus:
 * type: string
 * description: The new status to set for the converted lead (e.g., "Qualified").
 * dontCreateOpportunity:
 * type: boolean
 * description: If true, no opportunity will be created.
 * accountId:
 * type: integer
 * nullable: true
 * description: The ID of an *existing* account to link to.
 * newAccountName:
 * type: string
 * nullable: true
 * description: The name for a *new* account (if accountId is null).
 * contactId:
 * type: integer
 * nullable: true
 * description: The ID of an *existing* contact to link to.
 * opportunityId:
 * type: integer
 * nullable: true
 * description: The ID of an *existing* opportunity to link to.
 * newOpportunityName:
 * type: string
 * nullable: true
 * description: The name for a *new* opportunity (if opportunityId is null and dontCreateOpportunity is false).
 * responses:
 * '200':
 * description: Lead converted successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ConvertLeadResult'
 * '400':
 * description: Bad request (e.g., lead already converted, missing required fields).
 * '404':
 * description: Lead not found.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      leadId,
      convertedStatus,
      dontCreateOpportunity,
      accountId,
      newAccountName,
      contactId,
      opportunityId,
      newOpportunityName,
    } = body;

    if (!leadId || !convertedStatus) {
      return NextResponse.json(
        { message: "Lead ID and Converted Status are required" },
        { status: 400 }
      );
    }

    if (!accountId && !newAccountName) {
      return NextResponse.json(
        {
          message:
            "Either an existing account ID or a new account name is required.",
        },
        { status: 400 }
      );
    }
    if (!dontCreateOpportunity && !opportunityId && !newOpportunityName) {
      return NextResponse.json(
        {
          message:
            "Either an existing opportunity ID or a new opportunity name is required (or set dontCreateOpportunity to true).",
        },
        { status: 400 }
      );
    }

    const leadToConvert = await prisma.leads.findUnique({
      where: { id: leadId },
    });

    if (!leadToConvert) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    if (
      leadToConvert.status === "Converted" ||
      leadToConvert.status === "Qualified"
    ) {
      return NextResponse.json(
        { message: "Lead has already been converted" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        let finalAccountId: number;
        let finalAccount: any;
        let finalContact: any;
        let finalOpportunity: any;

        if (accountId) {
          finalAccountId = accountId;
          finalAccount = await tx.accounts.findUnique({
            where: { id: accountId },
          });
        } else {
          const newAccount = await tx.accounts.create({
            data: {
              name: newAccountName!,
              website: leadToConvert.website,
              phone: leadToConvert.phone,
              billing_street: leadToConvert.street,
              billing_city: leadToConvert.city,
              billing_state_province: leadToConvert.state_province,
              billing_zip_postal_code: leadToConvert.zip_postal_code,
              billing_country: leadToConvert.country,
              account_owner: leadToConvert.lead_owner || "Rishab Nagwani",
            },
          });
          finalAccountId = newAccount.id;
          finalAccount = newAccount;
        }

        if (contactId) {
          finalContact = await tx.contacts.findUnique({
            where: { id: contactId },
          });
        } else {
          finalContact = await tx.contacts.create({
            data: {
              account_id: finalAccountId,
              first_name: leadToConvert.first_name,
              last_name: leadToConvert.last_name,
              email: leadToConvert.email,
              phone: leadToConvert.phone,
              title: leadToConvert.title,
              salutation: leadToConvert.salutation,
              mailing_street: leadToConvert.street,
              mailing_city: leadToConvert.city,
              mailing_state_province: leadToConvert.state_province,
              mailing_zip_postal_code: leadToConvert.zip_postal_code,
              mailing_country: leadToConvert.country,
              contact_owner: leadToConvert.lead_owner || "Rishab Nagwani",
            },
          });
        }

        if (dontCreateOpportunity) {
          finalOpportunity = null;
        } else if (opportunityId) {
          finalOpportunity = await tx.opportunities.findUnique({
            where: { id: opportunityId },
          });
        } else {
          finalOpportunity = await tx.opportunities.create({
            data: {
              account_id: finalAccountId,
              name: newOpportunityName!,
              stage: "Qualification",
              close_date: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ),
              forecast_category: "Pipeline",
              opportunity_owner: leadToConvert.lead_owner || "Rishab Nagwani",
              amount: leadToConvert.annual_revenue,
            },
          });
        }

        await tx.leads.update({
          where: { id: leadId },
          data: { status: convertedStatus },
        });

        return {
          account: finalAccount,
          contact: finalContact,
          opportunity: finalOpportunity,
        };
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error converting lead:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (error.meta?.target as string[]).includes("email")
    ) {
      return NextResponse.json(
        {
          message:
            "A contact with this email already exists. Please choose 'Existing Contact' or use a different email.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An error occurred during lead conversion." },
      { status: 500 }
    );
  }
}
