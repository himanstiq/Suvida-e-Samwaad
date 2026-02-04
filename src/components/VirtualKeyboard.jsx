import { useState } from 'react'
import { Delete, CornerDownLeft, Space } from 'lucide-react'

// VirtualKeyboard - Premium On-screen keyboard with glassmorphism
export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onEnter,
  layout = 'numeric' // 'numeric' | 'qwerty'
}) {
  const [capsLock, setCapsLock] = useState(false)
  const [pressedKey, setPressedKey] = useState(null)

  const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'backspace']
  ]

  const qwertyKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['caps', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['@', 'space', '.', 'enter']
  ]

  const handleKeyClick = (key) => {
    // Visual feedback
    setPressedKey(key)
    setTimeout(() => setPressedKey(null), 150)

    if (key === 'backspace') {
      onBackspace?.()
    } else if (key === 'enter') {
      onEnter?.()
    } else if (key === 'caps') {
      setCapsLock(!capsLock)
    } else if (key === 'space') {
      onKeyPress?.(' ')
    } else if (key) {
      onKeyPress?.(capsLock ? key.toUpperCase() : key)
    }
  }

  const keys = layout === 'numeric' ? numericKeys : qwertyKeys

  return (
    <div className="virtual-keyboard">
      <div className={`keyboard-container ${layout}`}>
        {keys.map((row, rowIdx) => (
          <div key={rowIdx} className="keyboard-row">
            {row.map((key, keyIdx) => {
              if (!key) return <div key={keyIdx} className="key-spacer" />

              const isSpecial = ['backspace', 'enter', 'caps', 'space'].includes(key)
              const isActive = key === 'caps' && capsLock
              const isPressed = pressedKey === key

              return (
                <button
                  key={keyIdx}
                  className={`keyboard-key ${isSpecial ? 'special-key' : ''} ${isActive ? 'active' : ''} ${key === 'space' ? 'space-key' : ''} ${isPressed ? 'pressed' : ''}`}
                  onClick={() => handleKeyClick(key)}
                  type="button"
                >
                  {key === 'backspace' ? <Delete size={20} /> :
                    key === 'enter' ? <CornerDownLeft size={20} /> :
                      key === 'space' ? <Space size={20} /> :
                        key === 'caps' ? 'ABC' :
                          capsLock ? key.toUpperCase() : key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <style>{keyboardStyles}</style>
    </div>
  )
}

const keyboardStyles = `
  .virtual-keyboard {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 1.25rem;
    border-radius: var(--radius-2xl);
    margin-top: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 
      0 4px 24px rgba(28, 37, 65, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .keyboard-container {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 0.625rem;
  }

  .keyboard-key {
    min-width: 52px;
    height: 52px;
    padding: 0 1rem;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(28, 37, 65, 0.08);
    border-radius: var(--radius-lg);
    font-size: 1.35rem;
    font-weight: 500;
    font-family: var(--font-mono);
    color: var(--navy);
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 2px 4px rgba(28, 37, 65, 0.04),
      0 1px 2px rgba(28, 37, 65, 0.02);
  }

  .keyboard-key:hover {
    background: var(--peach);
    border-color: var(--coral-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 111, 81, 0.15);
  }

  .keyboard-key:active,
  .keyboard-key.pressed {
    transform: scale(0.94);
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 1px 2px rgba(28, 37, 65, 0.1);
  }

  .special-key {
    background: rgba(237, 231, 224, 0.9);
    color: var(--gray-600);
    min-width: 68px;
    font-family: var(--font-body);
    font-size: 0.9rem;
  }

  .special-key:hover {
    background: var(--coral);
    color: white;
  }

  .special-key.active {
    background: linear-gradient(135deg, var(--coral-deep) 0%, var(--coral) 100%);
    color: white;
  }

  .space-key {
    flex: 1;
    max-width: 200px;
  }

  .key-spacer {
    min-width: 52px;
  }

  /* Numeric Layout */
  .keyboard-container.numeric .keyboard-key {
    min-width: 72px;
    height: 60px;
    font-size: 1.5rem;
  }

  .keyboard-container.numeric .keyboard-row {
    justify-content: center;
  }

  /* QWERTY Layout */
  .keyboard-container.qwerty .keyboard-key {
    min-width: 42px;
    height: 46px;
    font-size: 1rem;
    padding: 0 0.5rem;
  }

  @media (min-width: 768px) {
    .keyboard-container.qwerty .keyboard-key {
      min-width: 50px;
      height: 50px;
      font-size: 1.1rem;
    }
  }

  /* Key press animation */
  @keyframes keyPop {
    0% { transform: scale(1); }
    50% { transform: scale(0.92); }
    100% { transform: scale(1); }
  }

  .keyboard-key.pressed {
    animation: keyPop 0.15s ease-out;
  }
`
