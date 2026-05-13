import React, { useState, useRef, useEffect } from "react";

const DocAi = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    // إضافة رسالة المستخدم
    setMessages((prev) => [...prev, userMsg]);

    const messageToSend = input;
    setInput("");

    // typing indicator
    setMessages((prev) => [...prev, { role: "bot", text: "typing..." }]);

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const newMsgs = [...prev];

        newMsgs[newMsgs.length - 1] = {
          role: "bot",
          text: data.category
            ? `${data.reply}\n\n🩺 التخصص: ${data.category}`
            : data.reply,
        };

        return newMsgs;
      });
    } catch (err) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: "bot",
          text: "حصل خطأ أثناء الاتصال بالسيرفر 😥",
        };
        return newMsgs;
      });
    }
  };

  // ✅ SCROLL داخل الشات فقط
  useEffect(() => {
    const container = chatRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-5 flex flex-col h-screen bg-white rounded-2xl shadow-lg border">
      
      {/* HEADER */}
      <div className="p-4 border-b flex items-center gap-3 bg-blue-50 rounded-t-2xl">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          AI
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Doc AI Assistant</h2>
          <p className="text-xs text-gray-500">Ask anything about health</p>
        </div>
      </div>

      {/* CHAT BODY (ref هنا) */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* BOT AVATAR */}
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm shadow">
                🤖
              </div>
            )}

            {/* MESSAGE */}
            <div
              className={`px-4 py-3 rounded-2xl text-sm shadow-sm max-w-[75%] break-words
              ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm border"
              }`}
            >
              <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t bg-white flex gap-2 items-center rounded-b-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DocAi;