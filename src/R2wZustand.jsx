import create from 'zustand';

export const useStore = create(set => ({
  showComp: false,
  setVisibility() {
    set(state => ({
      visibility: !state.visibility,
    }));
  },
  progressNow: 0,
  showDbOption: false,
  setShowDbOption() {
    set(state => ({
      showDbOption: !state.showDbOption,
    }));
  },
}));
