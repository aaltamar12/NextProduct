"use client";
import Gallery from "./components/gallery";
import ProductDetailsForm from "./components/productDetailsForm";

export default function ProductDetails({
  product,
  editMode,
  handleOnChangeProduct,
  handleSaveProduct,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-10 4k:gap-20">
      <Gallery images={product.images} />

      <div className="flex flex-col gap-5 w-full 2xl:w-[620px] 4k:w-[920px]">
        <ProductDetailsForm
          key={`information-${product.id}`}
          label={!editMode ? "Información del producto" : "Editar producto"}
          productData={product}
          editMode={editMode}
          onChange={handleOnChangeProduct}
          onSave={handleSaveProduct}
        />
      </div>
    </div>
  );
}
