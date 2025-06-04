import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import DocumentEditor from "@/components/DocumentEditor";

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.email) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return notFound();
  }

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      sharedWith: {
        where: { userId: user.id },
      },
    },
  });

  if (!document) {
    return notFound();
  }

  // Check if user is the owner or has been shared with
  const isOwner = document.userId === user.id;
  const isShared = document.sharedWith.length > 0;
  const canEdit = isOwner || (isShared && document.sharedWith[0].canEdit);

  if (!isOwner && !isShared) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl mx-auto rounded-2xl bg-card border border-border shadow-2xl p-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Documents
          </Link>
        </div>

        <DocumentEditor document={document} canEdit={canEdit} />
      </div>
    </div>
  );
}
