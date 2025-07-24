"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import StepLayout from "@/components/StepLayout";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import Tiptap from "@/components/Tiptap";
import { JSONContent } from "@tiptap/core";

export default function AddTextPage() {
  const params = useParams() as { boardId: string; sectionId: string };

  const router = useRouter();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState<JSONContent>({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [],
      },
    ],
  });
  const [nameError, setNameError] = useState("");

  async function handleText() {
    if (!name) {
      return setSnackbar("Chybí název dokumentu!");
    }

    const data = {
      name: name,
      text: text,
    };

    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/text`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      router.push(`/dashboard/${params.boardId}/${params.sectionId}`);
      setIsResetSnackbar(false);
      setSnackbar("Dokument byl vytvořen.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingName") {
        setSnackbar("Chybí název.");
      } else if (error === "nameTooLong") {
        setSnackbar("Název je příliš dlouhý.");
      } else if (error === "notUniqueName") {
        setSnackbar("Toto jméno bylo již použito.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  function handleNameText() {
    if (name.length > 30) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNameText();
  }, [name]);

  return (
    <>
      <TopBar
        name="Přidat text"
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}/add`)
        }
        desktopVisible={false}
      />

      {step === 0 && (
        <StepLayout>
          <section className="flex-1 flex flex-col justify-center items-center">
            <h2 className="text-center text-headline-medium mb-6">
              Zadejte název dokumentu
            </h2>
            <div className="max-w-72 sm:w-72">
              <TextField
                text="Název"
                color="surface-container"
                type="text"
                value={name}
                error={nameError}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </section>
          <div className="mt-6 w-full flex justify-end">
            <Button
              text="Další"
              type="button"
              buttonType="filled"
              onClick={() => {
                if (!name) {
                  return setNameError("Zadejte název dokumentu.");
                } else {
                  if (!nameError) {
                    setStep(1);
                  }
                }
              }}
            />
          </div>
        </StepLayout>
      )}
      {step === 1 && (
        <main className="flex flex-col w-full h-dvh py-6 pt-22 px-6 lg:mx-auto lg:w-4xl lg:h-screen lg:pt-6 lg:px-0">
          <Tiptap content={text} onChange={setText} />
          <div className="flex justify-between px-6 py-3 bg-surface-container rounded-b-3xl">
            <Button
              text="Zpět"
              type="button"
              buttonType="tonal"
              onClick={() => setStep(0)}
            />
            <div className="flex gap-2">
              <Button
                text="Vytvořit"
                type="button"
                buttonType="filled"
                onClick={handleText}
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
}
