import React, { useState, useContext, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { NoteContext } from '../../../ContextApi/CreateContext';
import ChatWindow from './ChatWindow';
import { GroupChatWindow } from '../../groups';
import axios from 'axios';
import aman from '../../../assets/aman.jpg';

const MobileMessaging = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [chatbotInput, setChatbotInput] = useState('');
  
  const {
    recentMessages,
    userId,
    onlineUsers,
    unreadUsers,
  } = useContext(NoteContext);

  useEffect(() => {
    axios.get('http://localhost:9860/message/users', { withCredentials: true }).then((res) => {
      if (res.data.success) {
        setUsers(res.data.users);
      }
    });

    axios.get('http://localhost:9860/group/my-groups', { withCredentials: true }).then((res) => {
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    });
  }, []);

  const handleUserSelect = (id) => {
    setSelectedUserId(id);
    setSelectedGroupId(null);
    setShowChatbot(false);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedUserId(null);
    setShowChatbot(false);
  };

  const handleChatbotSelect = () => {
    setShowChatbot(true);
    setSelectedUserId(null);
    setSelectedGroupId(null);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
    setSelectedGroupId(null);
    setShowChatbot(false);
  };

  const handleSendChatbotMessage = () => {
    if (!chatbotInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: chatbotInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatbotMessages(prev => [...prev, userMessage]);
    setChatbotInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: `I received your message: "${userMessage.text}". How can I help you?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setChatbotMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  if (selectedUserId || selectedGroupId || showChatbot) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {selectedUserId && (
            <ChatWindow
              sendigToUsersId={selectedUserId}
              userid={userId}
              showChatbot={true}
              otherUserName={users.find(u => u._id === selectedUserId)?.name || 'User'}
              onBack={handleBackToList}
            />
          )}
          {selectedGroupId && (
            <GroupChatWindow
              groupId={selectedGroupId}
              userid={userId}
              groupName={groups.find(g => g._id === selectedGroupId)?.name || 'Group Chat'}
              memberCount={groups.find(g => g._id === selectedGroupId)?.members.length || 0}
              groupCreatorId={groups.find(g => g._id === selectedGroupId)?.createdBy || null}
              groupMembers={groups.find(g => g._id === selectedGroupId)?.members || []}
              showChatbot={true}
              onBack={handleBackToList}
            />
          )}
          {showChatbot && (
            <div className="h-full bg-[#edf0f3] flex flex-col overflow-hidden">
              <div className="sticky top-0 z-10 px-4 py-2 border-b border-gray-300 bg-white shadow-sm">
                <div className="flex items-center">
                  <button onClick={handleBackToList} className="mr-3">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h3 className="text-base font-semibold text-gray-800">Assistant</h3>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {chatbotMessages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <p>Chat with AI Assistant</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatbotMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'self-end bg-[#5B50A7] text-white ml-auto'
                            : 'self-start bg-[#CFD8DC] text-black'
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-300 bg-transparent">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatbotInput}
                    onChange={(e) => setChatbotInput(e.target.value)}
                    placeholder="Message Assistant..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatbotMessage()}
                  />
                  <button 
                    onClick={handleSendChatbotMessage}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      <div className="flex items-center p-4 border-b">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 p-3 text-center font-medium ${
            activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 p-3 text-center font-medium ${
            activeTab === 'groups' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
          }`}
        >
          Groups
        </button>
        <button
          onClick={handleChatbotSelect}
          className="flex-1 p-3 text-center font-medium text-gray-600"
        >
          Chatbot
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'users' && (
          <div className="p-2">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user._id)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src={user.profileImage || aman}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{user.name}</h3>
                    {onlineUsers.includes(String(user._id)) && (
                      <span className="ml-2 text-xs text-green-500">online</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {recentMessages[user._id] || "No messages yet"}
                  </p>
                </div>
                {unreadUsers[user._id] && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="p-2">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => handleGroupSelect(group._id)}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members.length} members</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMessaging;