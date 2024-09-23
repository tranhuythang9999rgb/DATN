class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (
            lowerCaseMessage.includes('xin chào')) {
            this.actionProvider.handleHello();
        } else if (
            lowerCaseMessage.includes('giúp đỡ') ||
            lowerCaseMessage.includes('trợ giúp')
        ) {
            this.actionProvider.handleHelp();
        }
        else {
            this.actionProvider.handleDefault();
        }
    }
}

export default MessageParser;
