"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FabVisibleContext } from "@/components/FabVisible";
import { useMediaQuery } from "react-responsive";
import { FormEvent } from "react";
import clsx from "clsx";
import { ReactSVG } from "react-svg";
import Image from "next/image";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import TopBar from "@/components/TopBar";
import { UserPoll } from "@/types/user";
import { Poll } from "@/types/poll";
import { Answer } from "@/types/answer";
import Question from "@/components/Question";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import TextDialog from "@/components/TextDialog";
import IconButton from "@/components/IconButton";

/* UX design zobrazení výsledků dle článku: https://contra.com/p/mWklLEEk-designing-a-poll-feature-to-increase-user-engagement */

export default function Polls() {
  const { data: session, status } = useSession();
  const { setSnackbar } = useContext(SnackbarContext);

  const { setFabVisible } = useContext(FabVisibleContext);

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollId, setPollId] = useState<number | null>(null);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [isAnswer, setIsAnswer] = useState(false);
  const [users, setUsers] = useState<UserPoll[]>([]);
  const [currentUserAnswer, setCurrentUserAnswer] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenResult, setIsOpenResult] = useState(false);

  async function loadPolls() {
    const res = await fetch("/api/polls");

    if (res.ok) {
      const data = await res.json();
      const { polls } = data;
      setPolls(polls);
      if (!isTabletOrMobile) {
        if (!currentPoll) {
          setCurrentPoll(polls[0]);
          handleLoadAnswers(polls[0]?.id);
          handleLoadResult(polls[0]?.id);
        }
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendPollBadge(questionId: number) {
    const res = await fetch(`/api/polls/${questionId}/badge`, {
      method: "PUT",
    });

    if (res.ok) {
      loadPolls();
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    if (isTabletOrMobile && currentPoll) {
      setFabVisible(false);
    }
    if (!currentPoll) {
      loadPolls();
    }
  }, [isTabletOrMobile]);

  useEffect(() => {
    loadPolls();
    if (currentPoll) {
      sendPollBadge(currentPoll.id);
    }
  }, [currentPoll]);

  useEffect(() => {
    if (users.length === 0 && !currentUserAnswer) {
      handleLoadUsers(answers[0]?.id);
    }
  }, [isMobile]);

  async function handleLoadAnswers(questionId: number) {
    if (questionId) {
      const res = await fetch(`/api/polls/${questionId}`);

      if (res.ok) {
        const data = await res.json();
        const { answers } = data;
        if (answers) {
          setAnswers(answers);
        }
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleDeletePoll(questionId: number) {
    if (questionId) {
      const res = await fetch(`/api/polls/${questionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        const { question } = data;
        if (currentPoll?.id == question) {
          setCurrentPoll(null);
        } else {
          loadPolls();
        }
        setSnackbar("Anketa byla úspěšně smazána.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleLoadResult(questionId: number) {
    if (questionId) {
      const res = await fetch(`/api/polls/${questionId}/result`);

      if (res.ok) {
        const data = await res.json();
        const { answer } = data;
        if (answer) {
          setCurrentAnswer(answer.id_answer);
          setIsAnswer(true);
        } else {
          if (isAnswer) {
            setIsAnswer(false);
          }
        }
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleLoadUsers(answerId: number) {
    if (answerId) {
      const res = await fetch(`/api/polls/answers/${answerId}`);

      if (res.ok) {
        const data = await res.json();
        const { answer, users } = data;
        setUsers(users);
        setCurrentUserAnswer(answer?.answer);
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleSubmitSendAnswers(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("question", String(currentPoll?.id));

    const res = await fetch("/api/polls/answers", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      handleLoadAnswers(Number(currentPoll?.id));
      setIsAnswer(true);
      setSnackbar("Odpověď byla odeslána.");
    } else {
      if (res.status == 400) {
        setSnackbar("Prosím vyberte jednu z možností.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function handleSubmitUpdateAnswers(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "authenticated") {
      const formData = new FormData(e.currentTarget);
      formData.append("question", String(currentPoll?.id));

      const res = await fetch("/api/polls/answers", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        handleLoadAnswers(Number(currentPoll?.id));
        setSnackbar("Odpověď byla odeslána.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  function header() {
    if (currentPoll && isTabletOrMobile) {
      return (
        <div className={clsx("ml-3 bg-surface-container-low overflow-x-auto")}>
          <h2 className="text-title-large whitespace-nowrap">
            {currentPoll.question}
          </h2>
        </div>
      );
    } else {
      return "";
    }
  }

  return (
    <>
      <div className="flex flex-col h-dvh lg:h-screen">
        <TopBar
          name={header() ? "" : "Ankety"}
          onClick={
            currentPoll
              ? () => {
                  setFabVisible(true);
                  setCurrentPoll(null);
                }
              : undefined
          }
          header={header()}
        />

        {session?.user?.role === "teacher" && (
          <>
            <Dialog
              isOpen={isOpen}
              close={() => {
                setIsOpen(false);
              }}
            >
              <TextDialog
                text="Opravdu chcete smazat anketu?"
                close={() => setIsOpen(false)}
                submit={() => {
                  if (pollId) {
                    handleDeletePoll(pollId);
                  }
                }}
              />
            </Dialog>
            <Dialog
              isOpen={isOpenResult}
              close={() => {
                setIsOpenResult(false);
              }}
            >
              <section
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-6 p-6 w-full max-w-2xl h-[75vh] bg-surface-container rounded-xl"
              >
                <h2
                  className={clsx(
                    "flex-shrink-0 truncate text-title-large sm:block",
                    { hidden: currentUserAnswer }
                  )}
                >
                  {currentPoll?.question}
                </h2>
                <div
                  className={clsx("flex items-center sm:hidden", {
                    hidden: !currentUserAnswer,
                  })}
                >
                  <IconButton
                    src="/icons/arrow-back.svg"
                    size="medium"
                    onClick={() => {
                      setUsers([]);
                      setCurrentUserAnswer("");
                    }}
                  />
                  <h2 className="flex-shrink-0 ml-3 truncate text-title-large">
                    {currentUserAnswer}
                  </h2>
                </div>
                <div className="w-full h-full gap-6 overflow-hidden sm:grid sm:grid-cols-2">
                  <div
                    className={clsx(
                      "pr-2 flex-col gap-2 overflow-auto sm:flex",
                      currentUserAnswer ? "hidden" : "flex"
                    )}
                  >
                    {answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="group relative cursor-pointer"
                        onClick={() => {
                          handleLoadUsers(answer.id);
                        }}
                      >
                        <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded"></div>
                        <div
                          className={clsx(
                            "p-2 flex gap-2 bg-surface-container-high rounded",
                            {
                              "bg-surface-container-highest":
                                currentUserAnswer === answer.answer,
                            }
                          )}
                        >
                          <span>{answer.votes}</span>
                          <span className="truncate">{answer.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {users.length > 0 && (
                    <div className="pr-2 flex flex-col gap-2 overflow-auto">
                      {users?.map((user) => (
                        <div key={user.id} className="flex gap-3">
                          {user.url ? (
                            <Image
                              src={user.url}
                              width={36}
                              height={36}
                              alt="Profile picture"
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <ReactSVG
                              src="/icons/account-circle-36dp.svg"
                              className="text-on-surface-variant"
                            />
                          )}
                          <div className="flex items-center overflow-hidden">
                            <span className="truncate">
                              {user.firstname} {user.surname}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full pt-4 flex justify-end">
                  <Button
                    text="Zavřít"
                    type="button"
                    buttonType="filled"
                    onClick={() => {
                      setIsOpenResult(false);
                    }}
                  />
                </div>
              </section>
            </Dialog>
          </>
        )}

        <main className="flex-1 flex flex-col w-full max-w-screen-xl mx-auto pt-16 overflow-hidden lg:p-6 lg:pt-0 2xl:px-0">
          <h1 className="hidden text-display-large mb-6 lg:block">Ankety</h1>
          <div className="flex-1 flex gap-6 overflow-hidden">
            <div
              className={clsx(
                "flex-col gap-2 p-6 w-full h-full pb-40 overflow-x-hidden overflow-y-auto lg:w-86 lg:p-0 lg:pr-2 lg:flex",
                currentPoll ? "hidden" : "flex"
              )}
            >
              {polls.map((poll) => (
                <Question
                  key={poll.id}
                  onClick={() => {
                    setCurrentPoll(poll);
                    handleLoadAnswers(poll.id);
                    handleLoadResult(poll.id);
                    setFabVisible(false);
                  }}
                  text={poll.question}
                  active={poll.id === currentPoll?.id}
                  menuItems={[
                    {
                      text: "Smazat",
                      onClick: () => {
                        setPollId(poll.id);
                        setIsOpen(true);
                      },
                    },
                  ]}
                  badgeType={poll.badge_time === null ? "small" : undefined}
                />
              ))}
            </div>
            {currentPoll && (
              <form
                onSubmit={
                  isAnswer
                    ? (e) => handleSubmitUpdateAnswers(e)
                    : handleSubmitSendAnswers
                }
                className="flex-1 flex flex-col bg-surface-container overflow-hidden lg:rounded-xl"
              >
                <div className="hidden flex items-center gap-3 p-4 bg-surface lg:flex">
                  <span className="text-title-large leading-7">
                    {currentPoll?.question}
                  </span>
                </div>
                <div className="p-6 gap-4 flex flex-col overflow-y-auto lg:p-10">
                  {answers.map((answer) => (
                    <label
                      key={answer.id}
                      className={clsx(
                        "p-4 flex justify-between gap-4 rounded-xl",
                        currentAnswer === answer.id
                          ? "text-on-secondary-container bg-secondary-container"
                          : "bg-surface-container-high",
                        { "cursor-pointer": session?.user?.role !== "teacher" }
                      )}
                    >
                      <div className="flex gap-4">
                        {session?.user?.role !== "teacher" && (
                          <input
                            type="radio"
                            name="answer"
                            value={answer.id}
                            checked={currentAnswer === answer.id}
                            onChange={() => setCurrentAnswer(answer.id)}
                          />
                        )}
                        <span>{answer.answer}</span>
                      </div>
                      {session?.user?.role === "teacher" && (
                        <span className="flex items-center text-center">
                          Počet hlasů: {answer.votes}
                        </span>
                      )}
                    </label>
                  ))}
                  <div className="mt-4 flex justify-end">
                    {session?.user?.role === "teacher" ? (
                      <Button
                        type="button"
                        text="Zobrazit výsledky"
                        buttonType="filled"
                        onClick={() => {
                          setIsOpenResult(true);
                          if (!isMobile) {
                            handleLoadUsers(answers[0]?.id);
                          }
                        }}
                      />
                    ) : (
                      <Button text="Odeslat" buttonType="filled" />
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
