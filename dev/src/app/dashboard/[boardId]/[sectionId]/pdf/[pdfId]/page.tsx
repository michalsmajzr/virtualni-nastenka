"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";
import { PostSection } from "@/types/post";
import { useRouter } from "next/navigation";

export default function PDFPage() {
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    pdfId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [pdf, setPDF] = useState<PostSection | null>(null);

  async function loadPDF() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/pdf/${params.pdfId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { pdf } = data;
      setPDF(pdf);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.pdfId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    loadPDF();
  }, []);

  return (
    <>
      <TopBar
        name={pdf?.name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
      />

      <DashboardLayout>
        <h1 className="hidden text-display-medium lg:text-display-large mb-6 lg:block">
          {pdf?.name}
        </h1>
        <div className="flex-1 flex flex-col items-center">
          <iframe
            title="PDF"
            width="300"
            height="200"
            src={pdf?.url}
            className="h-screen w-full rounded-xl"
          ></iframe>
        </div>
      </DashboardLayout>
    </>
  );
}
