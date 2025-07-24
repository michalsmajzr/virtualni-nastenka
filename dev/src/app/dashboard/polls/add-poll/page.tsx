"use client";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import IconButton from "@/components/IconButton";
import SectionLayout from "@/components/SectionLayout";

export default function AddPoll() {
  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);

  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [answers, setAnswers] = useState([
    { text: "Odpověď", answer: "" },
    { text: "Odpověď", answer: "" },
  ]);

  function handleAddAnswer() {
    setAnswers([...answers, { text: "Odpověď", answer: "" }]);
  }

  function handleOnChangeAnswer(
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) {
    const newAnswers = [...answers];
    newAnswers[i]["answer"] = e.target.value;
    setAnswers(newAnswers);
  }

  function handleDeleteAnswer(i: number) {
    if (answers.length > 2) {
      const newAnswers = [...answers];
      newAnswers.splice(i, 1);
      setAnswers(newAnswers);
    } else {
      setSnackbar("Musíte zadat alespoň dvě odpovědi.");
    }
  }

  function handleNameQuestion() {
    if (question.length > 255) {
      return setQuestionError("Název je příliš dlouhý.");
    } else {
      if (questionError) {
        setQuestionError("");
      }
    }
  }

  useEffect(() => {
    handleNameQuestion();
  }, [question]);

  async function handleSubmitAddPoll(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!question) {
      return setQuestionError("Chybí otázka.");
    }

    if (question.length > 255) {
      return setQuestionError("Moc dlouhá otázka.");
    }

    if (questionError) {
      return;
    }

    const data = {
      question: question,
      answers: answers,
    };

    const res = await fetch("/api/polls", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setQuestion("");
      setAnswers([
        { text: "Odpověď", answer: "" },
        { text: "Odpověď", answer: "" },
      ]);
      setSnackbar("Anketa byla vytvořena.");
    } else {
      const data = await res.json();
      const { error } = data;
      if (error === "missingQuestion") {
        setSnackbar("Chybí otázka.");
      } else if (error === "questionTooLong") {
        setSnackbar("Otázka je příliš dlouhá.");
      } else if (error === "missingAnswers") {
        setSnackbar("Chybí odpovědi.");
      } else if (error === "answerTooLong") {
        setSnackbar("Odpověď je příliš dlouhá.");
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  return (
    <>
      <TopBar
        name="Přidat anketu"
        onClick={() => router.push(`/dashboard/polls`)}
      />
      <SectionLayout>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Přidat anketu
        </h1>
        <div className="bg-surface-container rounded-3xl lg:p-14">
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmitAddPoll}
          >
            <section className="flex flex-col gap-6 w-full  max-w-sm">
              <h2 className="text-headline-medium">Zadejte otázku</h2>
              <TextField
                text="Otázka"
                color="surface-container"
                type="text"
                value={question}
                error={questionError}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <h2 className="text-headline-medium">Přidejte odpovědi</h2>
              {answers.map((answer, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextField
                    text={answer.text}
                    color="surface-container"
                    type="text"
                    value={answer.answer}
                    onChange={(e) => handleOnChangeAnswer(e, i)}
                  />
                  <IconButton
                    type="button"
                    src="/icons/close.svg"
                    onClick={() => handleDeleteAnswer(i)}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  type="button"
                  text="Přidat odpověď"
                  buttonType="tonal"
                  onClick={handleAddAnswer}
                />
              </div>
              <div className="flex justify-end">
                <Button text="Vytvořit" buttonType="filled" />
              </div>
            </section>
          </form>
        </div>
      </SectionLayout>
    </>
  );
}
