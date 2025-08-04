"use client";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import IconButton from "@/components/IconButton";
import { useRef } from "react";
import SectionLayout from "@/components/SectionLayout";

export default function AddConversation() {
  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [message, setMessage] = useState("");

  const [attachment, setAttachment] = useState("");

  const attachmentRef = useRef<HTMLInputElement>(null);

  function handleNameConversation() {
    if (name.length > 255) {
      return setNameError("Název je příliš dlouhý.");
    } else {
      if (nameError) {
        setNameError("");
      }
    }
  }

  useEffect(() => {
    handleNameConversation();
  }, [name]);

  function handleCloseAttachment() {
    setAttachment("");
    if (attachmentRef.current) {
      attachmentRef.current.value = "";
    }
  }

  async function handleSendBulkMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name) {
      return setNameError("Zadejte název.");
    }

    if (!message) {
      return setSnackbar("Zadejte zprávu.");
    }

    if (nameError) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/conversations/bulk-messages", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setName("");
      setMessage("");
      setAttachment("");
      handleCloseAttachment();
      setSnackbar("Zpráva byla odeslána.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingName") {
        setSnackbar("Chybí název.");
      } else if (error === "nameTooLong") {
        setSnackbar("Název je příliš dlouhý.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  return (
    <>
      <TopBar
        name="Poslat hromadnou zprávu"
        onClick={() => router.push(`/dashboard/conversations`)}
      />
      <SectionLayout>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Hromadná zpráva
        </h1>
        <div className="flex flex-col items-center bg-surface-container rounded-3xl lg:p-14">
          <form
            onSubmit={handleSendBulkMessage}
            className="flex flex-col gap-4 w-full max-w-lg"
          >
            <section className="flex flex-col gap-6 w-full">
              <h2 className="text-headline-medium">Zadejte název</h2>
              <TextField
                text="Název"
                color="surface-container"
                type="text"
                name="name"
                value={name}
                error={nameError}
                onChange={(e) => setName(e.target.value)}
              />
            </section>
            <section className="flex flex-col gap-6 w-full">
              <h2 className="text-headline-medium">Napište zprávu</h2>
              <textarea
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-4 py-3 bg-transparent border rounded cursor-text border-outline focus:border-primary focus:outline-primary focus:outline focus:outline-2"
                placeholder="Zde napište zprávu"
              ></textarea>
            </section>
            <div className="w-full flex justify-between gap-2">
              <div className="flex gap-2 overflow-hidden">
                <label>
                  <IconButton
                    type="button"
                    src="/icons/attach-file.svg"
                    onClick={() => attachmentRef.current?.click()}
                  />
                  <input
                    type="file"
                    name="attachment"
                    ref={attachmentRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setAttachment(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {attachment && (
                  <div className="flex items-center gap-2 rounded-xl overflow-hidden">
                    <span className="truncate">{attachment}</span>
                    <IconButton
                      src="/icons/close.svg"
                      onClick={handleCloseAttachment}
                      size="small"
                    />
                  </div>
                )}
              </div>
              <div>
                <Button type="submit" text="Odeslat" buttonType="filled" />
              </div>
            </div>
          </form>
        </div>
      </SectionLayout>
    </>
  );
}
