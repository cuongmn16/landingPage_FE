import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom multiline dropdown replacement for native <select> so long options
 * wrap onto multiple lines both in the open menu and when selected.
 */
export default function WrapSelect({
  id,
  className = '',
  value = '',
  disabled = false,
  onChange,
  children
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const options = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const optVal = child.props.value !== undefined ? String(child.props.value) : '';
    const optDisabled = !!child.props.disabled;
    const label = child.props.children;
    options.push({ value: optVal, disabled: optDisabled, label });
  });

  const strValue = value !== undefined && value !== null ? String(value) : '';
  const selectedOpt = options.find((o) => o.value === strValue) || options[0] || { value: '', label: '' };
  const isPlaceholder = strValue === '';

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handleSelect(opt) {
    if (opt.disabled) return;
    setOpen(false);
    if (onChange) {
      onChange({ target: { value: opt.value } });
    }
  }

  return (
    <div
      ref={rootRef}
      className={`wrap-select ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim()}
    >
      <button
        id={id}
        type="button"
        className={`wrap-select__trigger ${isPlaceholder ? 'is-placeholder' : ''}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className="wrap-select__text">{selectedOpt.label}</span>
        <span className="wrap-select__arrow" aria-hidden="true">▾</span>
      </button>

      {open && !disabled && (
        <div className="wrap-select__menu" role="listbox">
          {options.map((opt, idx) => {
            const isSelected = opt.value === strValue;
            return (
              <button
                key={`${opt.value}-${idx}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                className={`wrap-select__option ${isSelected ? 'is-selected' : ''} ${opt.value === '' ? 'is-placeholder-opt' : ''} ${opt.disabled ? 'is-opt-disabled' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

