"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";
import { PostSection } from "@/types/post";
import { ReactSVG } from "react-svg";
import { useRouter } from "next/navigation";

export default function FilePage() {
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    fileId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [file, setFile] = useState<PostSection | null>(null);

  async function laodFile() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/file/${params.fileId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { file } = data;
      setFile(file);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.fileId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    laodFile();
  }, []);

  return (
    <>
      <TopBar
        name={file?.name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
      />

      <DashboardLayout>
        <h1 className="hidden text-display-medium lg:text-display-large mb-6 lg:block">
          {file?.name}
        </h1>
        <a
          href={file?.url}
          className="flex flex-col items-center justify-center gap-6 text-on-surface-variant cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-96 bg-surface-container rounded-3xl hover:outline hover:outline-outline-variant">
            <ReactSVG
              src="/icons/download-96dp.svg"
              className="text-on-surface-variant"
            ></ReactSVG>
          </div>
        </a>
      </DashboardLayout>
    </>
  );
}
