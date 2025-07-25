"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { FabVisibleContext } from "@/components/FabVisible";
import { useMediaQuery } from "react-responsive";
import { FormEvent } from "react";
import { ReactSVG } from "react-svg";
import {
  BulkMessage as BulkMessageInterface,
  BulkMessages,
} from "@/types/bulk-message";
import TopBar from "@/components/TopBar";
import BulkMessage from "@/components/BulkMessage";
import Conversation from "@/components/Conversation";
import IconButton from "@/components/IconButton";
import Message from "@/components/Message";
import { SnackbarContext } from "@/components/Snackbar";
import { Conversation as ConversationInterface } from "@/types/conversation";
import { Message as MessageInterface } from "@/types/message";
import Image from "next/image";
import Tab from "@/components/Tab";
import TabItem from "@/components/TabItem";
import clsx from "clsx";

export default function Questions() {
  const { data: session, status } = useSession();
  const { setSnackbar } = useContext(SnackbarContext);

  const { setFabVisible } = useContext(FabVisibleContext);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const [tab, setTab] = useState("conversation");

  const [bulkMessages, setBulkMessages] = useState<BulkMessages[]>([]);
  const [currentBulkMessage, setCurrentBulkMessage] =
    useState<BulkMessageInterface | null>(null);
  const [bulkMessageBadge, setBulkMessageBadge] = useState(0);
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ConversationInterface | null>(null);
  const [conversationBadge, setConversationBadge] = useState(0);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [attachment, setAttachment] = useState("");

  const attachmentRef = useRef<HTMLInputElement>(null);
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const bulkMessageScrollRef = useRef<HTMLDivElement>(null);

  async function loadMessages(id: number) {
    if (id) {
      const res = await fetch(`/api/conversations/${id}`);

      if (res.ok) {
        const data = await res.json();
        const { messages } = data;
        const reverseMessages = messages.reverse();
        setMessages(reverseMessages);
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function loadConversations() {
    const res = await fetch("/api/conversations");

    if (res.ok) {
      const data = await res.json();
      const { conversations } = data;
      setConversations(conversations);
      if (!currentConversation) {
        if (!isTabletOrMobile) {
          setCurrentConversation(conversations[0]);
          loadMessages(conversations[0]?.id);
        }
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadConversationBadge() {
    const res = await fetch("/api/conversations/badge");

    if (res.ok) {
      const data = await res.json();
      const { badge } = data;
      setConversationBadge(badge.badge_count);
      if (currentConversation) {
        loadConversations();
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendConversationBadge(conversationId: number) {
    const res = await fetch(`/api/conversations/${conversationId}/badge`, {
      method: "PUT",
    });

    if (res.ok) {
      loadConversationBadge();
      if (currentConversation) {
        loadConversations();
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadCurrentBulkMessage(id: number) {
    if (id) {
      const res = await fetch(`/api/conversations/bulk-messages/${id}`);

      if (res.ok) {
        const data = await res.json();
        const { bulkCurrentMessage } = data;
        setCurrentBulkMessage(bulkCurrentMessage);
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  async function loadBulkMessages() {
    const res = await fetch("/api/conversations/bulk-messages");

    if (res.ok) {
      const data = await res.json();
      const { bulkMessages } = data;
      setBulkMessages(bulkMessages);
      if (!currentBulkMessage) {
        if (!isTabletOrMobile) {
          setCurrentBulkMessage(bulkMessages[0]);
          loadCurrentBulkMessage(bulkMessages[0].id);
        }
        handleCloseAttachment();
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function loadBulkMessagesBadge() {
    const res = await fetch("/api/conversations/bulk-messages/badge");

    if (res.ok) {
      const data = await res.json();
      const { badge } = data;
      setBulkMessageBadge(badge.badge_count);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  async function sendBulkMessageBadge(bulkMessageId: number) {
    const res = await fetch(
      `/api/conversations/bulk-messages/${bulkMessageId}/badge`,
      {
        method: "PUT",
      }
    );

    if (res.ok) {
      loadBulkMessagesBadge();
      if (currentBulkMessage) {
        loadBulkMessages();
      }
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    if (currentConversation) {
      sendConversationBadge(currentConversation.id);
    }
    loadConversationBadge();
    loadBulkMessagesBadge();

    const intervalId = setInterval(() => {
      loadConversationBadge();
      loadBulkMessagesBadge();
      if (isTabletOrMobile) {
        if (tab === "conversation") {
          loadConversations();
        } else if (tab === "bulkMessage") {
          loadBulkMessages();
        }
      }
      if (currentConversation) {
        loadMessages(currentConversation.id);
      } else if (currentBulkMessage) {
        loadBulkMessages();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentConversation, tab]);

  useEffect(() => {
    loadConversationBadge();
  }, [messages]);

  useEffect(() => {
    if (currentBulkMessage) {
      sendBulkMessageBadge(currentBulkMessage.id);
    }
  }, [currentBulkMessage]);

  useEffect(() => {
    if (isTabletOrMobile && (currentConversation || currentBulkMessage)) {
      setFabVisible(false);
    }

    if (!currentConversation && !currentBulkMessage) {
      if (tab === "conversation") {
        loadConversations();
      } else if (tab === "bulkMessage") {
        loadBulkMessages();
      }
    }
  }, [isTabletOrMobile]);

  function formatConversationTime(time: string) {
    if (time) {
      const newTime = new Date(time);
      newTime.setHours(newTime.getHours() + 2);

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Intl.DateTimeFormat("cs-CZ", options).format(newTime);
    } else {
      return "";
    }
  }

  function handleCloseAttachment() {
    setAttachment("");
    if (attachmentRef?.current) {
      attachmentRef.current.value = "";
    }
  }

  function handleBulkMessageResetScroll() {
    if (bulkMessageScrollRef?.current) {
      bulkMessageScrollRef.current.scrollTo({
        top: 0,
      });
    }
  }

  function handleConversationResetScroll() {
    if (conversationScrollRef?.current) {
      conversationScrollRef.current.scrollTo({
        top: 0,
      });
    }
  }

  async function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentMessage || attachment) {
      const formData = new FormData(e.currentTarget);

      const res = await fetch(`/api/conversations/${currentConversation?.id}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCurrentMessage("");
        handleCloseAttachment();
        if (currentConversation) {
          loadMessages(currentConversation.id);
          handleConversationResetScroll();
          loadConversations();
        }
      } else {
        setSnackbar("Chyba serveru! Zkuste to později.");
      }
    }
  }

  function header() {
    if (currentConversation && isTabletOrMobile) {
      return (
        <div className="flex items-center ml-3 bg-surface-containter-low rounded-t-xl">
          {currentConversation?.url ? (
            <Image
              src={currentConversation.url}
              width={36}
              height={36}
              style={{
                objectFit: "cover",
              }}
              alt={`${currentConversation?.firstname} ${currentConversation?.surname}`}
              className="h-9 w-9 text-on-surface-variant rounded-full"
            />
          ) : (
            <ReactSVG
              src="/icons/account-circle-36dp.svg"
              className="flex items-center justify-center text-on-surface-variant"
            />
          )}

          <span className="ml-3 truncate text-title-large">
            {currentConversation?.firstname +
              " " +
              currentConversation?.surname}
          </span>
        </div>
      );
    } else if (currentBulkMessage && isTabletOrMobile) {
      return (
        <div className="ml-3 bg-surface-container-low overflow-x-auto">
          <h2 className="flex-shrink-0 text-title-large whitespace-nowrap">
            {currentBulkMessage.name}
          </h2>
        </div>
      );
    } else {
      return "";
    }
  }

  return (
    <div className="flex flex-col h-dvh lg:h-screen">
      <TopBar
        name={header() ? "" : "Dotazy"}
        onClick={
          currentConversation || currentBulkMessage
            ? () => {
                if (currentConversation) {
                  setFabVisible(true);
                  setCurrentConversation(null);
                } else if (currentBulkMessage) {
                  setFabVisible(true);
                  setCurrentBulkMessage(null);
                }
              }
            : undefined
        }
        header={header()}
      />
      <main className="flex-1 flex flex-col w-full max-w-screen-xl mx-auto pt-16 overflow-hidden lg:p-6 lg:pt-0 2xl:px-0">
        <h1 className="hidden text-display-large mb-6 lg:block">Dotazy</h1>
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div
            className={clsx("w-full lg:w-86 lg:flex lg:flex-col", {
              hidden: currentConversation || currentBulkMessage,
            })}
          >
            <Tab>
              <TabItem
                text="Konverzace"
                onClick={() => {
                  setTab("conversation");
                  loadConversations();
                }}
                active={tab === "conversation"}
                badgeCount={conversationBadge}
              />
              <TabItem
                text="Hromadné zprávy"
                onClick={() => {
                  setTab("bulkMessage");
                  loadBulkMessages();
                }}
                active={tab === "bulkMessage"}
                badgeCount={bulkMessageBadge}
              />
            </Tab>
            <div className="w-full h-full pr-2 py-2 pb-51 overflow-x-hidden overflow-y-auto lg:w-86 lg:pb-2">
              {tab === "bulkMessage" &&
                bulkMessages.map((bulkMessage) => (
                  <BulkMessage
                    key={bulkMessage.id}
                    onClick={async () => {
                      await loadCurrentBulkMessage(bulkMessage.id);
                      setFabVisible(false);
                      handleBulkMessageResetScroll();
                    }}
                    name={bulkMessage.name}
                    time={formatConversationTime(bulkMessage.time)}
                    active={bulkMessage.id === currentBulkMessage?.id}
                    badgeType={
                      bulkMessage.badge_time === null ? "small" : undefined
                    }
                  />
                ))}
              {tab === "conversation" &&
                conversations.map((conversation) => (
                  <Conversation
                    key={conversation.id}
                    src={conversation.url}
                    firstname={conversation.firstname}
                    surname={conversation.surname}
                    message={conversation.message}
                    time={formatConversationTime(conversation.time)}
                    onClick={async () => {
                      setCurrentConversation(conversation);
                      await loadMessages(conversation.id);
                      setCurrentMessage("");
                      handleCloseAttachment();
                      setFabVisible(false);
                      handleConversationResetScroll();
                    }}
                    active={conversation.id === currentConversation?.id}
                    badgeCount={conversation.badge_count}
                  />
                ))}
            </div>
          </div>
          {tab === "conversation" && currentConversation && (
            <form
              onSubmit={handleSendMessage}
              className="flex-1 flex flex-col bg-surface-container overflow-hidden lg:rounded-xl"
            >
              <div className="hidden px-4 py-3 bg-surface rounded-t-xl lg:flex lg:items-center lg:gap-3">
                {currentConversation?.url ? (
                  <Image
                    src={currentConversation.url}
                    width={36}
                    height={36}
                    style={{
                      objectFit: "cover",
                    }}
                    alt={`${currentConversation?.firstname} ${currentConversation?.surname}`}
                    className="h-9 w-9 text-on-surface-variant rounded-full"
                  />
                ) : (
                  <ReactSVG
                    src="/icons/account-circle-36dp.svg"
                    className="flex items-center justify-center text-on-surface-variant"
                  />
                )}

                <span className="text-title-large">
                  {currentConversation?.firstname +
                    " " +
                    currentConversation?.surname}
                </span>
              </div>
              <div
                ref={conversationScrollRef}
                className="px-6 pt-4 flex-1 flex flex-col-reverse gap-4 overflow-y-auto transition-all duration-300 easy-in"
              >
                {messages.length > 0 &&
                  messages.map((message) => (
                    <Message
                      src={currentConversation?.url}
                      key={message.id}
                      message={message.message}
                      attachment_name={message.attachment_name}
                      url={message.url}
                      type={
                        status === "authenticated" &&
                        message.id_sender === session?.user?.id
                          ? "sender"
                          : "receiver"
                      }
                    />
                  ))}
              </div>
              <div className="relative px-6 py-4">
                <div className="flex items-end gap-2">
                  <label className="mb-1">
                    <IconButton
                      type="button"
                      src="/icons/attach-file.svg"
                      onClick={() => attachmentRef.current?.click()}
                    />
                    <input
                      type="file"
                      name="attachment"
                      ref={attachmentRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setAttachment(e.target.files[0].name);
                        } else {
                          handleCloseAttachment();
                        }
                      }}
                    />
                  </label>
                  <div className="flex-1 p-3 bg-surface-container-highest rounded-3xl">
                    {attachment && (
                      <div className="flex items-center gap-2 w-fit pl-4 p-2 mb-2 border border-outline-variant rounded-xl">
                        {attachment}
                        <IconButton
                          src="/icons/close.svg"
                          onClick={handleCloseAttachment}
                          size="small"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      name="message"
                      value={currentMessage}
                      placeholder="Zde napište zprávu"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCurrentMessage(e.target.value)
                      }
                      className="w-full pl-2 text-body-large border-none outline-none"
                    ></input>
                  </div>
                  <div className="mb-1">
                    <IconButton src="/icons/send.svg" />
                  </div>
                </div>
              </div>
            </form>
          )}
          {tab === "bulkMessage" && currentBulkMessage && (
            <section className="flex-1 flex flex-col bg-surface-container overflow-hidden lg:rounded-xl">
              <div className="hidden px-4 py-4 bg-surface rounded-t-xl lg:flex lg:items-center">
                <h2 className="text-title-large">{currentBulkMessage.name}</h2>
              </div>
              <div
                ref={bulkMessageScrollRef}
                className="flex-1 gap-4 p-6 overflow-y-auto"
              >
                <div className="p-4 bg-surface-container-highest rounded-20">
                  <p>{currentBulkMessage.message}</p>
                </div>
              </div>
              {currentBulkMessage.url && (
                <div className="w-full px-6 py-4">
                  <a
                    href={currentBulkMessage.url}
                    className="relative group flex w-fit gap-2 px-4 py-3 bg-surface-container-highest rounded-3xl"
                  >
                    <div className="z-10 absolute inset-0 bg-on-surface opacity-0 group-hover:opacity-10 rounded-3xl"></div>
                    <ReactSVG
                      src="/icons/attach-file-20dp.svg"
                      className="flex items-center justify-center"
                    />
                    <span>{currentBulkMessage.attachment_name}</span>
                  </a>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
