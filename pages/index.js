import Head from "next/head";
import { useRef, useState } from "react";
import styles from "./index.module.css";
import { FiSend } from 'react-icons/fi';
export default function Home() {
  const messageInputRef = useRef()
  const [chatHistory, setChatHistory] = useState([])

  async function handleSubmitMessage() {
    const newUserMessage = messageInputRef.current.value
    setChatHistory(prevChatHistory => [...prevChatHistory, {role: 'user', content: newUserMessage}])
    if(newUserMessage !== ''){
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [...chatHistory, {role: 'user', content: newUserMessage}] }),
        });
        const data = await response.json();
        console.log(data);
        setChatHistory(prevChatHistory => [...prevChatHistory, data.result.choices[0].message])
      } catch (error) {
        console.error(error)
      }
    }
  }


  return (
    <div>
      <Head>
        <title>PTJ.GPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <ul className={styles.messageList}>
          {
            chatHistory.map(({role, content}, index) => (
              <li key={index} className={role === 'user' ? styles.userMessage : styles.assistantMessage}>
                <div >
                {content}
                </div>
                </li>
              ))
          }
        </ul>
        <div className={styles.formSection}>
          <textarea type={'content'} ref={messageInputRef} className={styles.userInput}/>
          <button onClick={handleSubmitMessage} className={styles.submitButton}>
            <FiSend/>
          </button>
        </div>
      </main>
    </div>
  );
}
