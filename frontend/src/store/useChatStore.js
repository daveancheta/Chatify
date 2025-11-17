import React from 'react'
import { create } from "zustand"
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chat: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,


    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set("isSoundEnabled", !get().isSoundEnabled)
    },

    setActiveTAb: (tab) => set({ activeTab: tab }),
    setSelectUser: (selectUser) => set({ selectUser }),

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
            set({ allContacts: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    }
}))