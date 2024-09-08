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
        } else if (
            lowerCaseMessage.includes('ok')
        ) {
            this.actionProvider.handleOk();
        } else if (
            lowerCaseMessage.includes('bạn là ai')
        ) {
            this.actionProvider.handleBanLaAi();
        } else if (
            lowerCaseMessage.includes('địa chỉ cửa hàng ở đâu') ||
            lowerCaseMessage.includes('địa chỉ cửa hàng') ||
            lowerCaseMessage.includes('cửa hàng ở đâu') ||
            lowerCaseMessage.includes('địa chỉ của bạn') ||
            lowerCaseMessage.includes('cửa hàng của bạn ở đâu') ||
            lowerCaseMessage.includes('vị trí cửa hàng') ||
            lowerCaseMessage.includes('nơi cửa hàng') ||
            lowerCaseMessage.includes('tìm cửa hàng') ||
            lowerCaseMessage.includes('cửa hàng nằm ở đâu') ||
            lowerCaseMessage.includes('địa điểm cửa hàng') ||
            lowerCaseMessage.includes('địa chỉ cửa hàng của bạn') ||
            lowerCaseMessage.includes('cửa hàng của bạn ở đâu') ||
            lowerCaseMessage.includes('chỗ cửa hàng') ||
            lowerCaseMessage.includes('đc cửa hàng') ||
            lowerCaseMessage.includes('dc cửa hàng') ||
            lowerCaseMessage.includes('đc cửa') ||
            lowerCaseMessage.includes('dc cửa') ||
            lowerCaseMessage.includes('đc bạn') ||
            lowerCaseMessage.includes('dc bạn') ||
            lowerCaseMessage.includes('cửa hàng đc') ||
            lowerCaseMessage.includes('cửa hàng dc') ||
            lowerCaseMessage.includes('cửa hàng địa chỉ') ||
            lowerCaseMessage.includes('cửa hàng ở') ||
            lowerCaseMessage.includes('địa chỉ cửa') ||
            lowerCaseMessage.includes('cửa hàng chỗ') ||
            lowerCaseMessage.includes('đc') ||
            lowerCaseMessage.includes('dc') ||
            lowerCaseMessage.includes('địa chỉ')||
            lowerCaseMessage.includes('vt')||
            lowerCaseMessage.includes('vtri') ||
            lowerCaseMessage.includes('vị trí')     // Để đảm bảo tính chính xác
        ) {
            this.actionProvider.handleStoreAddress();
        }
        else {
            this.actionProvider.handleDefault();
        }
    }
}

export default MessageParser;
