import { create } from 'zustand';

export type ModalName = 'cartDrawer' | 'clearCartConfirm' | 'customizeItem' | null;

export interface UiState {
  isMobileNavOpen: boolean;
  activeModal: ModalName;
  isGlobalLoading: boolean;
}

export interface UiActions {
  toggleMobileNav: (open?: boolean) => void;
  openModal: (modal: Exclude<ModalName, null>) => void;
  closeModal: () => void;
  setGlobalLoading: (isLoading: boolean) => void;
}

/**
 * Zustand UI store (Section 4.1 / 15.3). Deliberately NOT persisted —
 * modal/sidebar state should always reset to closed on a fresh page load.
 */
export const useUiStore = create<UiState & UiActions>((set) => ({
  isMobileNavOpen: false,
  activeModal: null,
  isGlobalLoading: false,

  toggleMobileNav: (open) => {
    set((state) => ({ isMobileNavOpen: open ?? !state.isMobileNavOpen }));
  },

  openModal: (modal) => {
    set({ activeModal: modal });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  setGlobalLoading: (isGlobalLoading) => {
    set({ isGlobalLoading });
  },
}));
