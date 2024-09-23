
class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
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

export default ActionProvider;
