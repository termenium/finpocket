'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface ClampedNumberInputProps {
  id?: string;
  /** Current numeric value from parent state (also updated by sliders) */
  value: number;
  /** Called with a clamped valid number whenever the committed value changes */
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: string;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * A number input that supports natural typing:
 * - The user can clear the field or type partial values ("1", "15") while focused
 *   without the value instantly snapping to min/max.
 * - On blur (or Enter), the value is parsed and clamped to [min, max], then committed.
 * - External updates (e.g. from a slider) sync into the field.
 */
export function ClampedNumberInput({
  id,
  value,
  onValueChange,
  min,
  max,
  step,
  placeholder,
  className,
  'aria-label': ariaLabel,
}: ClampedNumberInputProps) {
  const [text, setText] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync external changes (sliders, reset) into the input while not being edited
  useEffect(() => {
    if (!isFocused) {
      setText(String(value));
    }
  }, [value, isFocused]);

  const commit = () => {
    const parsed = parseFloat(text);
    const clamped = Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : min;
    setText(String(clamped));
    if (clamped !== value) {
      onValueChange(clamped);
    }
  };

  return (
    <Input
      id={id}
      type="number"
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
      min={min}
      max={max}
      step={step}
      className={className}
      aria-label={ariaLabel}
    />
  );
}
