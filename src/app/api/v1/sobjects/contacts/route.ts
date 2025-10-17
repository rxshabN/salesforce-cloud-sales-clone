import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sobjects/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       '201':
 *         description: Contact created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.account_id) {
      return NextResponse.json(
        { message: "Account ID is required to create a contact." },
        { status: 400 }
      );
    }

    const newContact = await prisma.contacts.create({
      data: body,
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the contact." },
      { status: 500 }
    );
  }
}
