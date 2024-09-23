import CustomMessage from './CustomMessage'; // Đường dẫn tới component

const createChatBotConfig = () => {
    return {
      botName: "Sách Thông Minh", // Đặt tên cho bot
      initialMessages: [
        { type: "custom", component: <CustomMessage text="Xin chào! Tôi có thể giúp gì cho bạn trong việc tìm sách? Đừng quên kiểm tra [tên website](http://example.com)!" /> }
      ],
      customStyles: {
        botMessageBox: {
          backgroundColor: "#0084ff",
        },
        chatButton: {
          backgroundColor: "#0084ff",
        },
      },
    };
};

export default createChatBotConfig;
