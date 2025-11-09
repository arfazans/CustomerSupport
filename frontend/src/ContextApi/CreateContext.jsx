import { createContext } from "react";
export const NoteContext = createContext();




//   return (
//     <div className="flex flex-col h-full w-full bg-transparent border border-gray-300">
//       {/* Messages */}
//       <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`max-w-[60%] px-[14px] py-[10px] rounded-2xl text-[15px] break-words inline-block backdrop-blur-md
//         ${
//           message.senderId === userid
//             ? "self-end bg-blue-500/20 text-white"
//             : "self-start bg-[rgba(165,42,42,0.25)] text-white"
//         }`}
//           >
//             {message.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       {/* Input always pinned to bottom */}
//       <div
//         className={`p-4 border-t border-gray-300 bg-transparent ${
//           showChatbot ? "p-4" : "pr-24 pb-6"
//         }`}
//       >
//         {showChatbot ? (
//           <div className="flex items-center w-full space-x-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Message..."
//               className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!newMessage.trim()}
//               className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ minWidth: "2.5rem" }}
//             >
//               <Send className="w-5 h-5" onSubmit={handleSendMessage} />
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center space-x-3">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Message..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!newMessage.trim()}
//               className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;