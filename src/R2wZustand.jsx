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

let toastSeq = 0;
// content = string | { title, message }
const pushToast = (content, type) => {
  toastSeq += 1;
  const id = `${Date.now()}-${toastSeq}`;
  useNotifyStore.setState(store => ({ toastList: [...store.toastList, { id, content, type }] }));
};

// 컨펌을 띄우고, 닫힐 때 resolve 되는 Promise를 돌려준다.
const openConfirm = (confirm, toResult = v => v) => {
  useNotifyStore.setState(() => ({ confirm }));
  return new Promise(res => {
    useNotifyStore.setState(prev => ({ ...prev, responseHandler: v => res(toResult(v)) }));
  });
};

export const CLM = {
  alert: (content, type = 'info') => pushToast(content, type),
  // message = string | { title, message, detail }
  // 닫힐 때 resolve (값 없음) → await CLM.alertError(...) 가 실제로 기다린다.
  alertError: message => {
    const base = typeof message === 'string' ? { message } : message;
    return openConfirm({ ...base, type: 'error', buttons: ['확인'] }, () => undefined);
  },
  alertInfo: content => pushToast(content, 'info'),
  alertSuccess: content => pushToast(content, 'success'),
  // message = string | { title, message, detail, buttons, type: 'danger' }
  // 문자열만 넘기면 그 문장이 제목 자리에 들어간다.
  confirm: message => openConfirm(typeof message === 'string' ? { title: message } : message),
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
