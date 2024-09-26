class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('xin chào')) {
            this.actionProvider.handleDefault();
        } else {
            this.actionProvider.handleSearch(message);  // Pass the original message
        }
    }
}

export default MessageParser;
