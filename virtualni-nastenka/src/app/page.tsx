"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
      redirect: false,
    };

    const res = await signIn("credentials", data);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      if (res?.status == 401) {
        setEmailError("Zkontrolujte, zda jste zadali správný e-mail!");
        setPasswordError("Zkontrolujte, zda jste zadali správné heslo!");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  const inputs = [
    {
      text: "E-mail",
      color: "surface-container",
      type: "email",
      name: "email",
      value: email,
      error: emailError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
    },
    {
      text: "Heslo",
      color: "surface-container",
      type: "password",
      name: "password",
      value: password,
      error: passwordError,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
    },
  ];

  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-container sm:bg-surface lg:min-h-screen">
      <section className="rounded-3xl sm:p-14 sm:bg-surface-container">
        <h2 className="mb-8 text-center text-headline-large">Přihlaste se</h2>
        <form
          className="w-60 flex flex-col items-center gap-6"
          onSubmit={handleSubmit}
        >
          {inputs.map((input) => (
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
          <div className="mt-2">
            <Button text="Přihlásit se" buttonType="filled" />
          </div>
        </form>
      </section>
    </div>
  );
}
