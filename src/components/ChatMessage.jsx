import './ChatMessage.css';
const ChatMessage = (props) => {
    return (
        <div className = {"chat-message " + props.type}>
            <div className="msg-container">
                <div className = "chat-message-body">
                    <p>{props.message}</p>
                </div>
                <div className = "chat-message-header">
                    <h1>{props.username}</h1>
                </div>
            </div>
        </div>
    )
}
export default ChatMessage;