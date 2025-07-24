"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import BoardLayout from "@/components/BoardLayout";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import Card from "@/components/Card";
import { Board } from "@/types/board";
import Navigation from "@/components/Navigation";

export default function Boards() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [boards, setBoards] = useState<Board[]>([]);

  async function searchBoards() {
    const res = await fetch(
      `/api/dashboard/search?query=${searchParams.get("query")}`
    );

    if (res.ok) {
      const data = await res.json();
      const { boards } = data;
      setBoards(boards);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadBoards() {
    const res = await fetch("/api/dashboard");

    if (res.ok) {
      const data = await res.json();
      const { boards } = data;
      setBoards(boards);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    if (query) {
      searchBoards();
    } else {
      loadBoards();
    }
  }, [query]);

  async function handleArchive(id: number) {
    const res = await fetch(`/api/archive/boards/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      loadBoards();
      return setSnackbar("Nástěnka byla archivován.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  return (
    <>
      <TopBar name="Nástěnky" />
      <DashboardLayout>
        <Navigation />
        <BoardLayout>
          {boards.map((board) => (
            <Card
              key={board.id}
              id={board.id}
              src={board.url}
              name={board.name}
              onClick={() => router.push(`/dashboard/${board.id}`)}
              menuItems={[
                {
                  text: "Archivovat",
                  onClick: () => handleArchive(board.id),
                },
              ]}
              badgeCount={board.badge_count}
            />
          ))}
        </BoardLayout>
      </DashboardLayout>
    </>
  );
}
