import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sobjects/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contacts]
 *     responses:
 *       '200':
 *         description: A list of contacts with their account information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
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
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          {
            accounts: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const contacts = await prisma.contacts.findMany(queryOptions);

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching contacts." },
      { status: 500 }
    );
  }
}

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
