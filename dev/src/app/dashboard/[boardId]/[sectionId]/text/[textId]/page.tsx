"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import Button from "@/components/Button";
import Tiptap from "@/components/Tiptap";
import { JSONContent } from "@tiptap/core";
import { useRouter } from "next/navigation";

export default function TextPage() {
  const { data: session, status } = useSession();
  const params = useParams() as {
    boardId: string;
    sectionId: string;
    textId: string;
  };

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [name, setName] = useState("");
  const [text, setText] = useState<JSONContent | null>(null);

  async function loadText() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/text/${params.textId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { text } = data;
      setName(text.name);
      setText(text.content);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBadge() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio/${params.textId}/badge`,
      { method: "PUT" }
    );

    if (!res.ok) {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    sendBadge();
    loadText();
  }, []);

  async function handleText() {
    const data = {
      text: text,
    };

    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/text/${params.textId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      setSnackbar("Dokument byl uložen.");
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  return (
    <>
      <TopBar
        name={name}
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}`)
        }
        desktopVisible={false}
      />

      <main className="flex flex-col w-full h-dvh py-6 pt-22 px-6 lg:mx-auto lg:w-4xl lg:h-screen lg:pt-6 lg:px-0">
        {text && <Tiptap content={text} onChange={setText} name={name} />}
        <div className="flex justify-end w-full px-6 py-3 bg-surface-container rounded-b-3xl">
          {status === "authenticated" && session?.user?.role === "teacher" && (
            <Button
              text="Uložit"
              type="button"
              buttonType="filled"
              onClick={handleText}
            />
          )}
        </div>
      </main>
    </>
  );
}
