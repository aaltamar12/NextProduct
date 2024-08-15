"use client";
import Image from "next/image";
import LoadingSpinner from "./loadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center gap-5 h-screen bg-[#181A1F] text-[#FFFFFF] lg:text-[27px]">
      <div className="absolute top-0 left-0 w-full h-auto z-50">
        <Image
          src="/colors.png"
          alt="Degradado"
          width={100}
          height={594}
          className="w-full h-auto"
        />
      </div>

      <div className="flex justify-center items-center h-[90px] w-[90px]">
        <LoadingSpinner />
      </div>
      <h2 className="">Estamos validando tus datos</h2>
    </div>
  );
}
