import React, { useState, useRef, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import { NoteContext } from "./ContextApi/CreateContext";
import axios from "axios";

//showChatbot is for the right side bot window to maintain the design of the send button of middle send button in dashboard
const ChatWindow = ({ showChatbot, userid, sendigToUsersId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { socket,updateRecentMessage  } = useContext(NoteContext);

  // 🔹 Scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Fetch messages whenever the selected user changes
  useEffect(() => {
    if (!sendigToUsersId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9860/message/${sendigToUsersId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [sendigToUsersId]);

  // 🔹 Listen for incoming messages in real-time
  useEffect(() => {
    if (!socket.current) return;

    const handleIncomingMessage = (data) => {
      // Only show message if it’s from or to this user
      if (
        (data.senderId === userid && data.receiverId === sendigToUsersId) ||
        (data.senderId === sendigToUsersId && data.receiverId === userid)
      ) {
        setMessages((prev) => [...prev, data]);
            // Update recent message for the conversation partner
        const otherUserId = data.senderId === userid ? data.receiverId : data.senderId;
        updateRecentMessage(otherUserId, data.text);
      }
    };

    socket.current.on("message", handleIncomingMessage);
    return () => {
      socket.current.off("message", handleIncomingMessage);
    };
  }, [userid, sendigToUsersId,socket, updateRecentMessage]);

  // 🔹 Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      text: newMessage.trim(),
    };

    try {
      // 1️⃣ Save message in DB
      const res = await axios.post(
        `http://localhost:9860/message/send/${sendigToUsersId}`,
        msg,
        { withCredentials: true }
      );

      if (res.data.success) {
        const savedMessage = res.data.message;

        // 2️⃣ Emit real-time message
        socket.current.emit("message", savedMessage);

        // 3️⃣ Update UI instantly
        setMessages((prev) => [...prev, savedMessage]);

        //for update sender sidebar recent message
        updateRecentMessage(sendigToUsersId, savedMessage.text);

      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage("");
  };

  // 🔹 Enter key sends message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent border border-gray-300">
      {/* Messages */}
<div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[60%] px-[14px] py-[10px] rounded-2xl text-[15px] break-words backdrop-blur-md
    flex ${
      message.senderId === userid
        ? "self-end bg-blue-500/20 text-white justify-end"
        : "self-start bg-[rgba(165,42,42,0.25)] text-white justify-start"
    }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`p-4 border-t border-gray-300 bg-transparent ${
          showChatbot ? "p-4" : "pr-24 pb-6"
        }`}
      >
        <div className="flex items-center w-full space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minWidth: "2.5rem" }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
