import React, { useEffect, useState } from 'react';

function AppSocket() {
    const [messagesReceiver, setMessagesReceiver] = useState([]);
    const [messageSend, setMessageSend] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [webSocket, setWebSocket] = useState(null);
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (username) {
            // Tạo kết nối WebSocket khi có tên người dùng
            const ws = new WebSocket(`ws://localhost:8080/ws/${username}`);
            setWebSocket(ws);

            ws.onopen = () => {
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessagesReceiver((prevMessages) => [...prevMessages, message]);
            };

            ws.onclose = () => {
                setIsConnected(false);
            };

            // Dọn dẹp kết nối WebSocket khi component unmount hoặc username thay đổi
            return () => {
                ws.close();
            };
        }
    }, [username]);

    const handleSendMessage = () => {
        if (webSocket && messageSend && username && receiverName) {
            const message = {
                sender_id: username,
                receiver_id: receiverName,
                content: messageSend,
            };
            webSocket.send(JSON.stringify(message));
            setMessageSend(''); // Xóa nội dung sau khi gửi
        }
    };

    return (
        <div>
            {!username ? (
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name"
                    /><br/>
                </div>
            ) : (
                <div>
                    <label>Receiver</label>
                    <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="Enter receiver's name"
                    /><br/>
                    <label>Input message:</label>
                    <input
                        type="text"
                        value={messageSend}
                        onChange={(e) => setMessageSend(e.target.value)}
                        placeholder="Enter your message"
                    /><br/>
                    <button onClick={handleSendMessage} disabled={!isConnected}>Send</button>
                    <br/>
                    <label>Message Receiver:</label>
                    <div>
                        {messagesReceiver.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.sender_id}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    <br/>
                    <label>Message Send:</label>
                    <div>{messageSend}</div>
                </div>
            )}
        </div>
    );
}

export default AppSocket;
