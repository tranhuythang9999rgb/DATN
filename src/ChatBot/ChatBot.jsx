import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import './chat_bot.css';;
// Cấu hình chatbot (Config)
const config = {
  botName: 'Trợ Lý Ảo', // Đổi tên bot sang tiếng Việt
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn hôm nay?'),
  ],
};

// Bộ phân tích tin nhắn (MessageParser)
// Bộ phân tích tin nhắn (MessageParser)
class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      // Kiểm tra các từ khóa để chào lại
      if (
        lowerCaseMessage.includes('xin chào') || 
        lowerCaseMessage.includes('chào') || 
        lowerCaseMessage.includes('hi') || 
        lowerCaseMessage.includes('hello')
      ) {
        this.actionProvider.handleHello();
      } else if (
        lowerCaseMessage.includes('giúp đỡ') || 
        lowerCaseMessage.includes('trợ giúp')
      ) {
        this.actionProvider.handleHelp();
      } else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
// Bộ xử lý hành động (ActionProvider)
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleHello() {
    const botMessage = this.createChatBotMessage('Xin chào! Rất vui được gặp bạn.');
    this.updateChatbotState(botMessage);
  }

  handleHelp() {
    const botMessage = this.createChatBotMessage(
      'Tôi có thể giúp bạn với nhiều vấn đề khác nhau. Hãy cho tôi biết bạn cần hỗ trợ về vấn đề gì?'
    );
    this.updateChatbotState(botMessage);
  }

  handleDefault() {
    const botMessage = this.createChatBotMessage(
      'Xin lỗi, tôi không hiểu rõ ý của bạn. Bạn có thể diễn đạt lại được không?'
    );
    this.updateChatbotState(botMessage);
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

// Thành phần ChatBot (ChatBot component)
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
