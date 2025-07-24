"use client";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import TopBar from "@/components/TopBar";
import SectionLayout from "@/components/SectionLayout";
import Dialog from "@/components/Dialog";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { ReactSVG } from "react-svg";
import { useRef } from "react";
import Image from "next/image";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import parsePhoneNumber from "libphonenumber-js";

export default function Account() {
  const { setSnackbar } = useContext(SnackbarContext);

  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [surname, setSurname] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  async function loadData() {
    const res = await fetch("/api/account");

    if (res.ok) {
      const data = await res.json();
      const { firstname, surname, phone, url } = data;
      let uniqueUrl;
      if (url) {
        uniqueUrl = `${url}?uuid=${crypto.randomUUID()}`; // aby se při zmeně načetl okamžitě nový obrázek
      } else {
        uniqueUrl = null;
      }
      setFirstname(firstname);
      setSurname(surname);
      setPhone(phone);
      setProfilePhoto(uniqueUrl);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setPreview(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }, [isOpen]);

  function handleNameFirstname() {
    if (firstname.length > 30) {
      return setFirstnameError("Název je příliš dlouhý.");
    } else {
      if (firstnameError) {
        setFirstnameError("");
      }
    }
  }

  useEffect(() => {
    handleNameFirstname();
  }, [firstname]);

  function handleNameSurname() {
    if (surname.length > 30) {
      return setSurnameError("Název je příliš dlouhý.");
    } else {
      if (surnameError) {
        setSurnameError("");
      }
    }
  }

  useEffect(() => {
    handleNameSurname();
  }, [surname]);

  function handleNamePhone() {
    if (phone.length > 20) {
      return setPhoneError("Název je příliš dlouhý.");
    } else {
      if (phoneError) {
        setPhoneError("");
      }
    }
  }

  useEffect(() => {
    handleNamePhone();
  }, [phone]);

  async function handleSubmitUploadProfilePhoto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!preview) {
      setIsOpen(false);
      return setSnackbar("Nebyl nahrán žádný obrázek!");
    }

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/account/profile-photo", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const { profilePhoto } = data;
      if (profilePhoto) {
        setIsOpen(false);
        loadData();
        setSnackbar("Profilová fotka byla změněna.");
      } else {
        setSnackbar("Fotografie se nenačetla.");
      }
    } else {
      setIsOpen(false);
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleDeleteProfilePhoto() {
    const res = await fetch("/api/account/profile-photo", {
      method: "DELETE",
    });

    if (res.ok) {
      setIsOpen(false);
      setProfilePhoto("");
      setSnackbar("Profilový obrázek byl smazán");
    } else {
      setIsOpen(false);
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleSubmitChangeUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstname) {
      return setFirstnameError("Zadejte jméno.");
    }

    if (!surname) {
      return setSurnameError("Zadejte příjmení.");
    }

    const phoneNumber = parsePhoneNumber(phone, "CZ");
    if (!phoneNumber?.isValid()) {
      return setPhoneError("Zadejte platné telefonní číslo.");
    }

    if (firstnameError || surnameError || phoneError) {
      return;
    }

    const data = {
      firstname: firstname,
      surname: surname,
      phone: phone,
    };

    const res = await fetch("/api/account/user", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSnackbar("Data byla aktualizována.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingFirstname") {
        setSnackbar("Chybí jméno.");
      } else if (error === "missingSurname") {
        setSnackbar("Chybí příjmení.");
      } else if (error === "missingPhone") {
        setSnackbar("Chybí telefonní číslo.");
      } else if (error === "firstnameTooLong") {
        setSnackbar("Jméno je příliš dlouhé.");
      } else if (error === "surnameTooLong") {
        setSnackbar("Příjmení je příliš dlouhé.");
      } else if (error === "phoneTooLong") {
        setSnackbar("Telefonní číslo je příliš dlouhé.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleSubmitChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      newConfirmPassword: newConfirmPassword,
    };

    const res = await fetch("/api/account/password", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
      setNewConfirmPassword("");
      setSnackbar("Data byla aktualizována.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "oldPasswordDoNotMatch") {
        setSnackbar("Zadejte správné heslo.");
      } else if (error === "confirmPasswordDoNotMatch") {
        setSnackbar("Hesla se neshodují.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  const inputsChangeInformation = [
    {
      text: "Jméno",
      color: "surface-container",
      type: "text",
      value: firstname,
      error: firstnameError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFirstname(e.target.value),
    },
    {
      text: "Příjmení",
      color: "surface-container",
      type: "text",
      value: surname,
      error: surnameError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSurname(e.target.value),
    },
    {
      text: "Telefonní číslo",
      color: "surface-container",
      type: "tel",
      value: phone,
      error: phoneError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPhone(e.target.value),
    },
  ];

  const inputChangePassword = [
    {
      text: "Původní heslo",
      color: "surface-container",
      type: "password",
      value: oldPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setOldPassword(e.target.value),
    },
    {
      text: "Nové heslo",
      color: "surface-container",
      type: "password",
      value: newPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewPassword(e.target.value),
    },
    {
      text: "Potvrďte nové heslo",
      color: "surface-container",
      type: "password",
      value: newConfirmPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewConfirmPassword(e.target.value),
    },
  ];

  return (
    <>
      <TopBar name="Nastavení účtu" />
      <Dialog isOpen={isOpen} close={() => setIsOpen(false)}>
        <section
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center justify-between h-fit p-10 bg-surface-container-high rounded-xl"
        >
          <h2 className="w-full mb-4 text-center text-headline-large">
            Nahrajte obrázek
          </h2>
          <div className="flex flex-col items-center gap-3">
            {preview ? (
              <Image
                src={preview}
                width={160}
                height={160}
                alt="Profile photo"
                style={{
                  objectFit: "cover",
                }}
                className="h-36 w-36 overflow-hidden flex items-center justify-center rounded-full"
              />
            ) : profilePhoto ? (
              <>
                <Image
                  src={profilePhoto}
                  width={160}
                  height={160}
                  alt="Profile photo"
                  style={{
                    objectFit: "cover",
                  }}
                  className="h-36 w-36 overflow-hidden flex items-center justify-center rounded-full"
                />
                <div className="relative">
                  <div
                    onClick={() => handleDeleteProfilePhoto()}
                    className="z-50 absolute overflow-hidden translate-x-5 -translate-y-16 h-6 w-6 p-5 border-[5px] border-surface-container 
          inset-0 bg-surface-container opacity-0 hover:opacity-10 rounded-full cursor-pointer"
                  ></div>
                  <ReactSVG
                    src="/icons/delete.svg"
                    className="z-40 absolute translate-x-5 -translate-y-16 h-6 w-6 p-5 border-4 border-surface-container 
          flex items-center justify-center bg-primary text-on-primary rounded-full"
                  />
                </div>
              </>
            ) : (
              <ReactSVG
                src="/icons/account-circle-160dp.svg"
                className="h-36 w-36 overflow-hidden flex items-center justify-center text-on-surface-variant rounded-full"
              />
            )}
          </div>

          <form
            className="w-full pt-6 flex flex-col items-center gap-6 justify-between"
            onSubmit={handleSubmitUploadProfilePhoto}
          >
            <input
              type="file"
              name="profile-photo"
              ref={inputFileRef}
              accept="image/*"
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
      <SectionLayout isVisibleSideNavOnMobile={true}>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Nastavení účtu
        </h1>
        <div className="flex flex-col gap-6 bg-surface-container rounded-3xl lg:p-14">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-3 w-full  max-w-sm mb-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      width={160}
                      height={160}
                      alt="Profile photo"
                      style={{
                        objectFit: "cover",
                      }}
                      className="h-36 w-36 overflow-hidden flex items-center justify-center rounded-full"
                    />
                  ) : (
                    <ReactSVG
                      src="/icons/account-circle-160dp.svg"
                      className="h-36 w-36 flex items-center justify-center text-on-surface-variant rounded-full"
                    />
                  )}

                  <div className="relative">
                    <div
                      onClick={() => setIsOpen(true)}
                      className="z-20 absolute overflow-hidden translate-x-23 -translate-y-13 h-6 w-6 p-5 border-5 border-surface-container 
                      inset-0 bg-surface-container opacity-0 hover:opacity-10 rounded-full cursor-pointer"
                    ></div>
                    <ReactSVG
                      src="/icons/edit.svg"
                      className="z-10 absolute translate-x-23 -translate-y-13 h-6 w-6 p-5 border-4 border-surface-container 
                      flex items-center justify-center bg-primary text-on-primary rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitChangeUser}
          >
            <section className="flex flex-col gap-6 w-full max-w-sm">
              <h2 className="text-headline-medium">Základní informace</h2>
              {inputsChangeInformation.map((input) => (
                <TextField
                  key={input.text}
                  text={input.text}
                  color={input.color}
                  type={input.type}
                  value={input.value}
                  error={input.error}
                  onChange={input.onChange}
                />
              ))}
              <div className="flex justify-end">
                <Button text="Uložit" buttonType="filled" />
              </div>
            </section>
          </form>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitChangePassword}
          >
            <section className="flex flex-col gap-6 w-full max-w-sm">
              <h2 className="text-headline-medium">Změna hesla</h2>
              {inputChangePassword.map((input) => (
                <TextField
                  key={input.text}
                  text={input.text}
                  color={input.color}
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                />
              ))}
              <div className="flex justify-end">
                <Button text="Změnit" buttonType="filled" />
              </div>
            </section>
          </form>
        </div>
      </SectionLayout>
    </>
  );
}
