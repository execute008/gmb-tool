const COLORS = {
  primary: { bg: '#1a73e8', text: '#ffffff' },
  secondary: { bg: '#e8eaed', text: '#3c4043' },
};

/**
 * Create a clickable category pill element.
 * Primary pills are blue, secondary pills are gray.
 */
export function createCategoryPill(
  category: string,
  type: 'primary' | 'secondary',
  onClick: (category: string) => void
): HTMLElement {
  const pill = document.createElement('span');
  const colors = COLORS[type];

  pill.textContent = category;

  Object.assign(pill.style, {
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '4px',
    cursor: 'pointer',
    fontFamily: '"Google Sans", system-ui, sans-serif',
    display: 'inline-block',
    lineHeight: '18px',
    verticalAlign: 'middle',
  });

  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick(category);
  });

  // Hover effect
  pill.addEventListener('mouseenter', () => {
    pill.style.opacity = '0.85';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.opacity = '1';
  });

  return pill;
}
