import { useEffect, useState } from "react";
import "./Home.css";

const messages = [
  "You've been here before.",
  "I can feel your cursor moving.",
  "Something is watching.",
  "The page remembers.",
  "Stay awhile.",
];

export default function Home() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="overlay" />

      <div className="hero">
        <p className="subtitle">WELCOME TO</p>

        <h1 className="title">THE WATCHER</h1>

        <p className="message">{messages[messageIndex]}</p>

        <button className="enter-btn">Enter If You Dare</button>
      </div>
    </div>
  );
}
