interface FieldRow {
  label: string;
  value: string | null;
}

/**
 * Create a collapsible audit section with title, field rows, and copy button.
 */
export function createAuditSection(
  title: string,
  fields: FieldRow[],
  onCopySection: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.style.marginBottom = '8px';

  // Header
  const header = document.createElement('div');
  header.setAttribute('data-section-header', '');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    borderRadius: '4px',
    userSelect: 'none',
  });

  const titleEl = document.createElement('span');
  titleEl.textContent = `▼ ${title}`;
  Object.assign(titleEl.style, {
    fontWeight: '600',
    fontSize: '13px',
    color: '#202124',
  });

  const copyBtn = document.createElement('button');
  copyBtn.setAttribute('data-copy-section', '');
  copyBtn.textContent = '📋';
  Object.assign(copyBtn.style, {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '2px 4px',
  });
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onCopySection();
  });

  header.appendChild(titleEl);
  header.appendChild(copyBtn);

  // Content
  const content = document.createElement('div');
  content.setAttribute('data-section-content', '');
  content.style.padding = '4px 12px';

  const visibleFields = fields.filter((f) => f.value !== null && f.value !== '');
  for (const { label, value } of visibleFields) {
    const row = document.createElement('div');
    Object.assign(row.style, {
      display: 'flex',
      padding: '4px 0',
      fontSize: '12px',
      borderBottom: '1px solid #f0f0f0',
    });

    const labelEl = document.createElement('span');
    labelEl.textContent = `${label}:`;
    Object.assign(labelEl.style, {
      color: '#5f6368',
      minWidth: '90px',
      flexShrink: '0',
    });

    const valueEl = document.createElement('span');
    valueEl.textContent = value!;
    Object.assign(valueEl.style, {
      color: '#202124',
      wordBreak: 'break-all',
    });

    row.appendChild(labelEl);
    row.appendChild(valueEl);
    content.appendChild(row);
  }

  // Toggle collapse
  let collapsed = false;
  header.addEventListener('click', () => {
    collapsed = !collapsed;
    content.style.display = collapsed ? 'none' : 'block';
    titleEl.textContent = `${collapsed ? '▶' : '▼'} ${title}`;
  });

  container.appendChild(header);
  container.appendChild(content);
  return container;
}
