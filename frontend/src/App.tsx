import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [connectedToRoom, setConnectedToRoom] = useState(false);
  const wsRef = useRef<WebSocket>(null);

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "12345",
          },
        })
      );
      setConnectedToRoom(true);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: msg,
        },
      })
    );
    setMsg("");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-gradient-to-br from-gray-900 via-neutral-950 to-black">
      <div className="text-4xl text-white font-bold my-20">Chat App</div>
      {!connectedToRoom ? (
        <div className="p-5 w-xl h-fit bg-gray-800 flex flex-col items-center rounded-xl border-b-2 border-r-2 border-neutral-500">
          <h2 className="text-2xl text-white font-bold mb-8">Join Room</h2>
          <div className="w-3/4 mx-auto flex justify-center items-center">
            <input
              className="flex-1 p-2 bg-gray-600 mr-3 rounded-md text-neutral-300"
              type="text"
              placeholder="Enter room id"
            />
            <button className="px-4 py-2 rounded-xl bg-black text-white cursor-pointer">
              Enter
            </button>
          </div>
        </div>
      ) : (
        <div className="w-2xl h-5/8 flex p-4 flex-col bg-gray-800/50 z-10 rounded-3xl">
          <div className="flex-1 w-full mb-3 rounded-xl bg-black overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="h-8 text-white text-sm flex items-center px-3 w-full border-b border-gray-600"
              >
                {msg}
              </div>
            ))}
          </div>
          <div className="h-1/8 w-full flex items-center p-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 h-10 bg-gray-900 text-neutral-300 rounded-2xl p-3 border border-gray-700"
              type="text"
              placeholder="Enter your message..."
            />
            <button
              onClick={handleSendMessage}
              className="h-full px-4 py-2 bg-black/80 text-white ml-2 rounded-full text-sm cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
