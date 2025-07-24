"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import SectionLayout from "@/components/SectionLayout";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import { FormEvent } from "react";
import validator from "validator";
import parsePhoneNumber from "libphonenumber-js";

export default function AddUser() {
  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [surname, setSurname] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

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

  function handleNameEmail() {
    if (email.length > 255) {
      return setEmailError("Název je příliš dlouhý.");
    } else {
      if (emailError) {
        setEmailError("");
      }
    }
  }

  useEffect(() => {
    handleNameEmail();
  }, [email]);

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

  async function handleSubmitAddUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstname) {
      return setFirstnameError("Zadejte jméno.");
    }

    if (!surname) {
      return setSurnameError("Zadejte příjmení.");
    }

    const phoneNumber = parsePhoneNumber(phone, "CZ");
    if (!validator.isEmail(email) && !phoneNumber?.isValid()) {
      setEmailError("Zadejte platný e-mail.");
      return setPhoneError("Zadejte platné telefonní číslo.");
    } else if (!validator.isEmail(email)) {
      return setEmailError("Zadejte platný e-mail.");
    } else if (!phoneNumber?.isValid()) {
      return setPhoneError("Zadejte platné telefonní číslo.");
    }

    if (firstnameError || surnameError || emailError || phoneError) {
      return;
    }

    const data = {
      firstname: firstname,
      surname: surname,
      email: email,
      phone: phoneNumber?.formatInternational(),
    };

    const res = await fetch("/api/administration", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSnackbar("Uživatel byl přidán.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingFirstname") {
        setSnackbar("Chybí jméno.");
      } else if (error === "missingSurname") {
        setSnackbar("Chybí příjmení.");
      } else if (error === "missingEmail") {
        setSnackbar("Chybí email.");
      } else if (error === "missingPhone") {
        setSnackbar("Chybí telefonní číslo.");
      } else if (error === "firstnameTooLong") {
        setSnackbar("Jméno je příliš dlouhé.");
      } else if (error === "surnameTooLong") {
        setSnackbar("Příjmení je příliš dlouhé.");
      } else if (error === "emailTooLong") {
        setSnackbar("Email je příliš dlouhý.");
      } else if (error === "phoneTooLong") {
        setSnackbar("Telefonní číslo je příliš dlouhé.");
      } else if (error === "notUniqueEmail") {
        setSnackbar("Tento e-mail už je registrovaný.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
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
      text: "E-mail",
      color: "surface-container",
      type: "email",
      value: email,
      error: emailError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
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
        name="Přidat uživatele"
        onClick={() => router.push(`/dashboard/administration`)}
      />
      <SectionLayout>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Přidat uživatele
        </h1>
        <div className="bg-surface-container rounded-3xl lg:p-14">
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitAddUser}
          >
            <section className="flex flex-col gap-6 w-full max-w-sm">
              <h2 className="text-headline-medium">Zadejte informace</h2>
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
              <div className="flex justify-end">
                <Button text="Uložit" buttonType="filled" />
              </div>
            </section>
          </form>
        </div>
      </SectionLayout>
    </>
  );
}
