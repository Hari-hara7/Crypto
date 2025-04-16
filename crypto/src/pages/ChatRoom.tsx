// ChatRoom.tsx
import { FC, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { EmojiClickData } from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { Smile, Send, UserCircle2 } from "lucide-react";

const ChatRoom: FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const safeWords = ["damn", "shit", "fuck"];

  useEffect(() => {
    const q = query(collection(db, "chatroom"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsub;
  }, []);

  const handleSend = async () => {
    if (!user) {
      toast.error("🔒 You must be signed in to send messages.");
      return;
    }

    const blocked = safeWords.some((w) =>
      newMessage.toLowerCase().includes(w)
    );
    if (blocked || newMessage.trim() === "") {
      toast.error("🚫 Inappropriate message or empty input.");
      return;
    }

    await addDoc(collection(db, "chatroom"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      avatar:
        user.photoURL ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${user.uid.slice(
          0,
          5
        )}`,
    });

    setNewMessage("");
    toast.success("✅ Message sent!");
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#1f2937] rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-600">
          <h2 className="text-2xl font-semibold text-yellow-400 flex items-center gap-2">
            💬 Crypto Chat Room
          </h2>
        </div>

        <div className="h-[400px] overflow-y-auto p-4 bg-[#111827] space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4">
              <img
                src={msg.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-yellow-500"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-yellow-400">
                  {msg.displayName}
                </div>
                <div className="bg-gray-800 p-3 rounded-xl text-sm">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {user ? (
          <>
            <div className="px-4 py-4 border-t border-gray-600 bg-[#1f2937]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmoji((s) => !s)}
                  className="p-2 hover:bg-gray-700 rounded-full transition"
                >
                  <Smile className="w-5 h-5 text-yellow-400" />
                </button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-sm px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handleSend}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
              {showEmoji && (
                <div className="mt-3 bg-[#0f172a] rounded-lg">
                  <EmojiPicker onEmojiClick={addEmoji} theme="dark" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-red-400 py-4">
            <UserCircle2 className="w-6 h-6 inline-block mr-2" />
            Please sign in to join the chat.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
