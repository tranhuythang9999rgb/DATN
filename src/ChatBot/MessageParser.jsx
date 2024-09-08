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
        } else if (
            lowerCaseMessage.includes('ngày hôm nay') ||
            lowerCaseMessage.includes('mấy giờ')
        ) {
            this.actionProvider.handleDateTime();
        } else if (
            lowerCaseMessage.includes('sách mới nhất') ||
            lowerCaseMessage.includes('mới nhất')
        ) {
            this.actionProvider.handleLatestBooks();
        }else if(
            lowerCaseMessage.includes('ok')
        ){
        this.actionProvider.handleOk();
        }
        else {
            this.actionProvider.handleDefault();
        }
    }
}

export default MessageParser;
