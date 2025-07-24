"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";

export default function ResetPassword() {
  const searchParams = useSearchParams();

  const { setSnackbar } = useContext(SnackbarContext);

  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const router = useRouter();

  async function handleSubmitResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      newPassword: newPassword,
      newConfirmPassword: newConfirmPassword,
      token: searchParams.get("token")?.toString(),
    };

    const res = await fetch(
      `/api/administration?token=${searchParams.get("token")}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "confirmPasswordDoNotMatch") {
        setSnackbar("Hesla se neshodují.");
      } else if (error === "unauthorized") {
        setSnackbar("Neplatný odkaz.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  const inputs = [
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
    <div className="min-h-dvh flex items-center justify-center bg-surface-container sm:bg-surface lg:min-h-screen">
      <section className="rounded-3xl sm:p-14 sm:bg-surface-container">
        <h2 className="mb-8 text-center text-headline-large">Nastavte heslo</h2>
        <form
          className="w-60 flex flex-col items-center gap-6"
          onSubmit={handleSubmitResetPassword}
        >
          {inputs.map((input) => (
            <TextField
              key={input.text}
              text={input.text}
              color={input.color}
              type={input.type}
              value={input.value}
              onChange={input.onChange}
            />
          ))}
          <div className="mt-2">
            <Button text="Nastavit heslo" buttonType="filled" />
          </div>
        </form>
      </section>
    </div>
  );
}
