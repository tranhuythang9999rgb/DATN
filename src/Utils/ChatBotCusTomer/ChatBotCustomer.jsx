import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
import createChatBotConfig from './config'; // Import config

const ChatBotComponent = () => {
  const config = createChatBotConfig();

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <Chatbot
        actionProvider={ActionProvider}
        messageParser={MessageParser}
        config={config} // Sử dụng cấu hình
        headerText='Sách Thông Minh' // Có thể bỏ qua ở đây vì đã có trong config
        placeholderText='Nhập tin nhắn của bạn...'
        runInitialMessagesWithHistory
        disableScrollToBottom={false}
      />
    </div>
  );
};

export default ChatBotComponent;
