import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
      const id = uuidv4();
      console.log(state);
      console.log(alert);
      return {
        alertList: [...state.alertList, { id, message: alert }],
      };
    });
  },
  deleteAlert(alert) {
    set(state => {
      return { alertList: state.alertList.filter(a => a.id !== alert) };
    });
  },
}));
