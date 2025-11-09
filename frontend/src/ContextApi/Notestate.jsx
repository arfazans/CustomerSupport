import { useRef, useState, useEffect } from "react";
import { connectWS } from "../socket";
import { NoteContext } from "./CreateContext";
import axios from "axios";
const NoteState = ({ children }) => {
  const socket = useRef(null);
  const [userId, setUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
    // New state to keep track of recent messages per user
  const [recentMessages, setRecentMessages] = useState({});



   // Function to update recent messages, key is user ID, value is last message text
  const updateRecentMessage = (userId, messageText) => {
    setRecentMessages(prev => ({
      ...prev,
      [userId]: messageText,
    }));
  }


  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:9860/user/check-auth", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          setUserId(user.userId || user._id);
        } else {
          setUserId(null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  // Initialize socket only after userId is set (user logged in)
  useEffect(() => {
    if (!userId) {
      // If no user, disconnect existing socket if any
      if (socket.current) {
              socket.current.removeAllListeners(); // Remove all handlers before disconnecting
        socket.current.disconnect();
        socket.current = null;
        setOnlineUsers([]);
        setRecentMessages({});

      }
      return;
    }



     // Fetch recent messages for sidebar initial load
   const fetchRecentMessages = async () => {
    try {
      const res = await axios.get("http://localhost:9860/message/recent-messages", {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        setRecentMessages(res.data.recentMessages);
      }
    } catch (error) {
      console.error("Failed to fetch recent messages", error);
    }
  };


    fetchRecentMessages();


    // Before creating a new socket, clean old socket safely if exists
  if (socket.current) {
    socket.current.removeAllListeners();
    socket.current.disconnect();
    socket.current = null;
  }

    // Connect socket for logged-in user
    socket.current = connectWS();

    // Event listener: send user-online after socket connects
    const onConnect = () => {
      console.log("Socket connected", socket.current.id);
      socket.current.emit("user-online", userId);
    };

    // Handle online-user list updates from server
    const handleOnlineUsers = (users) => {
      console.log("Received online users:", users);
      setOnlineUsers(users);
    };

    socket.current.on("connect", onConnect);
    socket.current.on("online-user", handleOnlineUsers);


      const handleIncomingMessage = (data) => {
    console.log("Received socket message in context:", data);
    updateRecentMessage(data.senderId, data.text);
    updateRecentMessage(data.receiverId, data.text);
  };
  socket.current.on("message", handleIncomingMessage);

    // Cleanup on userId change/disconnect
    return () => {
      if (socket.current) {
        socket.current.off("connect", onConnect);
        socket.current.off("online-user", handleOnlineUsers);
            socket.current.off("message", handleIncomingMessage);

        socket.current.disconnect();
        socket.current = null;
      }
      setOnlineUsers([]);
       setRecentMessages({});
    };
  }, [userId]);

  return (
    <NoteContext.Provider value={{ socket,setUserId, userId, onlineUsers,recentMessages,updateRecentMessage }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteState;
