import { Helmet } from "react-helmet-async";
import { DivisionChat } from "@/components/chat/DivisionChat";

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>Team Chat | Bridge</title>
        <meta name="description" content="Collaborate with your division team" />
      </Helmet>
      
      <div className="h-full flex flex-col overflow-hidden">
        <DivisionChat />
      </div>
    </>
  );
};

export default Chat;
