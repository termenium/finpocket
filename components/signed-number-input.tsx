'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface SignedNumberInputProps {
  id?: string;
  /** Current numeric value from parent state */
  value: number;
  /** Called with the parsed number when the user commits (blur/Enter) */
  onValueChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A text-based numeric input that supports negative numbers and natural typing:
 * - The user can type "-", clear the field, or enter partial values without the
 *   state snapping to 0 mid-edit (critical for XIRR cash flows).
 * - Parses on blur/Enter and calls onValueChange; invalid input falls back to 0.
 */
export function SignedNumberInput({
  id,
  value,
  onValueChange,
  placeholder,
  className,
}: SignedNumberInputProps) {
  const [text, setText] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync external changes into the input while not being edited
  useEffect(() => {
    if (!isFocused) {
      setText(String(value));
    }
  }, [value, isFocused]);

  const commit = () => {
    const parsed = parseFloat(text);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    setText(String(safe));
    if (safe !== value) {
      onValueChange(safe);
    }
  };

  return (
    <Input
      id={id}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        commit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      placeholder={placeholder}
      className={className}
    />
  );
}
