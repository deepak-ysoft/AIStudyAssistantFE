import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { MdSmartToy } from "react-icons/md";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { FiSend } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";
import { HiDotsVertical } from "react-icons/hi";
import { useToast } from "../../components/ToastContext";

export default function AIChatPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("ai-chat-messages");
    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies!",
        sender: "ai",
        deleted: false,
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const chatMutation = useMutation({
    mutationFn: (payload) => aiApi.chat(payload),
    onSuccess: (response) => {
      showToast(
        response.data.message,
        response.data.success ? "success" : "error"
      );
      const aiMessage = response.data?.data?.response;
      if (aiMessage) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: aiMessage, sender: "ai" },
        ]);
      }
    },
    onError: (response) => {
      showToast(response.data.message, "error");
    },
  });

  useEffect(() => {
    localStorage.setItem("ai-chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearMessage = (id) => {
    setMessages((prev) =>
      prev
        .map((msg) => {
          if (msg.id === id) {
            if (msg.deleted) {
              // Already soft deleted -> remove it
              return null;
            } else {
              // First delete -> mark as deleted
              return { ...msg, text: "Message is deleted", deleted: true };
            }
          }
          return msg;
        })
        .filter(Boolean)
    );
  };

  const clearAllMessages = () => {
    localStorage.removeItem("ai-chat-messages");
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies!",
        sender: "ai",
      },
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    chatMutation.mutate({
      message: inputValue,
      history: updatedMessages.slice(-6), // last 6 messages only
    });

    setInputValue("");
  };

  return (
    <div>
      {/* HEADER */}
      <PageHeader
        icon={MdSmartToy}
        title="AI Chat Assistant"
        content="Ask questions and get instant help with your studies"
      />

      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-3 h-[calc(80vh-100px)]">
        <div className="flex justify-end mb-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm btn-ghost">
              <HiDotsVertical />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-0 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <button
                  onClick={() => {
                    clearAllMessages();
                    // Remove focus to close dropdown immediately
                    document.activeElement.blur();
                  }}
                  className="text-error"
                >
                  Clear all chat
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 rounded-xl overflow-y-auto space-y-3 h-[calc(60vh-75px)] p-0 sm:p-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } relative group`}
            >
              {/* Bubble */}
              <div
                className={`px-6 py-2 rounded-xl max-w-xs lg:max-w-md break-words ${
                  message.deleted
                    ? "bg-base-200 text-base-400 italic" // gray background + italic text
                    : message.sender === "user"
                    ? "bg-primary text-primary-content rounded-br-none"
                    : "bg-base-300 text-base-content rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
              </div>

              {/* Menu outside bubble */}
              <div
                className={`absolute ${
                  message.deleted ? "bottom-2" : "bottom-0"
                } ${
                  message.sender === "user" ? "right-1" : "left-1"
                } hidden group-hover:block`}
                style={{ zIndex: 50 }}
              >
                <div
                  className={`dropdown ${
                    message.sender === "ai" ? "dropdown-start" : "dropdown-end"
                  }`}
                >
                  <label tabIndex={0} className="cursor-pointer">
                    <HiDotsVertical className="text-sm opacity-70 hover:opacity-100" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-0 shadow bg-base-100 text-error rounded-box w-32"
                  >
                    <li>
                      <button onClick={() => clearMessage(message.id)}>
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="flex gap-2 px-4 py-2 bg-base-300 rounded-xl rounded-bl-none">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          noValidate
          onSubmit={handleSendMessage}
          className="flex gap-2 mt-6 p-3"
        >
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
          {/* <PrimaryButton onClick={clearChat}>Clear</PrimaryButton> */}
        </form>
      </div>
    </div>
  );
}
