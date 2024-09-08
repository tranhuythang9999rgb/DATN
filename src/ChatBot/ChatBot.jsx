import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import './chat_bot.css';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
// Cấu hình chatbot (Config)
const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn hôm nay 😊'),
  ],
};
function ChatBot() {
  return (
    <div className="chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default ChatBot;
