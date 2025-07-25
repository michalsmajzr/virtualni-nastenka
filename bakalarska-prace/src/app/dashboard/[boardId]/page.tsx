"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import Card from "@/components/Card";
import { Section } from "@/types/section";
import Navigation from "@/components/Navigation";

export default function Board() {
  const params = useParams() as { boardId: string };

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [name, setName] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  async function loadName() {
    const res = await fetch(`/api/dashboard/${params.boardId}/navigation`);

    if (res.ok) {
      const data = await res.json();
      const { nameBoard } = data;
      setName(nameBoard);
    } else if (res.status === 404) {
      return setSnackbar("Sekce nenalezena.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function searchSections() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/search?query=${searchParams.get(
        "query"
      )}`
    );

    if (res.ok) {
      const data = await res.json();
      const { sections } = data;
      setSections(sections);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadSections() {
    const res = await fetch(`/api/dashboard/${params.boardId}`);

    if (res.ok) {
      const data = await res.json();
      const { sections } = data;
      setSections(sections);
    } else if (res.status === 404) {
      return setSnackbar("Nástěnka nenalezena.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadName();
  }, []);

  useEffect(() => {
    if (query) {
      searchSections();
    } else {
      loadSections();
    }
  }, [query]);

  async function handleArchive(id: number) {
    const res = await fetch(`/api/archive/sections/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      loadSections();
      return setSnackbar("Sekce byla archivován.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  return (
    <>
      <TopBar name={name} onClick={() => router.push(`/dashboard`)} />
      <div className="w-full max-w-screen-xl mx-auto">
        <DashboardLayout>
          <Navigation boardName={name} boardId={params?.boardId} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {sections.map((section) => (
              <Card
                key={section.id}
                id={section.id}
                src={section.url}
                name={section.name}
                onClick={() =>
                  router.push(`/dashboard/${params.boardId}/${section.id}`)
                }
                menuItems={[
                  {
                    text: "Archivovat",
                    onClick: () => handleArchive(section.id),
                  },
                ]}
                badgeCount={section.badge_count}
              />
            ))}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
