import React, { useState, useEffect } from "react";

const LiveChat = ({ socket, senderId, receiverId, receiverType, setChatPanelOpen }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 👇 YEH HAI SABSE BADA FIX: IDs ko har format se nikalna
  const safeSenderId = typeof senderId === "object" && senderId !== null ? senderId._id : senderId;
  const safeReceiverId = typeof receiverId === "object" && receiverId !== null ? receiverId._id : receiverId;

  useEffect(() => {
    if (!socket) return;
    
    const receiveMessageHandler = (data) => {
      console.log("📥 New Message Received:", data);
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

    if (!safeSenderId || !safeReceiverId) {
      console.error("❌ CRITICAL ERROR: IDs missing!", { safeSenderId, safeReceiverId });
      alert("Chat connection error! Check browser console.");
      return;
    }

    const messageData = {
      senderId: safeSenderId,
      receiverId: safeReceiverId, // 👈 Ab backend ko exact string ID milegi
      receiverType: receiverType,
      message: message,
    };

    console.log("📤 Sending Message to Backend:", messageData);
    
    // Emit to backend
    socket.emit("send-message", messageData);

    // Update own UI
    setMessages((prev) => [...prev, { sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white pt-2 rounded-t-3xl shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b-2">
        <h3 className="text-2xl font-semibold">Live Chat</h3>
        <button onClick={() => setChatPanelOpen(false)} className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center active:scale-95">
          <i className="ri-arrow-down-wide-line text-2xl text-gray-700"></i>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] p-4 rounded-xl text-base ${
              msg.sender === "me"
                ? "bg-black text-white self-end rounded-br-sm shadow-md"
                : "bg-gray-200 text-black self-start rounded-bl-sm shadow-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <i className="ri-chat-smile-2-line text-6xl mb-2 text-gray-300"></i>
            <p>Start a conversation</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-3 pb-8">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 px-5 py-4 rounded-full text-base outline-none shadow-inner"
        />
        <button
          type="submit"
          className="bg-green-600 text-white h-14 w-14 rounded-full flex items-center justify-center hover:bg-green-700 shadow-md active:scale-95 transition-all"
        >
          <i className="ri-send-plane-fill text-2xl"></i>
        </button>
      </form>
    </div>
  );
};

export default LiveChat;