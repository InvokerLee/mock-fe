export default {
  bind(el) {
    const target = el instanceof HTMLInputElement ? el : el.querySelector('input');
    target.addEventListener('keyup', (e) => {
      if (!/^\d*$/.test(e.target.value)) {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
        e.target.dispatchEvent(new Event('input'));
      }
    });
  },
};
