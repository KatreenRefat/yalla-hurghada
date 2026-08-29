import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../services/chatApi";
import { useLanguage } from "../../context/useLanguage";
import "./ChatWidget.css";

const content = {
  EN: {
    title: "YallaHurghada Assistant",
    subtitle: "Ask me about tours, hotels, restaurants & transport",
    placeholder: "Type your question...",
    send: "Send",
    greeting: "Hi! 👋 Ask me about our tours, hotels, restaurants or transport — for example: \"hotels under $100\" or \"tours in Hurghada\".",
    thinking: "Typing...",
    error: "Sorry, something went wrong. Please try again.",
  },
  AR: {
    title: "مساعد يلا الغردقة",
    subtitle: "اسألني عن الجولات والفنادق والمطاعم والنقل",
    placeholder: "اكتب سؤالك...",
    send: "إرسال",
    greeting: "أهلاً! 👋 اسألني عن الجولات أو الفنادق أو المطاعم أو وسائل النقل — مثلاً: \"فنادق أقل من 100 دولار\".",
    thinking: "يكتب...",
    error: "حدث خطأ ما، حاول مرة أخرى.",
  },
  RU: {
    title: "Помощник YallaHurghada",
    subtitle: "Спросите про туры, отели, рестораны и транспорт",
    placeholder: "Введите вопрос...",
    send: "Отправить",
    greeting: "Привет! 👋 Спросите про туры, отели, рестораны или транспорт — например: \"отели до 100 долларов\".",
    thinking: "Печатает...",
    error: "Что-то пошло не так. Попробуйте снова.",
  },
};

export default function ChatWidget() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);



  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(text);
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-widget__window">
          <div className="chat-widget__header">
            <div>
              <div className="chat-widget__title">{t.title}</div>
              <div className="chat-widget__subtitle">{t.subtitle}</div>
            </div>
            <button className="chat-widget__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-widget__messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-widget__bubble chat-widget__bubble--${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-widget__bubble chat-widget__bubble--bot chat-widget__bubble--typing">
                {t.thinking}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-widget__input-row">
            <textarea
              className="chat-widget__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              rows={1}
            />
            <button className="chat-widget__send" onClick={handleSend} disabled={loading}>
              {t.send}
            </button>
          </div>
        </div>
      )}

      <button
        className="chat-widget__fab"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}