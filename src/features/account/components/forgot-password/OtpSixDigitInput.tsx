import React, { useRef } from 'react';

interface OtpSixDigitInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
}

export const OtpSixDigitInput: React.FC<OtpSixDigitInputProps> = ({
  digits,
  onChange,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasted code
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      onChange(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    onChange(newDigits);

    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3 dir-ltr" dir="ltr">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleDigitChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-zinc-900 border border-zinc-700 text-amber-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all rounded disabled:opacity-50"
        />
      ))}
    </div>
  );
};
