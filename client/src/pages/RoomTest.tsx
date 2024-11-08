import supabase from "@/api/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

// Broadcast Payload
interface BroadcastPayload {
  event: string;
  payload: {
    message: string;
  };
  type: string;
}

export default function RoomTest() {
  const [message, setMessage] = useState("test");
  const [messages, setMessages] = useState<string[]>([]);
  const channelA = supabase.channel("room-1");

  function messageReceived(payload: BroadcastPayload) {
    if (payload.payload?.message) {
      console.log("Received message:", payload.payload.message);
      setMessages((prevMessages) => [...prevMessages, payload.payload.message]);
    } else {
      console.log("Unexpected payload structure:", payload);
    }
  }

  channelA
    .on("broadcast", { event: "test" }, (payload: BroadcastPayload) => {
      messageReceived(payload);
    })
    .subscribe();

  function sendMessage() {
    if (message === "") return;
    channelA.send({
      type: "broadcast",
      event: "test",
      payload: { message },
    });
    setMessage("");
  }

  return (
    <div>
      <h1>Room Test</h1>
      <Input
        value={message}
        placeholder="Message"
        className="text-black"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
