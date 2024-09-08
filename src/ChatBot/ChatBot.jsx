import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';

// Config
const config = {
  botName: 'ChatBot',
  initialMessages: [
    createChatBotMessage('Xin chào! Tôi có thể giúp gì cho bạn hôm nay?'),
  ],
};

// MessageParser
class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('xin chào') || lowerCaseMessage.includes('chào')) {
      this.actionProvider.handleHello();
    } else if (lowerCaseMessage.includes('giúp đỡ') || lowerCaseMessage.includes('trợ giúp')) {
      this.actionProvider.handleHelp();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

// ActionProvider
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

// ChatBot component
function ChatBot() {
  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default ChatBot;