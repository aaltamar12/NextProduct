"use client";

export default function FormField({ label, value }) {
  return (
    <div className="w-full h-16 pl-4 pt-3 pb-3.5 rounded-xl border border-[#272a33] flex-col justify-center items-start gap-1 inline-flex">
      <div className="text-[#9396a5] text-sm font-normal">{label}</div>
      <div className="text-white text-base font-normal">{value}</div>
    </div>
  );
}
