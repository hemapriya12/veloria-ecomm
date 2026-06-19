"use client";

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
}

export default function TableCheckbox({ checked, indeterminate, onChange }: Props) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => { if (el) el.indeterminate = !!indeterminate; }}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-emerald-500 accent-emerald-500 cursor-pointer"
    />
  );
}
