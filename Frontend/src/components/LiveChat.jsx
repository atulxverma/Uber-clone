import React, { useState, useEffect } from "react";

const LiveChat = ({ socket, senderId, receiverId, receiverType, setChatPanelOpen }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) {
        console.error("❌ Socket is missing in LiveChat!");
        return;
    }

    const receiveMessageHandler = (data) => {
      console.log("📥 Message received:", data);
      setMessages((prev) => [...prev, { sender: "other", text: data.message }]);
    };
    
    // Listen for incoming messages
    socket.on("receive-message", receiveMessageHandler);
    
    return () => {
      socket.off("receive-message", receiveMessageHandler);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!socket) {
        alert("Socket not connected!");
        return;
    }

    // DIRECTLY extract IDs without any complicated checks
    const finalSenderId = typeof senderId === "object" && senderId ? senderId._id : senderId;
    const finalReceiverId = typeof receiverId === "object" && receiverId ? receiverId._id : receiverId;

    if (!finalSenderId || !finalReceiverId) {
        alert(`ID Error -> Sender: ${finalSenderId}, Receiver: ${finalReceiverId}`);
        return;
    }

    const payload = {
      senderId: finalSenderId,
      receiverId: finalReceiverId,
      receiverType: receiverType,
      message: message,
    };

    console.log("🚀 Emitting send-message:", payload);

    // Emit the message
    socket.emit("send-message", payload);

    // Show my message immediately
    setMessages((prev) => [...prev, { sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white pt-2 rounded-t-3xl shadow-2xl">
      <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b-2">
        <h3 className="text-2xl font-semibold">Live Chat</h3>
        <button onClick={() => setChatPanelOpen(false)} className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center active:scale-95">
          <i className="ri-arrow-down-wide-line text-2xl text-gray-700"></i>
        </button>
      </div>

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
            <p>Say hello to your {receiverType === 'captain' ? 'Driver' : 'Passenger'}</p>
          </div>
        )}
      </div>

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