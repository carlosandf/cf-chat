import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Message from '@/components/Message'
import useChat from '@/hooks/useChat'
import SendIcon from '@mui/icons-material/Send'
import Input from '@/components/Input'
import Buttom from '@/components/Button'
import { getMessages } from '@/services/chatsSevices'
import { useCongigAutorization } from '@/utils/configAuthorization'
import './Chat.css'

const Chat: React.FC<any> = ({chat}) => {

  const { id: chatId } = useSelector((state: RootState) => state.currentChat)
  const [inputValue, setInputValue] = useState('');
  const [oldMessages, setOldMessages] = useState<any>([])
  const { messages, sendMessage, setMessages } = useChat(chatId)
  const { configRequest } = useCongigAutorization()
  const container: any = useRef()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    sendMessage(event.target.myMessage.value)
    setInputValue('')
  }

  useEffect(() => {
    (async () => {
      const data = await getMessages(chatId, configRequest)
      setMessages([])
      setOldMessages(data)
    })()
  }, [chatId])

  useEffect(() => {
    container.current.scroll(0, container.current.scrollHeight * 2)
  }, [messages])

  return (
    <div className='MainChatContainer'>
      <div className='chatContainer'>
        <header className='chatHeader'>Chat ID: { chatId }</header>
        <ol ref={container} className='messagesContainer'>
          {oldMessages.map((message: any) => (
            <Message key={message.id} {...message} />
          ))}
          {messages.map((message, index) => (
            <Message key={index} {...message} />
          ))}
        </ol>
        <form className='chatForm' onSubmit={(e) => handleSubmit(e)}>
          <Input
            styles={{ marginRight: "1rem" }}
            type='text'
            placeholder='Escribe un mensaje aquí'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            name="myMessage"
          />
          <Buttom
            styles={{
              padding: "1rem",
              width: "auto"
            }}
            type='submit'
            styleClass='primary'
            disabled={inputValue.length < 1}
            text={<SendIcon sx={{ fontSize: 22 }} />}
          />
        </form>
      </div>
    </div>
  )
}

export default Chat