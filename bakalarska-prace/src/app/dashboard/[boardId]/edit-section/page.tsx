"use client";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { Section } from "@/types/section";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import StepLayout from "@/components/StepLayout";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import Image from "next/image";
import Dialog from "@/components/Dialog";
import Lists from "@/components/Lists";

export default function AddSectionPage() {
  const router = useRouter();
  const params = useParams();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);

  const [sections, setSections] = useState<Section[]>([]);
  const [isOpenAddSection, setIsOpenAddSection] = useState(false);
  const [nameSection, setNameSection] = useState("");
  const [nameSectionError, setNameSectionError] = useState("");
  const [previewAddSection, setPreviewOpenAddSection] = useState<string | null>(
    null
  );
  const inputFileSection = useRef<HTMLInputElement | null>(null);

  async function loadSections() {
    const res = await fetch(`/api/dashboard/${params.boardId}/edit-section`);

    if (res.ok) {
      const data = await res.json();
      const { sections } = data;
      setSections(sections);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    setPreviewOpenAddSection(null);
    if (inputFileSection.current) {
      inputFileSection.current.value = "";
    }
  }, [isOpenAddSection]);

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

  async function handleAddSections() {
    const data = {
      sections: sections,
    };

    const res = await fetch(`/api/dashboard/${params.boardId}/edit-section`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSnackbar("Sekce byla upravena.");
      setIsResetSnackbar(false);
      router.push(`/dashboard/${params.boardId}`);
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingNewSections") {
        setSnackbar("Zaškrtněte alespoň jednu nástěnku.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  return (
    <>
      <TopBar
        name="Přidat sekci"
        onClick={() => router.push(`/dashboard/${params.boardId}`)}
        desktopVisible={false}
      />
      <StepLayout>
        <Dialog
          isOpen={isOpenAddSection}
          close={() => {
            setNameSection("");
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
                  ref={inputFileSection}
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
        <>
          <section className="flex-1 flex flex-col justify-start items-center overflow-hidden">
            <h2 className="text-headline-medium mb-6">Vyberte sekce</h2>
            <div className="flex flex-col gap-2 h-full w-full p-6 bg-surface-container-high rounded-3xl overflow-auto max-w-lg">
              {sections?.map((section, i) => (
                <label key={section.id}>
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
          <div className="flex justify-end gap-2 mt-6">
            <Button
              text="Přidat sekci"
              type="button"
              buttonType="tonal"
              onClick={() => setIsOpenAddSection(true)}
            />
            <Button
              text="Přidat"
              type="button"
              buttonType="filled"
              onClick={handleAddSections}
            />
          </div>
        </>
      </StepLayout>
    </>
  );
}
