import React, { useState, useEffect, useRef } from "react";
import "./AIChatbot.css";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm your H.E.A.L Assistant. How can I help you today?", options: [
      "📋 View My Prescriptions",
      "📅 Book an Appointment",
      "🧾 View Reports",
      "💬 Talk to My Doctor",
    ] },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handles when a patient clicks an option
  const handleOptionClick = (option) => {
    const userMsg = { sender: "user", text: option };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(option);
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  // 🧠 Smart flow-based bot replies
  const getBotResponse = (option) => {
    switch (option) {
      case "📋 View My Prescriptions":
        return {
          sender: "bot",
          text: "You currently have 3 active prescriptions. Would you like to see details or download them?",
          options: ["📄 View Details", "⬇️ Download PDF", "🔙 Go Back"],
        };

      case "📅 Book an Appointment":
        return {
          sender: "bot",
          text: "Sure! Which department would you like to book an appointment with?",
          options: ["❤️ Cardiology", "🦴 Orthopedics", "🩺 General Medicine", "🔙 Go Back"],
        };

      case "🧾 View Reports":
        return {
          sender: "bot",
          text: "You have 1 pending and 2 completed lab reports. What would you like to do?",
          options: ["📤 Download Completed", "🕒 View Pending", "🔙 Go Back"],
        };

      case "💬 Talk to My Doctor":
        return {
          sender: "bot",
          text: "Would you like to chat with your assigned doctor or schedule a call?",
          options: ["💬 Chat with Doctor", "📞 Schedule Call", "🔙 Go Back"],
        };

      // Sub-choices
      case "📄 View Details":
        return { sender: "bot", text: "Opening your prescriptions page...", options: [] };

      case "⬇️ Download PDF":
        return { sender: "bot", text: "Preparing download link for your prescriptions...", options: [] };

      case "❤️ Cardiology":
      case "🦴 Orthopedics":
      case "🩺 General Medicine":
        return {
          sender: "bot",
          text: `Got it! Booking an appointment in ${option.replace("🩺", "").trim()}...`,
          options: [],
        };

      case "📤 Download Completed":
        return { sender: "bot", text: "Downloading completed reports...", options: [] };

      case "🕒 View Pending":
        return { sender: "bot", text: "You have one pending test: X-Ray (Left Leg).", options: [] };

      case "💬 Chat with Doctor":
        return { sender: "bot", text: "Starting secure chat with your doctor...", options: [] };

      case "📞 Schedule Call":
        return { sender: "bot", text: "Scheduling a call with your doctor...", options: [] };

      case "🔙 Go Back":
        return {
          sender: "bot",
          text: "How can I help you today?",
          options: [
            "📋 View My Prescriptions",
            "📅 Book an Appointment",
            "🧾 View Reports",
            "💬 Talk to My Doctor",
          ],
        };

      default:
        return { sender: "bot", text: "I'm still learning! Please choose another option.", options: [] };
    }
  };

  return (
    <div className="chatbot">
      {/* Floating button */}
      {!isOpen && (
        <button className="chatbot-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>H.E.A.L Assistant</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
                <p>{msg.text}</p>
                {msg.options && msg.options.length > 0 && (
                  <div className="options">
                    {msg.options.map((opt, j) => (
                      <button key={j} onClick={() => handleOptionClick(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && <p className="typing">H.E.A.L is typing...</p>}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
