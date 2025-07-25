"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import TopBar from "@/components/TopBar";
import SectionLayout from "@/components/SectionLayout";
import Dialog from "@/components/Dialog";
import TextDialog from "@/components/TextDialog";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import parsePhoneNumber from "libphonenumber-js";

export default function Add() {
  const params = useParams();

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenResetPassword, setIsOpenResetPassword] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [surname, setSurname] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  async function loadUser() {
    const res = await fetch(`/api/administration/${params.id}`);

    if (res.ok) {
      const data = await res.json();
      const { firstname, surname, phone } = data;
      setFirstname(firstname);
      setSurname(surname);
      setPhone(phone);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

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

  async function handleSubmitEditUser(e: FormEvent<HTMLFormElement>) {
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

    const res = await fetch(`/api/administration/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSnackbar("Uživatelská data uložena.");
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

  async function handleDeleteUser() {
    const res = await fetch(`/api/administration/${params.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/dashboard/administration`);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleResetPassword() {
    const res = await fetch(`/api/administration/${params.id}/password`, {
      method: "PUT",
    });

    if (res.ok) {
      setSnackbar("Heslo bylo resetováno.");
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  const inputsSetInformation = [
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

  return (
    <>
      <TopBar
        name="Upravit uživatele"
        onClick={() => router.push(`/dashboard/administration`)}
      />
      <SectionLayout>
        <Dialog
          isOpen={isOpenDelete}
          close={() => {
            setIsOpenDelete(false);
          }}
        >
          <TextDialog
            text="Opravdu chcete smazat uživatele?"
            close={() => setIsOpenDelete(false)}
            submit={() => {
              handleDeleteUser();
            }}
          />
        </Dialog>
        <Dialog
          isOpen={isOpenResetPassword}
          close={() => {
            setIsOpenResetPassword(false);
          }}
        >
          <TextDialog
            text="Opravdu chcete resetovat heslo uživatele?"
            close={() => setIsOpenResetPassword(false)}
            submit={() => {
              handleResetPassword();
              setIsOpenResetPassword(false);
            }}
          />
        </Dialog>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Upravit uživatele
        </h1>
        <div className="bg-surface-container rounded-3xl lg:p-14">
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitEditUser}
          >
            <section className="flex flex-col gap-6 w-full max-w-sm">
              <h2 className="text-headline-medium">Upravte informace</h2>
              {inputsSetInformation.map((input) => (
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
              <div className="flex justify-center gap-3">
                <Button
                  text="Smazat uživatele"
                  type="button"
                  buttonType="text"
                  onClick={() => {
                    setIsOpenDelete(true);
                  }}
                />
                <Button
                  text="Resetovat heslo"
                  type="button"
                  buttonType="text"
                  onClick={() => setIsOpenResetPassword(true)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button text="Uložit" buttonType="filled" />
              </div>
            </section>
          </form>
        </div>
      </SectionLayout>
    </>
  );
}
