import { create } from "zustand";

//管理侧边栏的搜索弹窗
type SearchStore = {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
};
export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  openSearch: () => {
    set({ isOpen: true });
  },
  closeSearch: () => set({ isOpen: false }),
  toggleSearch: () => set({ isOpen: !get().isOpen }),
}));

//管理上传图片的弹窗
type coverImageStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};
export const useCoverImage = create<coverImageStore>((set, get) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
  },
  onClose: () => {
    set({ isOpen: false });
  },
}));
