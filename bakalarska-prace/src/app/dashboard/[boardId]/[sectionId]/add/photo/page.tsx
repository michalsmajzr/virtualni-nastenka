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
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";
import Lists from "@/components/Lists";
import IconButton from "@/components/IconButton";

/* dle: https://www.npmjs.com/package/react-images-uploading */

export default function AddPhotoPage() {
  const params = useParams() as { boardId: string; sectionId: string };

  const router = useRouter();

  const { setSnackbar, setIsResetSnackbar } = useContext(SnackbarContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [photos, setPhotos] = useState<ImageType[]>([]);

  async function handleCreatePhotoGallery() {
    if (!name) {
      return setSnackbar("Chybí název fotografie!");
    }

    const formData = new FormData();
    formData.append("name", name);
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].file) {
        formData.append("photo", photos[i].file as File);
      }
    }

    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/photo-gallery`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      router.push(`/dashboard/${params.boardId}/${params.sectionId}`);
      setIsResetSnackbar(false);
      setSnackbar("Fotografie byla nahrána.");
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

  function handleNamePhoto() {
    if (name.length > 30) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNamePhoto();
  }, [name]);

  const maxNumber = 100;

  const onChange = (imageList: ImageListType) => {
    setPhotos(imageList as never[]);
  };

  return (
    <>
      <TopBar
        name="Přidat fotografie"
        onClick={() =>
          router.push(`/dashboard/${params.boardId}/${params.sectionId}/add`)
        }
        desktopVisible={false}
      />

      <StepLayout>
        {step === 0 && (
          <>
            <section className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-headline-medium mb-6">
                Zadejte název fotogalerie
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
                    return setNameError("Zadejte název fotogalerie.");
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
            <section className="flex-1 flex flex-col justify-start items-center overflow-hidden">
              <h2 className="text-headline-medium mb-6">Nahrajte fotografie</h2>
              <div className="flex-1 flex flex-col items-center w-full overflow-hidden">
                <ImageUploading
                  multiple
                  value={photos}
                  onChange={onChange}
                  maxNumber={maxNumber}
                  acceptType={[
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                    "svg",
                    "avif",
                  ]}
                  onError={(errors) => {
                    if (errors?.acceptType) {
                      setSnackbar(
                        "Podporované typy obrázků jsou jpg, png a gif."
                      );
                    }
                    if (errors?.maxNumber) {
                      setSnackbar("Překročen maximální počet obrázků.");
                    }
                  }}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    dragProps,
                  }) => (
                    <div
                      className="flex-1 flex flex-col items-center gap-4 w-full overflow-hidden max-w-2xl"
                      {...dragProps}
                    >
                      <div className="flex-1 flex gap-2">
                        <Button
                          text={"Nahrajte fotografie"}
                          type="button"
                          buttonType="filled"
                          onClick={() => {
                            onImageUpload();
                          }}
                        />
                        <Button
                          text="Vymazat fotografie"
                          type="button"
                          buttonType="tonal"
                          onClick={onImageRemoveAll}
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full h-full p-6 bg-surface-container-high rounded-3xl overflow-auto">
                        {imageList.map((image, index) => (
                          <Lists
                            key={index}
                            src={image.dataURL}
                            headline={image.file?.name}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <IconButton
                                src="/icons/edit.svg"
                                onClick={() => {
                                  onImageUpdate(index);
                                }}
                              />
                              <IconButton
                                src="/icons/delete.svg"
                                onClick={() => {
                                  onImageRemove(index);
                                }}
                              />
                            </div>
                          </Lists>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
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
                  text="Uložit"
                  buttonType="filled"
                  onClick={handleCreatePhotoGallery}
                />
              </div>
            </div>
          </>
        )}
      </StepLayout>
    </>
  );
}
