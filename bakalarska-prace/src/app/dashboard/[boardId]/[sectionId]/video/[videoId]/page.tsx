"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";
import { PostSection } from "@/types/post";
import { useRouter } from "next/navigation";

export default function PhotoPage() {
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    videoId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [video, setVideo] = useState<PostSection | null>(null);

  async function loadVideo() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/video/${params.videoId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { video } = data;
      setVideo(video);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.videoId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    loadVideo();
  }, []);

  return (
    <>
      <TopBar
        name={video?.name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
      />

      <DashboardLayout>
        <h1 className="hidden text-display-medium lg:text-display-large mb-6 lg:block">
          {video?.name}
        </h1>
        <div className="flex justify-center">
          {video && (
            <video controls preload="metada" className="w-full rounded-3xl">
              <source src={video?.url} />
              Váš prohlížeč nepodporuje přehrávání videa.
            </video>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
