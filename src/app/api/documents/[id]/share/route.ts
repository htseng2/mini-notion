import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/documents/[id]/share - Share a document with another user
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email, canEdit } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const shareWithUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!shareWithUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (shareWithUser.id === user.id) {
      return NextResponse.json(
        { message: "Cannot share with yourself" },
        { status: 400 }
      );
    }

    const share = await prisma.documentShare.create({
      data: {
        documentId: document.id,
        userId: shareWithUser.id,
        canEdit: canEdit || false,
      },
    });

    return NextResponse.json(share, { status: 201 });
  } catch (error) {
    console.error("Error sharing document:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id]/share - Remove document sharing
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const shareWithUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!shareWithUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.documentShare.delete({
      where: {
        documentId_userId: {
          documentId: document.id,
          userId: shareWithUser.id,
        },
      },
    });

    return NextResponse.json(
      { message: "Document sharing removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing document sharing:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
