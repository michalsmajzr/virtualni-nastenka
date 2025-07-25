"use client";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Section } from "@/types/section";
import { Picture } from "@/types/board";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import StepLayout from "@/components/StepLayout";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import Image from "next/image";
import Dialog from "@/components/Dialog";
import Lists from "@/components/Lists";

export default function AddBoardPage() {
  const router = useRouter();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [currentPicture, setCurrentPicture] = useState(0);
  const [pictures, setPhotos] = useState<Picture[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [isOpenAddSection, setIsOpenAddSection] = useState(false);
  const [nameSection, setNameSection] = useState("");
  const [nameSectionError, setNameSectionError] = useState("");
  const [previewAddSection, setPreviewOpenAddSection] = useState<string | null>(
    null
  );
  const inputFileSectionRef = useRef<HTMLInputElement | null>(null);

  async function loadPictures() {
    const res = await fetch("/api/dashboard/add-board/pictures");

    if (res.ok) {
      const data = await res.json();
      const { pictures } = data;
      if (pictures) {
        setCurrentPicture(pictures[0].id);
        setPhotos(pictures);
      }
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadSections() {
    const res = await fetch("/api/dashboard/add-board/sections");

    if (res.ok) {
      const data = await res.json();
      const { sections } = data;
      if (sections) {
        setSections(sections);
      }
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadPictures();
    loadSections();
  }, []);

  useEffect(() => {
    setPreview(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }, [isOpen]);

  useEffect(() => {
    setPreviewOpenAddSection(null);
    if (inputFileSectionRef.current) {
      inputFileSectionRef.current.value = "";
    }
  }, [isOpenAddSection]);

  function handleNameBoard() {
    if (name.length > 30) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNameBoard();
  }, [name]);

  function handleNameSection() {
    if (nameSection.length > 30) {
      return setNameSectionError("Název je příliš dlouhý.");
    } else {
      if (nameSectionError) {
        setNameSectionError("");
      }
      return true;
    }
  }

  useEffect(() => {
    handleNameSection();
  }, [nameSection]);

  function handleSetChecked(i: number) {
    if (sections[i].checked === 0) {
      const newSection = [...sections];
      newSection[i].checked = 1;
      setSections(newSection);
    } else {
      const newSection = [...sections];
      newSection[i].checked = 0;
      setSections(newSection);
    }
  }

  async function handleSubmitUploadPicture(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!preview) {
      setIsOpen(false);
      return setSnackbar("Nebyl nahrán žádný obrázek!");
    }

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/dashboard/add-board/pictures", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const { id } = data;
      if (id) {
        setIsOpen(false);
        await loadPictures();
        setCurrentPicture(id);
        setSnackbar("Obrázek byl načten.");
      } else {
        setSnackbar("Obrázek se nenačetl.");
      }
    } else {
      setIsOpen(false);
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleCreateSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (nameSectionError) {
      return;
    }

    if (!previewAddSection) {
      return setSnackbar("Nebyl nahrán žádný obrázek!");
    }

    if (!nameSection) {
      return setNameSectionError("Zadejte název sekce.");
    }

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/dashboard/add-board/sections", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setNameSection("");
      setNameSectionError("");
      setIsOpenAddSection(false);
      loadSections();
      setSnackbar("Sekce byla vytvořena.");
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

  async function handleCreateBoard() {
    if (nameError) {
      return;
    }

    if (!currentPicture) {
      return setSnackbar("Vyberte obrázek!");
    }

    const data = {
      name: name,
      idPicture: currentPicture,
      sections: sections,
    };

    const res = await fetch("/api/dashboard/add-board", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard");
      setIsResetSnackbar(false);
      setSnackbar("Nástěnka byla vytvořena.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingNewSections") {
        setSnackbar("Zaškrtněte alespoň jednu sekci.");
      } else if (error === "missingName") {
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

  return (
    <>
      <TopBar
        name="Přidat nástěnku"
        onClick={() => router.push("/dashboard")}
        desktopVisible={false}
      />
      <StepLayout>
        <Dialog isOpen={isOpen} close={() => setIsOpen(false)}>
          <section
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-between h-fit p-10 bg-surface-container-high rounded-xl"
          >
            <h2 className="mb-4 w-full text-center text-headline-large">
              Nahrajte obrázek
            </h2>
            <div className="flex flex-col items-center gap-3">
              {preview ? (
                <Image
                  src={preview}
                  width={160}
                  height={160}
                  alt="Preview"
                  style={{
                    objectFit: "cover",
                  }}
                  className="h-40 w-72 my-2 bg-surface-container-highest rounded-xl"
                />
              ) : (
                <div className="h-40 w-72 p-6 my-2 flex items-center justify-center bg-surface-container-highest rounded-xl">
                  Náhled
                </div>
              )}
            </div>
            <form
              className="w-full pt-6 flex flex-col items-center gap-6 justify-between"
              onSubmit={handleSubmitUploadPicture}
            >
              <input
                type="file"
                name="board-picture"
                ref={inputFileRef}
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={(e) => {
                  setPreview(
                    e.target.files?.[0]
                      ? URL.createObjectURL(e.target.files[0])
                      : null
                  );
                }}
                className="file:mr-4 file:py-2 file:px-6 file:bg-primary file:text-on-primary file:text-label-large
                    file:font-medium file:leading-6 file:rounded-full file:cursor-pointer"
              />

              <div className="w-full flex gap-2 justify-end">
                <Button
                  text="Zrušit"
                  type="button"
                  buttonType="text"
                  onClick={() => setIsOpen(false)}
                />
                <Button text="Uložit" buttonType="filled" />
              </div>
            </form>
          </section>
        </Dialog>
        <Dialog
          isOpen={isOpenAddSection}
          close={() => {
            setNameSection("");
            setNameSectionError("");
            setIsOpenAddSection(false);
          }}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center justify-between h-fit p-10 bg-surface-container-high rounded-xl"
          >
            <form onSubmit={handleCreateSection}>
              <section className="flex-1 flex flex-col justify-center items-center">
                <h2 className="text-headline-large mb-4">
                  Vytvořte novou sekci
                </h2>
                <div className="w-72 mb-6">
                  <TextField
                    text="Název"
                    color="surface-container-high"
                    type="text"
                    name="section-name"
                    value={nameSection}
                    error={nameSectionError}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNameSection(e.target.value)
                    }
                  />
                </div>
              </section>
              <div className="flex flex-col items-center gap-3">
                {previewAddSection ? (
                  <Image
                    src={previewAddSection}
                    width={160}
                    height={160}
                    alt="Preview"
                    style={{
                      objectFit: "cover",
                    }}
                    className="h-40 w-72 my-2 bg-surface-container-highest rounded-xl"
                  />
                ) : (
                  <div className="h-40 w-72 p-6 my-2 flex items-center justify-center bg-surface-container-highest rounded-xl">
                    Náhled
                  </div>
                )}
              </div>

              <div className="w-full pt-6 flex flex-col items-center gap-6 justify-between">
                <input
                  type="file"
                  name="section-picture"
                  ref={inputFileSectionRef}
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={(e) => {
                    setPreviewOpenAddSection(
                      e.target.files?.[0]
                        ? URL.createObjectURL(e.target.files[0])
                        : null
                    );
                  }}
                  className="file:mr-4 file:py-2 file:px-6 file:bg-primary file:text-on-primary file:text-label-large
                    file:font-medium file:leading-6 file:rounded-full file:cursor-pointer"
                />

                <div className="w-full flex gap-2 justify-end">
                  <Button
                    text="Zrušit"
                    type="button"
                    buttonType="text"
                    onClick={() => {
                      setNameSection("");
                      setIsOpenAddSection(false);
                    }}
                  />
                  <Button text="Vytvořit" buttonType="filled" />
                </div>
              </div>
            </form>
          </section>
        </Dialog>
        {step === 0 && (
          <>
            <section className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-center text-headline-medium mb-6">
                Zadejte název nástěnky
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
                    return setNameError("Zadejte název nástěnky.");
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
          <>
            <section className="flex-1 flex flex-col justify-start items-center w-full overflow-hidden">
              <h2 className="text-headline-medium mb-6">
                Vyberte obrázek nástěnky
              </h2>
              <div
                className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-min gap-4 w-full h-full p-6
                bg-surface-container-high rounded-3xl overflow-auto max-w-lg"
              >
                {pictures.map((picture) => (
                  <label
                    key={picture.id}
                    className="group relative h-fit cursor-pointer"
                  >
                    <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded-xl"></div>
                    <input
                      type="radio"
                      name="picture"
                      value={currentPicture}
                      checked={currentPicture === picture.id}
                      onChange={() => setCurrentPicture(picture.id)}
                      className="absolute m-3"
                    />
                    <Image
                      src={picture.url}
                      width={300}
                      height={200}
                      alt="Image"
                      style={{
                        objectFit: "cover",
                      }}
                      className="w-full h-36 flex rounded-xl"
                    />
                  </label>
                ))}
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
                <Button
                  text="Přidat obrázek"
                  type="button"
                  buttonType="tonal"
                  onClick={() => setIsOpen(true)}
                />
                <Button
                  text="Další"
                  type="button"
                  buttonType="filled"
                  onClick={() => setStep(2)}
                />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <section className="flex-1 flex flex-col justify-start items-center overflow-hidden">
              <h2 className="text-headline-medium mb-6">Vyberte sekce</h2>
              <div className="flex flex-col gap-2 h-full w-full p-6 bg-surface-container-high rounded-3xl overflow-auto max-w-lg">
                {sections?.map((section, i) => (
                  <label key={section.id} className="w-full">
                    <Lists src={section.url} headline={section.name}>
                      <input
                        type="checkbox"
                        name="section"
                        checked={Boolean(section.checked)}
                        onChange={() => {
                          handleSetChecked(i);
                        }}
                        className="h-4 w-4 m-3 bg-white"
                      />
                    </Lists>
                  </label>
                ))}
              </div>
            </section>
            <div className="mt-6 w-full flex justify-between gap-2">
              <div className="flex">
                <Button
                  text="Zpět"
                  type="button"
                  buttonType="tonal"
                  onClick={() => setStep(1)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  text="Přidat sekci"
                  type="button"
                  buttonType="tonal"
                  onClick={() => setIsOpenAddSection(true)}
                />
                <Button
                  text="Vytvořit"
                  type="button"
                  buttonType="filled"
                  onClick={handleCreateBoard}
                />
              </div>
            </div>
          </>
        )}
      </StepLayout>
    </>
  );
}
