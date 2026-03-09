/**
 * Create the floating scan trigger button for search results pages.
 * Positioned fixed in the bottom-right corner.
 */
export function createScanButton(onClick: () => void): HTMLElement {
  const btn = document.createElement('button');
  btn.setAttribute('data-gmb-scan-button', '');
  btn.textContent = '📊 Scan';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '24px',
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    cursor: 'pointer',
    zIndex: '9999',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    fontFamily: '"Google Sans", system-ui, sans-serif',
  });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return btn;
}
