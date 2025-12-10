import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../../api/aiApi';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI Study Assistant. Ask me anything about your studies!',
      sender: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const chatMutation = useMutation({
    mutationFn: (message) => aiApi.chat(message),
    onSuccess: (response) => {
      const aiMessage = response.data?.data?.response;
      if (aiMessage) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: aiMessage, sender: 'ai' },
        ]);
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(inputValue);
    setInputValue('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">💬 AI Chat Assistant</h1>
        <p className="text-base-content/70">
          Ask questions and get instant help with your studies
        </p>
      </div>

      <div className="flex-1 bg-base-200 rounded-lg p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-300'
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex gap-2 px-4 py-2 bg-base-300 rounded-lg">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything..."
          className="input input-bordered flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={chatMutation.isPending}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={chatMutation.isPending || !inputValue.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
