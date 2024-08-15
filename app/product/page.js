"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProductDetails from "@/app/productDetails";
import Loading from "../components/loading";

export default function Product() {
  const [products, setProducts] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user;
    } catch (error) {
      console.error("Error al obtener el token de localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const user = await getUser();
        setUserData(user);

        if (!user?.token) {
          console.error("Token no encontrado en localStorage");
          return;
        }

        const response = await fetch(`/api/product?${Date.now()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col text-center h-full 4k:h-screen bg-[#111317] text-[#CCCCCC] pb-[90px] md:pb-5">
      <div className="flex flex-col items-center">
        <div className="flex justify-center pt-[50px] pb-[61px]">
          <Image
            key={"logo"}
            src="/logo.png"
            alt="logo"
            width={77.6}
            height={24}
          />
        </div>

        <div className="flex flex-col gap-8 px-6 md:px-20">
          <div className="flex justify-between items-center text-left text-xl md:text-[27px] gap-8 md:gap-0">
            <h1>Hola {userData.name}</h1>
          </div>
          {products?.map((product) => {
            return <ProductDetails key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}
