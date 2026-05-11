if (!window.EscStack) {
  const stack = [];

  document.addEventListener(
    'keydown',
    e => {
      if (e.key !== 'Escape') return;
      if (stack.length === 0) return;
      e.stopImmediatePropagation();
      stack[stack.length - 1]();
    },
    true,
  );

  window.EscStack = {
    push(handler) {
      stack.push(handler);
    },
    remove(handler) {
      const idx = stack.indexOf(handler);
      if (idx !== -1) stack.splice(idx, 1);
    },
  };
}

export default window.EscStack;
