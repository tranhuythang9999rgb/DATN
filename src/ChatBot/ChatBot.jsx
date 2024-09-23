import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

import 'antd/dist/reset.css'; // Import style của Ant Design
// import {style} from './chat_bot.module.css';
const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi  là mi lu có thể giúp gì cho bạn hôm nay 😊'),
  ],
};

function ChatBot() {

  return (
    
        <div style={{marginLeft:'50px'}} className="chatbot-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
  );
}

export default ChatBot;
