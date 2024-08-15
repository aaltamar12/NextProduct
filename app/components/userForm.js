"use client";

import InputField from "./inputField";

export default function UserForm({ label, onChange }) {
  return (
    <div className="rounded-2xl bg-[#181A1F] w-full">
      <div className="flex flex-col py-6 px-4 text-left text-xl gap-6">
        <h1 className="text-[#9396A5] text-base md:text-xl">{label}</h1>

        <InputField
          label={"Email"}
          type={"email"}
          placeholder={"Email"}
          onChange={(value) => {
            onChange(value, "email");
          }}
        />

        <InputField
          label={"Contraseña"}
          type={"password"}
          placeholder={"Contraseña"}
          onChange={(value) => {
            onChange(value, "password");
          }}
        />
      </div>
    </div>
  );
}
