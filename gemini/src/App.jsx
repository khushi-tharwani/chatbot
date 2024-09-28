import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const botMessage = { role: "bot", text: response.data };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error in chatbot response:", error);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Mental Health Support Chat</h1>
      </header>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-md ${
              message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.role === 'user' ? 
                  <User size={18} className="text-white" /> : 
                  <Bot size={18} className="text-blue-500" />
                }
                <span className="font-semibold">{message.role === 'user' ? 'You' : 'Support Bot'}</span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white shadow-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;