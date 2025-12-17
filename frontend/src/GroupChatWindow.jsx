import React, { useState, useRef, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import { NoteContext } from "./ContextApi/CreateContext";
import axios from "axios";

const GroupChatWindow = ({ showChatbot, userid, groupId, groupName, memberCount }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const { socket } = useContext(NoteContext);

  // Scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch group messages when groupId changes
  useEffect(() => {
    if (!groupId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9860/group/${groupId}/messages`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching group messages:", error);
      }
    };

    fetchMessages();
  }, [groupId]);

  // Listen for incoming group messages and typing events
  useEffect(() => {
    if (!socket.current || !groupId) return;

    // Join the group room
    socket.current.emit("join-group", groupId);

    const handleIncomingGroupMessage = (data) => {
      // Only show message if it's for this group
      if (data.groupId === groupId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleGroupTyping = ({ from, userName }) => {
      if (from !== userid) {
        setTypingUsers(prev => new Set([...prev, userName]));
      }
    };

    const handleGroupStopTyping = ({ from, userName }) => {
      if (from !== userid) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userName);
          return newSet;
        });
      }
    };

    socket.current.on("group-message", handleIncomingGroupMessage);
    socket.current.on("group-typing", handleGroupTyping);
    socket.current.on("group-stop-typing", handleGroupStopTyping);

    return () => {
      // Leave the group room when component unmounts
      socket.current.emit("leave-group", groupId);
      socket.current.off("group-message", handleIncomingGroupMessage);
      socket.current.off("group-typing", handleGroupTyping);
      socket.current.off("group-stop-typing", handleGroupStopTyping);
      setTypingUsers(new Set());
    };
  }, [groupId, socket, userid]);

  // Send group message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      text: newMessage.trim(),
      groupId,
      messageType: 'group'
    };

    try {
      // Save message in DB
      const res = await axios.post(
        `http://localhost:9860/group/send-message`,
        msg,
        { withCredentials: true }
      );

      if (res.data.success) {
        const savedMessage = res.data.message;

        // Emit real-time group message (socket will handle UI update)
        socket.current.emit("group-message", savedMessage);

        // DON'T manually update UI - let socket handle it to avoid duplicates
      }
    } catch (error) {
      console.error("Error sending group message:", error);
    }

    setNewMessage("");
  };

  // Enter key sends message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group typing indicator
  const handleTyping = () => {
    if (!socket.current) return;
    
    // Get current user's name from messages (assuming we have it)
    const currentUserName = messages.find(msg => msg.senderId._id === userid)?.senderId.name || 'You';
    
    socket.current.emit("group-typing", { groupId, from: userid, userName: currentUserName });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("group-stop-typing", { groupId, from: userid, userName: currentUserName });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f3] border border-gray-300">
      {/* Group Header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <h3 className="text-lg font-semibold text-gray-800">{groupName}</h3>
        <p className="text-sm text-gray-500">{memberCount} members</p>
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`max-w-[60%] px-[14px] py-[10px] rounded-2xl text-[15px] break-words backdrop-blur-md
              flex flex-col ${
                message.senderId._id === userid
                  ? "self-end bg-[#5B50A7] text-white"
                  : "self-start bg-[#CFD8DC] text-black"
              }`}
          >
            {/* Show sender name for others' messages */}
            {message.senderId._id !== userid && (
              <div className="text-xs font-semibold mb-1 text-gray-600">
                {message.senderId.name}
              </div>
            )}
            <div>{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.size > 0 && (
        <div className="self-start px-3 py-2 ml-4 mb-5 bg-gray-200 rounded-2xl max-w-max shadow flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="block w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
            <span className="block w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150" />
            <span className="block w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300" />
          </div>
          <span className="text-xs text-gray-600">
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

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
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Message to group..."
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

export default GroupChatWindow;