import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiApi } from "../../api/aiApi";
import { MdSmartToy } from "react-icons/md";
import { PrimaryButton } from "../../components/PrimaryButton";
import FormInput from "../../components/FormInput";
import { FiSend } from "react-icons/fi";
import PageHeader from "../../components/PageHeader";

export default function AIChatPage() {
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
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const chatMutation = useMutation({
    mutationFn: (message) => aiApi.chat(message),
    onSuccess: (response) => {
      const aiMessage = response.data?.data?.response;
      if (aiMessage) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: aiMessage, sender: "ai" },
        ]);
      }
    },
  });

  useEffect(() => {
    localStorage.setItem("ai-chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => {
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

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(inputValue);
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
      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-3 sm:p-8 h-[calc(80vh-100px)]">
        {/* Chat Area */}
        <div className="flex-1 rounded-xl overflow-y-auto space-y-3 h-[calc(60vh-50px)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs lg:max-w-md break-words ${
                  message.sender === "user"
                    ? "bg-primary text-primary-content rounded-br-none"
                    : "bg-base-300 text-base-content rounded-bl-none"
                }`}
              >
                <p>{message.text}</p>
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
          className="flex gap-2 mt-6"
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
          <PrimaryButton onClick={clearChat}>Clear</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
