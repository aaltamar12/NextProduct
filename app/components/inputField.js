"use client";

import { useState } from "react";

export default function InputField({
  label,
  noLimit,
  type,
  placeholder,
  initialValue,
  onChange,
}) {
  const [value, setValue] = useState(initialValue || "");

  const handleInputChange = (e) => {
    let validatedValue = e.target.value;

    if (!noLimit) {
      validatedValue =
        type === "tel"
          ? validatedValue.slice(0, 10)
          : validatedValue.slice(0, 30);
    }

    if (type === "email") {
      validatedValue = validatedValue.replace(/ /g, "");
    }
    setValue(validatedValue);
    onChange(validatedValue);
  };

  return (
    <div className="w-full h-16 px-4 pt-3 pb-3.5 rounded-xl bg-[#272a33] border border-[#272a33] flex-col justify-center items-start gap-1 inline-flex">
      <div className="text-[#9396a5] text-xs md:text-sm font-normal">
        {label}
      </div>
      <input
        type={type || "text"}
        value={value}
        onChange={handleInputChange}
        className="w-full bg-transparent text-white text-sm md:text-base font-normal outline-none"
        placeholder={placeholder || ""}
      />
    </div>
  );
}
