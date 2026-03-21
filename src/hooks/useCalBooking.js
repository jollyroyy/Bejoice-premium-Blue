// hooks/useCalBooking.js
// Cal.com is fully initialised in index.html — this hook just exposes openCalPopup()
export function useCalBooking() {
  const openCalPopup = () => {
    if (window.__openCal) window.__openCal();
  };
  return { openCalPopup };
}
