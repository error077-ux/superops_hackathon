// ChatBot.tsx - FINAL FIX with proper scrolling container

import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your compliance assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error('Chat API request failed');
      }

      const result = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: result.reply || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again or check if the backend is running.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/50"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
            style={{ width: '420px', height: '600px' }}
          >
            <Card className="h-full flex flex-col bg-gray-900/95 border-gray-700 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-sm">Compliance Assistant</h3>
                      <p className="text-xs text-blue-100">Always here to help</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages - FIXED SCROLLING CONTAINER */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
                style={{ 
                  scrollBehavior: 'smooth',
                  maxHeight: 'calc(600px - 140px)' // Total height - header - input
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'bot'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : 'bg-gradient-to-r from-teal-600 to-blue-600'
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div 
                      className={`flex flex-col ${
                        message.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                      style={{ maxWidth: 'calc(100% - 48px)' }}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'bot'
                            ? 'bg-gray-800 text-gray-100'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        }`}
                        style={{ 
                          width: 'fit-content',
                          maxWidth: '100%'
                        }}
                      >
                        <div 
                          className="text-sm leading-relaxed"
                          style={{ 
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 text-gray-100 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input - FIXED AT BOTTOM */}
              <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-900/95">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="bg-gray-950 border-gray-700 text-white placeholder:text-gray-500 flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Powered by AI • ISO 27001 Expert</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
