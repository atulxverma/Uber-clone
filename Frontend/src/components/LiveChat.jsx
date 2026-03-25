// src/components/LiveChat.jsx
import React, { useState, useEffect } from "react";

const LiveChat = ({ socket, senderId, receiverId, receiverType, setChatPanelOpen }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Doosre bande se message receive karna
    const receiveMessageHandler = (data) => {
      setMessages((prev) => [...prev, { sender: "other", text: data.message }]);
    };

    socket.on("receive-message", receiveMessageHandler);

    return () => {
      socket.off("receive-message", receiveMessageHandler);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Socket ke through message bhejna
    socket.emit("send-message", {
      senderId,
      receiverId,
      receiverType,
      message,
    });

    // Apni screen pe bhi message dikhana
    setMessages((prev) => [...prev, { sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[50vh] bg-white pt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b">
        <h3 className="text-xl font-semibold">Chat</h3>
        <button onClick={() => setChatPanelOpen(false)}>
          <i className="ri-arrow-down-wide-line text-2xl text-gray-500"></i>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-lg text-sm ${
              msg.sender === "me"
                ? "bg-black text-white self-end rounded-br-none"
                : "bg-gray-200 text-black self-start rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say Hi!</p>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 px-4 py-3 rounded-full text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-green-600 text-white h-11 w-11 rounded-full flex items-center justify-center hover:bg-green-700"
        >
          <i className="ri-send-plane-fill text-xl"></i>
        </button>
      </form>
    </div>
  );
};

export default LiveChat;