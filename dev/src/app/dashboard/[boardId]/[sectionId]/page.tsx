"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import Card from "@/components/Card";
import Navigation from "@/components/Navigation";
import { Post } from "@/types/post";
import BoardLayout from "@/components/BoardLayout";

export default function Section() {
  const router = useRouter();
  const params = useParams() as { boardId: string; sectionId: string };

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { setSnackbar } = useContext(SnackbarContext);

  const [boardName, setBoardName] = useState("");
  const [sectionName, setSectionName] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);

  async function searchPosts() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${
        params.sectionId
      }/search?query=${searchParams.get("query")}`
    );

    if (res.ok) {
      const data = await res.json();
      const { posts } = data;
      setPosts(posts);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadNames() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}/navigation`
    );

    if (res.ok) {
      const data = await res.json();
      const { nameBoard, nameSection } = data;
      setBoardName(nameBoard);
      setSectionName(nameSection);
    } else if (res.status === 404) {
      return setSnackbar("Sekce nenalezena.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadPosts() {
    const res = await fetch(
      `/api/dashboard/${params.boardId}/${params.sectionId}`
    );

    if (res.ok) {
      const data = await res.json();
      const { posts } = data;
      setPosts(posts);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleArchive(id: number) {
    const res = await fetch(`/api/archive/posts/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      loadPosts();
      return setSnackbar("Příspěvek byl archivován.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadNames();
  }, []);

  useEffect(() => {
    if (query) {
      searchPosts();
    } else {
      loadPosts();
    }
  }, [query]);

  return (
    <>
      <TopBar
        name={sectionName}
        onClick={() => router.push(`/dashboard/${params.boardId}`)}
      />
      <DashboardLayout>
        <Navigation
          boardName={boardName}
          boardId={params?.boardId}
          sectionName={sectionName}
          sectionId={params?.sectionId}
        />

        <BoardLayout>
          {posts?.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              src={post.thumbnail_url}
              name={post.name}
              onClick={() =>
                router.push(
                  `/dashboard/${params.boardId}/${params.sectionId}/${post.type}/${post.id}`
                )
              }
              menuItems={[
                {
                  text: "Archivovat",
                  onClick: () => handleArchive(post.id),
                },
              ]}
              badgeType={post.badge_time === null ? "small" : undefined}
            />
          ))}
        </BoardLayout>
      </DashboardLayout>
    </>
  );
}
