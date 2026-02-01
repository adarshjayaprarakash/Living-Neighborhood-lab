import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { api } from '../api';

const ChatBot = ({ context }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I\'m your Green Neighborhood AI. How can I help you improve the locality today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.chat(userMsg, context);
            setMessages(prev => [...prev, { sender: 'bot', text: res.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Oops, I lost connection to the city servers.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
            {isOpen && (
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl w-80 h-[28rem] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-emerald-400 p-4 flex justify-between items-center text-white">
                        <h3 className="font-bold flex items-center gap-2 text-lg">
                            <Bot className="w-5 h-5" /> Eco-Assistant
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 rounded-2xl rounded-bl-sm px-4 py-2 text-xs border border-gray-100 flex items-center gap-1">
                                    Thinking<span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Ask about trees, AQI..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="p-2 bg-secondary rounded-xl hover:bg-blue-500 disabled:opacity-50 text-white shadow-md transition-all active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-red-400 rotate-90' : 'bg-gradient-to-r from-primary to-emerald-500 animate-bounce-slow'
                    }`}
            >
                {isOpen ? <X className="w-8 h-8 text-white" /> : <MessageSquare className="w-8 h-8 text-white" />}
            </button>
        </div>
    );
};

export default ChatBot;
