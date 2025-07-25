"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import StepLayout from "@/components/StepLayout";
import Button from "@/components/Button";
import TextField from "@/components/TextField";

export default function AddAudioPage() {
  const params = useParams() as { boardId: string; sectionId: string };

  const router = useRouter();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  async function handleSubmitAudio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name) {
      return setSnackbar("Chybí název audia!");
    }

    const formData = new FormData(e.currentTarget);

    const audio = formData.get("audio");
    if (audio instanceof File && !audio.size) {
      return setSnackbar("Nahrajte audio!");
    }

    formData.append("name", name);

    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/audio`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      router.push(`/dashboard/${params.boardId}/${params.sectionId}`);
      setIsResetSnackbar(false);
      setSnackbar("Audio bylo nahráno.");
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

  function handleNameAudio() {
    if (name.length > 30) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNameAudio();
  }, [name]);

  return (
    <>
      <TopBar
        name="Přidat audio"
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}/add`)
        }
        desktopVisible={false}
      />

      <StepLayout>
        {step === 0 && (
          <>
            <section className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-headline-medium mb-6">Zadejte název audia</h2>
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
                    return setNameError("Zadejte název audia.");
                  } else {
                    if (!nameError) {
                      setStep(1);
                    }
                  }
                }}
              />
            </div>
          </>
        )}
        {step === 1 && (
          <form onSubmit={handleSubmitAudio} className="flex-1 flex flex-col">
            <section className="flex-1 flex flex-col justify-start items-center">
              <h2 className="text-headline-medium mb-6">Nahrajte audio</h2>
              <div className="relative flex items-center justify-center w-full h-full bg-surface-container-high rounded-2xl max-w-2xl">
                <label className="z-20 p-2 bg-surface-container-high rounded-full">
                  <input
                    type="file"
                    name="audio"
                    accept="audio/*"
                    className="file:mr-4 file:py-2 file:px-6 file:bg-primary file:text-on-primary file:text-label-large
                    file:font-medium file:leading-6 file:rounded-full file:cursor-pointer"
                  />
                </label>
              </div>
            </section>
            <div className="mt-6 w-full flex justify-between gap-2">
              <Button
                text="Zpět"
                type="button"
                buttonType="tonal"
                onClick={() => setStep(0)}
              />
              <div className="flex gap-2">
                <Button text="Uložit" type="submit" buttonType="filled" />
              </div>
            </div>
          </form>
        )}
      </StepLayout>
    </>
  );
}
