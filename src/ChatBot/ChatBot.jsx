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

// Cấu hình cho ChatBot
const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn hôm nay 😊'),
  ],
};

function ChatBot() {
  // State để quản lý trạng thái hiển thị của ChatBot
  const [isChatBotVisible, setChatBotVisible] = useState(false);

  // Hàm toggle để chuyển đổi trạng thái hiển thị
  const toggleChatBot = () => {
    setChatBotVisible(!isChatBotVisible);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Icon để toggle ChatBot với Ant Design Tooltip */}
      <Tooltip title={isChatBotVisible ? 'Ẩn ChatBot' : 'Hiện ChatBot'}>
        <div
          onClick={toggleChatBot}
          className="toggle-icon"
        >
          <GoDependabot />
        </div>
      </Tooltip>

      {/* Render ChatBot theo điều kiện */}
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
