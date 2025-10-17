import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ contactId: string }>;
}

/**
 * @swagger
 * /api/v1/sobjects/contacts/{contactId}:
 *   get:
 *     summary: Retrieve a single contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contact to retrieve.
 *     responses:
 *       '200':
 *         description: A single contact record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       '404':
 *         description: Contact not found.
 *   patch:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contact to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       '200':
 *         description: Contact updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contact to delete.
 *     responses:
 *       '204':
 *         description: Contact deleted successfully. No content.
 */

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { contactId: contactIdStr } = await params;
    const contactId = parseInt(contactIdStr, 10);
    if (isNaN(contactId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const contact = await prisma.contacts.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { contactId: contactIdStr } = await params;
    const contactId = parseInt(contactIdStr, 10);
    const body = await request.json();

    if (isNaN(contactId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedContact = await prisma.contacts.update({
      where: { id: contactId },
      data: body,
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { contactId: contactIdStr } = await params;
    const contactId = parseInt(contactIdStr, 10);
    if (isNaN(contactId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    await prisma.contacts.delete({
      where: { id: contactId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
