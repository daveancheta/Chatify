import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessageLoadingSkeleton';

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
  }, [getMessagesByUserId, selectedUser])
  return (
    <>
      <ChatHeader />
      <div className='flex-1 px6 overflow-y-auto py-8'>
        {messages.length > 0 && !isMessagesLoading ?
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map(msg => (
              <div key={msg._id} className={`chat 
              ${msg.senderId === authUser._id ?
                  'chat-end' : 'chat-start'}`}>

                <div className={`chat-bubble relative 
                  ${msg.senderId === authUser._id ?
                    'bg-cyan-600 textwhite' : 'bg-slate-800 text-slate-200'}`}>
                  {msg.image && <img src={msg.image} alt=""  className='m-2'/>}
                  {msg.text && <p className='m-2'>{msg.text}</p>
                 }
                  <p className='m-2 text-xs opacity-75'>{new Date(msg.createdAt).toISOString().slice(11, 16)}</p>
                </div>
              </div>
            ))}
          </div>
          : isMessagesLoading ? <MessagesLoadingSkeleton/> :
          <NoChatHistoryPlaceholder name={selectedUser.fullname} />}
      </div>

      <MessageInput/>
    </>
  )
}

export default ChatContainer