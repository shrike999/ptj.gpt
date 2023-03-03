import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { FiSend } from 'react-icons/fi';
export default function Home() {
  const messageInputRef = useRef(null)
  const chatWindowRef = useRef(null)
  const [chatHistory, setChatHistory] = useState([])
  const [isFetchingResponse, setIsFetchingResponse] = useState(false)
  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [chatHistory])

  async function handleSubmitMessage() {
    if(isFetchingResponse){
      alert('Be patient')
      return
    }
    const newUserMessage = messageInputRef.current.value
    if(newUserMessage === ''){
      alert('Say something, pease')
      return
    }
    messageInputRef.current.value = ''
    setChatHistory(prevChatHistory => [...prevChatHistory, {role: 'user', content: newUserMessage}])
    setIsFetchingResponse(true)
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
        setChatHistory(prevChatHistory => {
          return [...prevChatHistory, data.result.choices[0].message]
        })
      } catch (error) {
        console.error(error)
      }
    }
    setIsFetchingResponse(false)
  }


  return (
    <div>
      <Head>
        <title>PTJ.GPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <ul className={styles.messageList} ref={chatWindowRef}>
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
