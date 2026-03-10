import { create } from 'zustand/react';

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
export const alertStore = create(set => ({
  alertList: [],
  setAlertList(alert) {
    set(state => {
      const timer = setTimeout(() => {}, 0);
      return {
        alertList: [...state.alertList, { id: timer, message: alert }],
      };
    });
  },
  deleteAlert(alert) {
    set(state => {
      return { alertList: state.alertList.filter(a => a.id !== alert) };
    });
  },
}));
