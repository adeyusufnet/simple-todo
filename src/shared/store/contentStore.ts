import { create } from 'zustand'
import type { contentStore } from '../interfaces/contentStore'

const useContentStore = create<contentStore>((set) => ({
    title: "latihan",
    name: "Ade",
    updateTitle: (params: any) => set(() => ({ title: params }))
}))

export { useContentStore }