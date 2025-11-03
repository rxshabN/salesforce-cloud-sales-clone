import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/sobjects/accounts:
 *   get:
 *     summary: Retrieve all accounts
 *     tags: [Accounts]
 *     responses:
 *       '200':
 *         description: A list of accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       '201':
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  try {
    const queryOptions: any = {
      orderBy: { created_at: "desc" },
    };

    if (name) {
      queryOptions.where = {
        name: {
          contains: name,
          mode: "insensitive",
        },
      };
    }
    const accounts = await prisma.accounts.findMany(queryOptions);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching accounts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newAccount = await prisma.accounts.create({
      data: body,
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the account." },
      { status: 500 }
    );
  }
}
