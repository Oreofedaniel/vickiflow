import { useEffect, useRef, useState } from 'react';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

function setInputValue(input, value) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function getFocusedInput(container) {
  const active = document.activeElement;
  if (active && active.tagName === 'INPUT' && container?.contains(active)) return active;
  return null;
}

// Falls back to the screen's own text input if focus didn't land there (e.g. autoFocus
// got dropped after a programmatic screen transition), so typing always goes somewhere sensible.
function resolveActiveInput(container) {
  const focused = getFocusedInput(container);
  if (focused) return focused;
  const candidate = container?.querySelector('input');
  if (candidate) {
    candidate.focus();
    return candidate;
  }
  return null;
}

export default function UssdPhoneFrame({ onEmergency, onEnd, children }) {
  const screenRef = useRef(null);
  const [buffer, setBuffer] = useState('');
  const [keypadError, setKeypadError] = useState('');
  const [typingInField, setTypingInField] = useState(false);

  // Re-check on every screen change — relying on blur alone can leave this stale
  // when the focused input unmounts as part of a screen transition (e.g. the 999 shortcut).
  useEffect(() => {
    setTypingInField(!!getFocusedInput(screenRef.current));
    setBuffer('');
    setKeypadError('');
  }, [children]);

  const pressKey = (k) => {
    setKeypadError('');
    const input = resolveActiveInput(screenRef.current);
    if (input) {
      setInputValue(input, input.value + k);
      return;
    }
    setBuffer((b) => b + k);
  };

  const backspace = () => {
    setKeypadError('');
    const input = resolveActiveInput(screenRef.current);
    if (input) {
      setInputValue(input, input.value.slice(0, -1));
      return;
    }
    setBuffer((b) => b.slice(0, -1));
  };

  const send = () => {
    const input = resolveActiveInput(screenRef.current);
    const typed = input ? input.value : buffer;

    if (typed === '999' || typed === '911') {
      if (input) setInputValue(input, '');
      setBuffer('');
      setKeypadError('');
      onEmergency();
      return;
    }

    if (input) {
      screenRef.current.querySelector('[data-key="send"]')?.click();
      return;
    }
    if (!buffer) return;
    const target = screenRef.current?.querySelector(`[data-key="${buffer}"]`);
    if (target) {
      target.click();
      setBuffer('');
      setKeypadError('');
    } else {
      setKeypadError('Invalid option');
    }
  };

  return (
    <div className="ussd-phone">
      <div className="ussd-phone-header">
        <span className="ussd-dial">*384*8425#</span>
        <button className="ussd-emergency-btn" onClick={onEmergency} title="Emergency shortcut — works from any screen">
          🚨 999
        </button>
      </div>
      <div
        className="ussd-phone-screen"
        ref={screenRef}
        onFocus={() => setTypingInField(!!getFocusedInput(screenRef.current))}
        onBlur={() => setTypingInField(false)}
      >
        {children}
      </div>
      <div className="ussd-keypad-buffer">
        {typingInField ? 'Typing in field above ⌨' : buffer ? `> ${buffer}` : ' '}
      </div>
      {keypadError && <div className="ussd-inline-error">{keypadError}</div>}
      <div className="ussd-keypad">
        {KEYS.map((k) => (
          <button key={k} className="ussd-key" onMouseDown={(e) => e.preventDefault()} onClick={() => pressKey(k)}>{k}</button>
        ))}
      </div>
      <div className="ussd-keypad-controls">
        <button className="ussd-key-ok" onMouseDown={(e) => e.preventDefault()} onClick={send}>OK / Send</button>
        <button className="ussd-key-back" onMouseDown={(e) => e.preventDefault()} onClick={backspace}>⌫</button>
        <button className="ussd-key-end" onMouseDown={(e) => e.preventDefault()} onClick={onEnd}>End</button>
      </div>
    </div>
  );
}
