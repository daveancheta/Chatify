import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import { useAuthStore } from '../store/useAuthStore';

function ContactList() {
  const { getAllContacts, allContacts, isUserLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getAllContacts()
  }, [getAllContacts]);

  if (isUserLoading) return <UsersLoadingSkeleton />
  if (allContacts.length === 0) return <NoChatsFound />

  return (
    <>
      {allContacts.map(contact => (
        <div key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}>
          <div className='flex items-center gap-3'>
            <div className={`avatar ${onlineUsers.includes(setSelectedUser._id) ? 'avatar-online' : 'avatar-offline'}`}>
              <div className='size-12 rounded-full'>
                <img src={contact.profilePic || "/avatar.png"} alt="" />
              </div>
            </div>
            <h4>{contact.fullname}</h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ContactList