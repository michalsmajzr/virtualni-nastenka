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
import { ClipLoader } from "react-spinners";
import { useTheme } from "next-themes";

export default function AddVideoPage() {
  const params = useParams() as { boardId: string; sectionId: string };

  const router = useRouter();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    setSnackbar("");
  }, [step]);

  async function handleSubmitVideo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    if (!name) {
      setLoading(false);
      return setSnackbar("Chybí název videa!");
    }

    const formData = new FormData(e.currentTarget);

    const video = formData.get("video");
    if (video instanceof Blob && !video.size) {
      setLoading(false);
      return setSnackbar("Nahrajte video!");
    }

    formData.append("name", name);

    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/video`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      setLoading(false);
      router.push(`/dashboard/${params.boardId}/${params.sectionId}`);
      setIsResetSnackbar(false);
      setSnackbar("Video bylo nahráno.");
    } else {
      setLoading(false);
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

  function handleNameVideo() {
    if (name.length > 30) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNameVideo();
  }, [name]);

  return (
    <>
      <TopBar
        name="Přidat video"
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}/add`)
        }
        desktopVisible={false}
      />
      <StepLayout step={step + 1} maxStep={2}>
        {step === 0 && (
          <>
            <section className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-headline-medium mb-6">Zadejte název videa</h2>
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
            <div className="mt-6 w-full flex justify-between gap-2">
              <Button
                text="Zpět"
                type="button"
                buttonType="tonal"
                onClick={() =>
                  router.push(
                    `/dashboard/${params.boardId}/${params.sectionId}/add`
                  )
                }
              />
              <Button
                text="Další"
                type="button"
                buttonType="filled"
                onClick={() => {
                  if (!name) {
                    return setNameError("Zadejte název videa.");
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
          <form onSubmit={handleSubmitVideo} className="flex-1 flex flex-col">
            <section className="flex-1 flex flex-col justify-start items-center">
              <h2 className="text-headline-medium mb-6">Nahrajte video</h2>
              <div className="relative flex items-center justify-center w-full h-full bg-surface-container-high rounded-2xl max-w-2xl">
                {loading && (
                  <div className="z-100 absolute top-12 left-0 w-full flex items-center justify-center absolute">
                    <ClipLoader
                      color={theme === "light" ? "#146683" : "#8ccff0"}
                      size={100}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}
                <label className="z-20 p-2 bg-surface-container-high rounded-full">
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    className="file:mr-4 file:py-2 file:px-6 file:bg-primary file:text-on-primary file:text-label-large
                    file:font-medium file:leading-6 file:rounded-full file:cursor-pointer"
                  />
                </label>
              </div>
            </section>
            <div className="mt-6 w-full flex justify-between">
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
