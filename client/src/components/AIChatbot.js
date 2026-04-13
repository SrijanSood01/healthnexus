import React, { useState } from "react";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello. I am your healthnexus assistant. Ask me about appointments, reports, or dashboard guidance.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: "user", text: input.trim() },
      { sender: "bot", text: "Thanks. This assistant is in demo mode and your request has been noted." },
    ]);
    setInput("");
  };

  return (
    <div className="chatbot">
      {!isOpen && (
        <button type="button" className="chatbot-btn" onClick={() => setIsOpen(true)}>
          Chat
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h4>healthnexus Assistant</h4>
              <p>Quick support for the hospital portal</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`chat-msg ${message.sender === "user" ? "user-msg" : "bot-msg"}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button type="button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
