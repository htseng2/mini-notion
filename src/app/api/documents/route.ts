import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/documents - Get all documents for the current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      documents: true,
      sharedDocuments: {
        include: {
          document: true,
        },
      },
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const ownedDocuments = user.documents;
  const sharedDocuments = user.sharedDocuments.map((share) => ({
    ...share.document,
    canEdit: share.canEdit,
  }));

  return NextResponse.json({
    ownedDocuments,
    sharedDocuments,
  });
}

// POST /api/documents - Create a new document
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
