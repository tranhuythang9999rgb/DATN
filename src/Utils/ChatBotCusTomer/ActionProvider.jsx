import CustomLinkMessage from "./CustomMessage";

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

    handleHello() {
        const botMessage = this.createChatBotMessage(
            'Hi chào bạn'
        );
        this.updateChatbotState(botMessage);
    }

    handleUserRequestsUseFullText(message) {
        if (message === '99') {
            const botMessage = this.createChatBotMessage(
                <CustomLinkMessage
                    url="http://localhost:3000/"
                    label="Liên kết của bạn"
                />
            );
            this.updateChatbotState(botMessage);
        } else {
            const botMessage = this.createChatBotMessage(
                `Bạn đã nhập: ${message}`
            );
            this.updateChatbotState(botMessage);
        }
    }

    updateChatbotState(message) {
        this.setState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, message],
        }));
    }
}

export default ActionProvider;
