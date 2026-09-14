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
// ─── CLM Notify (토스트 + 컨펌) ──────────────────────────────
// 렌더러는 components/Notify/ToastNotify.jsx. 앱에 <ToastNotify/>를 한 번 렌더한다.
export const useNotifyStore = create(() => ({
  toastList: [],
  confirm: '',
  responseHandler: false,
}));

export const CLM = {
  alert: (content, type = 'info') =>
    useNotifyStore.setState(store => ({
      toastList: [...store.toastList, { id: Date.now(), content, type }],
    })),
  alertError: message => {
    const type = { type: 'error', buttons: ['닫기'] };
    useNotifyStore.setState(() => ({
      confirm: typeof message === 'string' ? { message, ...type } : { ...message, ...type },
    }));
  },
  alertInfo: content =>
    useNotifyStore.setState(store => ({
      toastList: [...store.toastList, { id: Date.now(), content, type: 'info' }],
    })),
  alertSuccess: content =>
    useNotifyStore.setState(store => ({
      toastList: [...store.toastList, { id: Date.now(), content, type: 'success' }],
    })),
  confirm: message => {
    // message = string | { title, message, buttons }
    useNotifyStore.setState(() => ({
      confirm: typeof message === 'string' ? { message } : message,
    }));
    return new Promise(res => {
      useNotifyStore.setState(prev => ({ ...prev, responseHandler: res }));
    });
  },
};

export const deleteAlert = id =>
  useNotifyStore.setState(store => ({ toastList: store.toastList.filter(tl => tl.id !== id) }));

export const deleteConfirm = () =>
  useNotifyStore.setState(() => ({ confirm: '', responseHandler: false }));

export const resetNotifyStore = () => {
  useNotifyStore.setState(() => ({ toastList: [], confirm: '', responseHandler: false }));
};

export const cancelConfirm = () => {
  const { responseHandler } = useNotifyStore.getState();
  if (responseHandler) responseHandler(false);
  deleteConfirm();
};
