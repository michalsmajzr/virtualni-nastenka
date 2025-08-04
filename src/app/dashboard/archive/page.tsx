"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BoardLayout from "@/components/BoardLayout";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import Card from "@/components/Card";
import { Board } from "@/types/board";
import { Section } from "@/types/section";
import { Post } from "@/types/post";
import Dialog from "@/components/Dialog";
import TextDialog from "@/components/TextDialog";

export default function Archive() {
  const { setSnackbar } = useContext(SnackbarContext);

  const [boards, setBoards] = useState<Board[]>([]);
  const [boardId, setBoardId] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postId, setPostId] = useState<number | null>(null);

  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function loadBoards() {
    const res = await fetch("/api/archive/boards");

    if (res.ok) {
      const data = await res.json();
      const { boards } = data;
      setBoards(boards);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadSections() {
    const res = await fetch("/api/archive/sections");

    if (res.ok) {
      const data = await res.json();
      const { sections } = data;
      setSections(sections);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadPosts() {
    const res = await fetch("/api/archive/posts");

    if (res.ok) {
      const data = await res.json();
      const { posts } = data;
      setPosts(posts);
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadBoards();
    loadSections();
    loadPosts();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBoardId(null);
      setSectionId(null);
      setPostId(null);
    }
  }, [isOpen]);

  async function handleBoardRestore(id: number) {
    const res = await fetch(`/api/archive/boards/${id}`, {
      method: "PUT",
    });

    if (res.ok) {
      loadBoards();
      return setSnackbar("Nástěnka byl obnovena.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleBoardDelete(id: number) {
    const res = await fetch(`/api/archive/boards/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadBoards();
      loadSections();
      loadPosts();
      return setSnackbar("Nástěnka byla smazána.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleSectionRestore(id: number) {
    const res = await fetch(`/api/archive/sections/${id}`, {
      method: "PUT",
    });

    if (res.ok) {
      loadSections();
      return setSnackbar("Sekce byl obnovena.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handleSectionDelete(id: number) {
    const res = await fetch(`/api/archive/sections/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadSections();
      loadPosts();
      return setSnackbar("Sekce byla smazána.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handlePostsRestore(id: number) {
    const res = await fetch(`/api/archive/posts/${id}`, {
      method: "PUT",
    });

    if (res.ok) {
      loadPosts();
      return setSnackbar("Příspěvek byl obnoven.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function handlePostsDelete(id: number) {
    const res = await fetch(`/api/archive/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadPosts();
      return setSnackbar("Příspěvek byl smazán.");
    } else {
      return setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  return (
    <>
      <TopBar name="Archiv" />
      <Dialog
        isOpen={isOpen}
        close={() => {
          setIsOpen(false);
        }}
      >
        <TextDialog
          text={text}
          close={() => setIsOpen(false)}
          submit={() => {
            if (postId) {
              handlePostsDelete(postId);
            } else if (sectionId) {
              handleSectionDelete(sectionId);
            } else if (boardId) {
              handleBoardDelete(boardId);
            }
          }}
        />
      </Dialog>
      <DashboardLayout>
        <h1 className="hidden text-display-large mb-6 lg:block">Archiv</h1>
        <div className="flex flex-col gap-6">
          {boards.length > 0 && (
            <section className="flex flex-col">
              <h2 className="text-title-large font-medium tracking-wide mb-6">
                Nástěnky
              </h2>
              <BoardLayout>
                {boards.map((board) => (
                  <Card
                    key={board.id}
                    id={board.id}
                    src={board.url}
                    name={board.name}
                    menuItems={[
                      {
                        text: "Obnovit",
                        onClick: () => handleBoardRestore(board.id),
                      },
                      {
                        text: "Smazat",
                        onClick: () => {
                          setBoardId(board.id);
                          setText("Opravdu chcete nástěnku smazat");
                          setIsOpen(true);
                        },
                      },
                    ]}
                    archived={true}
                  />
                ))}
              </BoardLayout>
            </section>
          )}
          {sections.length > 0 && (
            <section className="flex flex-col">
              <h2 className="text-title-large font-medium tracking-wide mb-6">
                Sekce
              </h2>
              <BoardLayout>
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    id={section.id}
                    src={section.url}
                    name={section.name}
                    menuItems={[
                      {
                        text: "Obnovit",
                        onClick: () => handleSectionRestore(section.id),
                      },
                      {
                        text: "Smazat",
                        onClick: () => {
                          setSectionId(section.id);
                          setText("Opravdu chcete sekci smazat");
                          setIsOpen(true);
                        },
                      },
                    ]}
                    archived={true}
                  />
                ))}
              </BoardLayout>
            </section>
          )}
          {posts.length > 0 && (
            <section className="flex flex-col">
              <h2 className="text-title-large font-medium tracking-wide mb-6">
                Příspěvky
              </h2>
              <BoardLayout>
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    id={post.id}
                    src={post.thumbnail_url}
                    name={post.name}
                    menuItems={[
                      {
                        text: "Obnovit",
                        onClick: () => handlePostsRestore(post.id),
                      },
                      {
                        text: "Smazat",
                        onClick: () => {
                          setPostId(post.id);
                          setText("Opravdu chcete příspěvek smazat");
                          setIsOpen(true);
                        },
                      },
                    ]}
                    archived={true}
                  />
                ))}
              </BoardLayout>
            </section>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
