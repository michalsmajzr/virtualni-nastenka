"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import SectionLayout from "@/components/SectionLayout";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import Button from "@/components/Button";
import { ReactSVG } from "react-svg";
import Image from "next/image";

export default function User() {
  const params = useParams();

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  async function loadUser() {
    const res = await fetch(`/api/administration/${params.id}`);

    if (res.ok) {
      const data = await res.json();
      const { firstname, surname, email, phone, url } = data;
      setFirstname(firstname);
      setSurname(surname);
      setEmail(email);
      setPhone(phone);
      setProfilePhoto(url);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const inputsInformation = [
    {
      title: "E-mail",
      text: email,
    },
    {
      title: "Telefonní číslo",
      text: phone,
    },
  ];

  return (
    <>
      <TopBar
        name="Uživatel"
        onClick={() => router.push(`/dashboard/administration`)}
      />
      <SectionLayout>
        <h1 className="hidden text-display-large mb-6 lg:block">Uživatel</h1>
        <div className="flex flex-col gap-6 bg-surface-container rounded-3xl">
          <div className="w-full flex flex-col gap-6 lg:p-14">
            <div className="flex flex-col items-center justify-center gap-4">
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
              </div>
              <span className="text-center text-headline-large font-medium">
                {firstname} {surname}
              </span>
            </div>
            <div className="flex justify-center">
              <section className="w-full p-6 bg-surface-container-high w-full max-w-lg rounded-3xl">
                <h2 className="mb-4 text-headline-small font-medium">
                  Základní informace
                </h2>
                <dl className="flex flex-col gap-4">
                  {inputsInformation.map((input) => (
                    <div key={input.title}>
                      <dt className="font-medium">{input.title}</dt>
                      <dl>{input.text}</dl>
                    </div>
                  ))}
                </dl>
                <div className="mt-2 flex justify-end">
                  <Button
                    text="Upravit"
                    type="button"
                    buttonType="filled"
                    onClick={() =>
                      router.push(
                        `/dashboard/administration/edit-user/${params.id}`
                      )
                    }
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
