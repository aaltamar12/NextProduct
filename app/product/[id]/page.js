"use client";
import { useEffect, useState } from "react";
import ProductDetails from "@/app/productDetails";
import Loading from "@/app/components/loading";
import Image from "next/image";
import Alert from "@/app/components/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { RiCloseFill, RiDeleteBinLine, RiEditBoxLine } from "react-icons/ri";

export default function Home({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved") === "true";

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(saved || false);

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user;
    } catch (error) {
      console.error("Error al obtener el token de localStorage:", error);
      return null;
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const resetProduct = () => {
    setProduct({
      id: product?.id,
      name: product?.name,
      description: product?.description,
      price: product?.price,
      images: product?.images,
    });
  };

  const toggleEditMode = () => {
    setEditMode((editMode) => !editMode);
  };

  const handleOnChangeProduct = (value, name) => {
    setProduct({ ...product, [name]: value });
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/product/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, userData }),
      });

      if (!response.ok) return;

      const { product: updatedProduct } = await response.json();

      setProduct({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        images: updatedProduct.images,
      });

      toggleEditMode();
    } catch (error) {
      resetProduct();
      console.error("Error al guardar:", error.message);
    }
  };

  const handleDeleteProduct = async () => {
    const { token } = getUser();

    if (token) {
      const response = await fetch(
        `/api/product/${product.id}/?${Date.now()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) return;

      router.push("/");
    }
  };

  useEffect(() => {
    resetProduct();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const user = await getUser();
        setUserData(user);

        if (!user?.token) {
          console.error("Token no encontrado en localStorage");
          return;
        }

        const response = await fetch(`/api/product/${id}/?${Date.now()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ token: user.token }),
        });

        if (response.status === 404) {
          router.push("/404");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
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

  if (!product) {
    return router.push("/404");
  }

  return (
    <div className="flex flex-col text-center h-full 2xl:h-screen 4k:h-screen bg-[#111317] text-[#CCCCCC] pb-[90px] md:pb-0">
      <Alert
        message="¡Perfil creado exitosamente!"
        isLoading={loading}
        isVisible={alertVisible}
        onClose={handleCloseAlert}
      />
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

            <div className="flex flex-row gap-5">
              <div
                className={`flex items-center gap-1 ${
                  !editMode ? "hover:text-green-500" : "hover:text-gray-400"
                } hover:cursor-pointer`}
                onClick={() => {
                  toggleEditMode();
                  resetProduct();
                }}
              >
                {editMode ? <RiCloseFill /> : <RiEditBoxLine />}
                <h1 className="text-lg">Editar</h1>
              </div>

              <div
                className="flex items-center gap-1 hover:text-red-800 hover:cursor-pointer"
                onClick={handleDeleteProduct}
              >
                <RiDeleteBinLine />
                <h1 className="text-lg">Eliminar</h1>
              </div>
            </div>
          </div>
          <ProductDetails
            product={product}
            editMode={editMode}
            handleOnChangeProduct={handleOnChangeProduct}
            handleSaveProduct={handleSaveProduct}
          />
        </div>
      </div>
    </div>
  );
}
