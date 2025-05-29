import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    where: { id: params.id },
  });

  if (!document || document.userId !== user.id) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-8">
      <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl p-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Documents
          </Link>
        </div>

        <DocumentEditor document={document} />
      </div>
    </main>
  );
}
