"use client";

import FormField from "./formField";
import InputField from "./inputField";

const formatPrice = (priceString) => {
  const price = parseFloat(priceString);

  let priceFormatted = price.toFixed(0); // Eliminar decimales
  priceFormatted = priceFormatted.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return priceFormatted;
};

export default function UserDetailsForm({
  label,
  productData,
  editMode,
  onChange,
  onSave,
}) {
  const dataComponent = (
    <>
      <FormField label={"Nombre"} value={productData.name} />
      <FormField label={"Descripcion"} value={productData.description} />
      <FormField
        label={"Precio"}
        value={"$ " + formatPrice(productData.price)}
      />
    </>
  );

  const formComponent = (
    <>
      <InputField
        label={"Nombre"}
        initialValue={productData.name}
        onChange={(value) => {
          onChange(value, "name");
        }}
      />
      <InputField
        label={"Descripcion"}
        initialValue={productData.description}
        onChange={(value) => {
          onChange(value, "description");
        }}
      />
      <InputField
        label={"Precio"}
        type={"number"}
        initialValue={formatPrice(productData.price)}
        onChange={(value) => {
          onChange(value, "price");
        }}
      />
      <button
        type="button"
        className="h-14 w-full px-5 py-2.5 bg-[#fcb115] hover:bg-[#E7A724] rounded-xl text-center font-bold text-[#111217]"
        onClick={() => onSave()}
      >
        Guardar
      </button>
    </>
  );
  const renderComponent = (
    <div className="rounded-2xl bg-[#181A1F] w-full h-auto">
      <div className="flex flex-col py-6 px-4 text-left text-xl gap-6">
        <h1 className="text-[#9396A5] text-xl">{label}</h1>
        {!editMode ? dataComponent : formComponent}
      </div>
    </div>
  );

  return renderComponent;
}
