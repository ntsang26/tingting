import { useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { selectedUser, setMessageNotify } = useChatStore();
  const { socket, authUser } = useAuthStore();

  useEffect(() => {
    // get notify if have new message
    socket.on("newMessage", (newMessage) => {
      if (authUser._id === newMessage.receiverId) {
        if (selectedUser?._id !== newMessage.senderId) {
          setMessageNotify(newMessage.senderId);
        }
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
