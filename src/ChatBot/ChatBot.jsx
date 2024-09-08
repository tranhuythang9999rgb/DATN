import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import './chat_bot.css';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import { GoDependabot } from 'react-icons/go';
import { Tooltip } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

// Configuration for the ChatBot
const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn hôm nay 😊'),
  ],
};

function ChatBot() {
  // State to manage visibility of the ChatBot
  const [isChatBotVisible, setChatBotVisible] = useState(false);

  // Toggle visibility
  const toggleChatBot = () => {
    setChatBotVisible(!isChatBotVisible);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Icon to toggle ChatBot with Ant Design Tooltip */}
      <Tooltip title={isChatBotVisible ? 'Ẩn ChatBot' : 'Hiện ChatBot'}>
        <div
          onClick={toggleChatBot}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            cursor: 'pointer',
            fontSize: '50px'
          }}
        >
          <GoDependabot />
        </div>
      </Tooltip>

      {/* Conditionally render ChatBot */}
      {isChatBotVisible && (
        <div className="chatbot-container" style={{ position: 'fixed', bottom: '80px', right: '20px' }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
}

export default ChatBot;
