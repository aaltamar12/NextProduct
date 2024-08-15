"use client";

import InputField from "./inputField";
import FileBrowser from "./fileBrowser";

export default function ProductForm({ label, setAlert, onChange }) {
  return (
    <div className="rounded-2xl bg-[#181A1F] w-full">
      <div className="flex flex-col py-6 px-4 text-left text-xl gap-6">
        <h1 className="text-[#9396A5] text-base md:text-xl">{label}</h1>

        <InputField
          label={"Nombre del Producto"}
          placeholder={"Nombre"}
          onChange={(value) => {
            onChange(value, "name");
          }}
        />

        <InputField
          label={"Descripcion"}
          placeholder={"Descripcion corta"}
          onChange={(value) => {
            onChange(value, "description");
          }}
        />

        <InputField
          label={"Precio"}
          type={"number"}
          placeholder={"Precio"}
          onChange={(value) => {
            onChange(value, "price");
          }}
        />

        <FileBrowser
          setAlert={setAlert}
          setLoadedFiles={(value) => {
            onChange(value, "files");
          }}
        />
      </div>
    </div>
  );
}
