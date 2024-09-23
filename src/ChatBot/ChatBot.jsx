import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import './chat_bot.css'; // Đảm bảo đường dẫn đúng
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import { GoDependabot } from 'react-icons/go';
import { Tooltip } from 'antd';
import 'antd/dist/reset.css'; // Import style của Ant Design

const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi  là mi lu có thể giúp gì cho bạn hôm nay 😊'),
  ],
};

function ChatBot() {
  const [isChatBotVisible, setChatBotVisible] = useState(false);

  const toggleChatBot = () => {
    setChatBotVisible(!isChatBotVisible);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Tooltip title={isChatBotVisible ? 'Ẩn ChatBot' : 'Hiện ChatBot'}>
        <div
          onClick={toggleChatBot}
          className="toggle-icon"
        >
          <GoDependabot />
        </div>
      </Tooltip>

      {isChatBotVisible && (
        <div className="chatbot-container">
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
