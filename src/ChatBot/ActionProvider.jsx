import axios from "axios";

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

    handleDateTime() {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        const botMessage = this.createChatBotMessage(
            `Hôm nay là ngày ${formattedDate}, thời gian hiện tại là ${formattedTime}.`
        );

        this.updateChatbotState(botMessage);
    }

    async handleLatestBooks() {
        try {
            // Fetch the list of books from the API
            const response = await axios.get('http://127.0.0.1:8080/manager/book/list');
            const books = response.data.body;
    
            if (books && books.length > 0) {
                // Convert title to uppercase and ensure price is formatted
                const upperCaseTitle = books[0].title.toUpperCase();
                const formattedPrice = books[0].price.toLocaleString('en-US', { style: 'currency', currency: 'VND' });
    
                // Create the message with formatted title and price
                const botMessage = this.createChatBotMessage(
                    `CUỐN SÁCH MỚI NHẤT LÀ: "${upperCaseTitle}" CHỈ VỚI GIÁ ${formattedPrice}.`
                );
                this.updateChatbotState(botMessage);
            } else {
                // If no books are found, return an appropriate message
                const botMessage = this.createChatBotMessage('Hiện tại không có sách mới.');
                this.updateChatbotState(botMessage);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sách:', error);
            const botMessage = this.createChatBotMessage('Đã xảy ra lỗi khi lấy danh sách sách.');
            this.updateChatbotState(botMessage);
        }
    }
    
    async handleOk() {

        const botMessage = this.createChatBotMessage(
            `Chắc chắn rồi! Nếu bạn có thêm câu hỏi nào hoặc cần hỗ trợ gì thêm, đừng ngần ngại yêu cầu nhé. Chúc bạn có trải nghiệm vui vẻ! 😊`
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
