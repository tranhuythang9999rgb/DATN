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
        
        // Biểu thức chính quy để tìm "giá sách" không dấu và lấy tên sách trước chữ "b"
        const regex = /giá\s+sách\s+(.+?)\s+b/i; 
        const regexOr = /gia\s+sach\s+(.+?)\s+b/i; // Nếu bạn cần một biểu thức không dấu
    
        // Kiểm tra với biểu thức chính quy và lấy tên sách
        const match = normalizedMessage.match(regex) || normalizedMessage.match(regexOr);
        
        if (match && match[1]) {
            const bookName = match[1].trim(); // Lấy tên sách từ kết quả khớp
            const botMessage = this.createChatBotMessage(
                `Bạn muốn mua sách "${bookName}" phải không?`
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
