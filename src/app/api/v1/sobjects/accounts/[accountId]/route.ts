import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ accountId: string }>;
}

/**
 * @swagger
 * /api/v1/sobjects/accounts/{accountId}:
 *   get:
 *     summary: Retrieve a single account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account to retrieve.
 *     responses:
 *       '200':
 *         description: A single account record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       '404':
 *         description: Account not found.
 *   patch:
 *     summary: Update an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       '200':
 *         description: Account updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the account to delete.
 *     responses:
 *       '204':
 *         description: Account deleted successfully. No content.
 */

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { accountId: accountIdStr } = await params;
    const accountId = parseInt(accountIdStr, 10);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { accountId: accountIdStr } = await params;
    const accountId = parseInt(accountIdStr, 10);
    const body = await request.json();

    if (isNaN(accountId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedAccount = await prisma.accounts.update({
      where: { id: accountId },
      data: body,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { accountId: accountIdStr } = await params;
    const accountId = parseInt(accountIdStr, 10);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    await prisma.accounts.delete({
      where: { id: accountId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
