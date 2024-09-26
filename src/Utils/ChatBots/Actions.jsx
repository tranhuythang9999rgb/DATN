import axios from 'axios';

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

  async handleSearch(message) {
    try {
      // Gửi yêu cầu POST sử dụng axios
      const response = await axios.post('http://127.0.0.1:8080/manager/transport/pull', {
        content: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Kiểm tra phản hồi từ API
      if (response.data && response.data.body && response.data.body.length > 0) {
        const botMessages = response.data.body.map((item) => {
          const { index } = item;

          // Xử lý theo từng loại index
          let botMessageText = '';
          switch (index) {
            case 1:
              botMessageText = `Sách "${item.name_book}" có giá ${item.price} VND.`;
              break;
            case 2:
              botMessageText = `Chất lượng sách "${item.name_book}" là ${item.quality}.`;
              break;
            case 3:
              botMessageText = `Tác giả: ${item.author}, Quốc tịch: ${item.nationality}, Ngày sinh: ${item.birth_date}.`;
              break;
            case 4:
              botMessageText = `Đơn hàng cho sách "${item.name_book}", số lượng ${item.quantity}, sẽ được gửi tới địa chỉ: ${item.address}. Email liên hệ: ${item.email}, SĐT: ${item.phone_number}.`;
              break;
            default:
              botMessageText = 'Không tìm thấy thông tin phù hợp.';
          }

          return this.createChatBotMessage(botMessageText);
        });

        // Cập nhật chatbot với từng thông điệp
        botMessages.forEach((botMessage) => this.updateChatbotState(botMessage));
      } else {
        // Không có thông tin hợp lệ trong phản hồi
        const botMessage = this.createChatBotMessage('Không thể tìm thấy thông tin.');
        this.updateChatbotState(botMessage);
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      console.error('Error during API call:', error);
      const botMessage = this.createChatBotMessage('Có lỗi xảy ra khi xử lý yêu cầu của bạn.');
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
