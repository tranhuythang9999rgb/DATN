import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import MessageParser from './ProcessMess';
import ActionProvider from './Actions';


const config = {
  botName: 'Trợ Lý Ảo',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi  là mi lu có thể giúp gì cho bạn hôm nay 😊'),
  ],
};

function ChatBots() {

  return (

    <div style={{ marginLeft: '50px' }} className="chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText='Sách Thông Minh'
      />
    </div>
  );
}

export default ChatBots;
