"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import DashboardLayout from "@/components/DashboardLayout";
import { PostSection } from "@/types/post";
import { useRouter } from "next/navigation";

export default function AudioPage() {
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    audioId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [audio, setAudio] = useState<PostSection | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [play, setPlay] = useState(false);

  async function loadAudio() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.audioId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { audio } = data;
      setAudio(audio);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.audioId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    loadAudio();
  }, []);

  async function handleClick() {
    if (audioRef.current) {
      if (play) {
        audioRef.current.pause();
        setPlay(false);
      } else {
        try {
          await audioRef.current.play();
          setPlay(true);
        } catch {
          setPlay(false);
          setSnackbar("Váš webový prohlížeč neumí přehrát toto audio.");
        }
      }
    }
  }

  return (
    <>
      <TopBar
        name={audio?.name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
      />

      <DashboardLayout>
        <h1 className="hidden text-display-medium lg:text-display-large mb-6 lg:block">
          {audio?.name}
        </h1>
        {audio && (
          <figure
            onClick={handleClick}
            className="flex items-center justify-center w-full h-96 bg-surface-container rounded-3xl cursor-pointer hover:outline hover:outline-outline-variant"
          >
            <audio ref={audioRef} controls src={audio?.url}>
              Váš webový prohlížeč neumí přehrát toto audio.
            </audio>
          </figure>
        )}
      </DashboardLayout>
    </>
  );
}
