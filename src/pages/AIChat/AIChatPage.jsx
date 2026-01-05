import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { chatApi } from "../../api/chatApi";
import { MdSmartToy } from "react-icons/md";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { FiSend } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";
import { HiDotsVertical } from "react-icons/hi";
import { useToast } from "../../components/ToastContext";

export default function AIChatPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  /* ---------------- LOAD CHAT HISTORY ---------------- */
  useEffect(() => {
    chatApi
      .getHistory()
      .then((res) => {
        const data = res.data.data.messages;

        setMessages(
          data.length
            ? data
            : [
                {
                  _id: "welcome",
                  text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies!",
                  sender: "ai",
                },
              ]
        );
      })
      .catch(() => {
        showToast("Failed to load chat history", "error");
      });
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  const chatMutation = useMutation({
    mutationFn: (payload) => aiApi.chat(payload),
    onSuccess: (res) => {
      const { userMessage, aiMessage } = res.data.data;

      setMessages((prev) => [...prev, userMessage, aiMessage]);
    },
    onError: () => {
      showToast("Failed to get AI response", "error");
    },
  });

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- DELETE SINGLE MESSAGE ---------------- */
  const clearMessage = async (id) => {
    try {
      await chatApi.deleteChat(id);

      setMessages((prev) =>
        prev
          .map((msg) =>
            msg._id === id
              ? msg.deleted
                ? null
                : { ...msg, text: "Message is deleted", deleted: true }
              : msg
          )
          .filter(Boolean)
      );
    } catch {
      showToast("Failed to delete message", "error");
    }
  };

  /* ---------------- CLEAR ALL CHAT ---------------- */
  const clearAllMessages = async () => {
    try {
      await chatApi.clearHistory();

      setMessages([
        {
          _id: "welcome",
          text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies!",
          sender: "ai",
        },
      ]);
    } catch {
      showToast("Failed to clear chat", "error");
    }
  };

  /* ---------------- SEND HANDLER ---------------- */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    chatMutation.mutate({ message: inputValue });
    setInputValue("");
  };

  return (
    <div>
      <PageHeader
        icon={MdSmartToy}
        title="AI Chat Assistant"
        content="Ask questions and get instant help with your studies"
      />

      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-3 h-[calc(80vh-100px)]">
        {/* HEADER MENU */}
        <div className="flex justify-end mb-2 ">
          <div className="dropdown dropdown-end z-10">
            <label tabIndex={0} className="btn btn-sm btn-ghost">
              <HiDotsVertical />
            </label>
            <ul className="dropdown-content menu p-0 shadow bg-base-100 rounded-box w-40">
              <li>
                <button onClick={clearAllMessages} className="text-error">
                  Clear all chat
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 rounded-xl space-y-3 h-[calc(60vh-75px)] p-0 sm:p-8 overflow-y-auto overflow-x-hidden">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } relative group`}
            >
              <div
                className={`px-6 py-2 rounded-xl max-w-xs lg:max-w-md break-words ${
                  message.deleted
                    ? "bg-base-200 italic"
                    : message.sender === "user"
                    ? "bg-primary text-primary-content rounded-br-none"
                    : "bg-base-300 text-base-content rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>

              {message._id !== "welcome" && (
                <div
                  className={`absolute z-10 bottom-0 ${
                    message.sender === "user" ? "right-1" : "left-1"
                  } hidden group-hover:block`}
                >
                  <div
                    className={`dropdown ${
                      message.sender === "ai"
                        ? "dropdown-start"
                        : "dropdown-end"
                    }`}
                  >
                    <label tabIndex={0} className="cursor-pointer">
                      <HiDotsVertical />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-0 shadow bg-base-100 text-error rounded-box w-32"
                    >
                      <li>
                        <button onClick={() => clearMessage(message._id)}>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* AI LOADER */}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-base-300 rounded-xl">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form onSubmit={handleSendMessage} className="flex gap-2 mt-6 p-3">
          <FormInput
            containerClassName="flex-1"
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={chatMutation.isPending}
          />
          <PrimaryButton type="submit" loading={chatMutation.isPending}>
            <FiSend className="text-xl" />
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
