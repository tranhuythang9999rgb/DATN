import { remove as removeDiacritics } from 'diacritics';

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
        // Chuyển đổi tin nhắn thành không dấu
        const normalizedMessage = removeDiacritics(message.toLowerCase());
        
        // Biểu thức chính quy để tìm "giá sách" không dấu
        const regex = /giá\s+sách/i; 
        const regexOr = /gia\s+sach/i; // Nếu bạn cần một biểu thức không dấu
    
        // Kiểm tra với biểu thức chính quy
        if (normalizedMessage.match(regex) || normalizedMessage.match(regexOr)) {
            const botMessage = this.createChatBotMessage(
                'Bạn muốn mua sách gì?'
            );
            this.updateChatbotState(botMessage);
        } else {
            const botMessage = this.createChatBotMessage(
                'Xin chào bạn!'
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
