import React from 'react'
import { create } from "zustand"
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get("/messages/contacts")
            set({ allContacts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMyChatPartners: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get("/messages/chats")
            set({ chats: res.data })
        } catch (error) {
            console.log(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (data) => {
        const { selectedUser, messages } = get()
        const { authUser } = useAuthStore.getState()

        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            recieverId: selectedUser._id,
            text: data.text,
            iamge: data.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        }

        set({ messages: [...messages, optimisticMessage] })

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data)
            set({ messages: messages.concat(res.data) })
        } catch (error) {
            set({ messages: messages })
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
}))