"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductForm from "./productForm";
import Loading from "./loading";
import Alert from "./alert";
import UserForm from "./userForm";

export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDataSent, setIsDataSent] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertComponent, setAlertComponent] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    files: [],
  });

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const requiredAttributes = ["name", "description", "price"];

    const requiredValidation = requiredAttributes.every((attr) => {
      const field = productData[attr];
      const validate =
        field !== null && field !== undefined && field.trim() !== "";
      return validate;
    });

    if (!requiredValidation) {
      showAlert("Por favor llene los campos obligatorios", "error");
      return requiredValidation;
    }

    return true;
  };

  const saveUser = (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleUploadFiles = async () => {
    const { files } = productData;
    if (files.length === 0) return;

    try {
      let filesUrl = [];
      for (const file of files) {
        const signature = await fetch(
          `${process.env.NEXT_FRONTEND_URL}/api/upload`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contentType: file.type }),
          }
        );

        if (signature.ok) {
          const { url, fields } = await signature.json();
          const fileUrl = `${url}${fields.key}`;

          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append("file", file);

          const uploadResponse = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.error("S3 Upload Error:", uploadResponse);
          }

          filesUrl.push(fileUrl);
        } else {
          showAlert("Error al subir los archivos", "error");
          return;
        }
      }

      return filesUrl;
    } catch (error) {
      console.error("Error uploading files:", error);
      showAlert("Error al subir los archivos", "error");
      return { error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;

      setLoading(true);

      const urlFiles = await handleUploadFiles();

      if (urlFiles && urlFiles.error) {
        return showAlert("Error al subir imagenes", "error");
      }

      const product = urlFiles?.error
        ? productData
        : { ...productData, images: urlFiles };

      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, userData }),
      });

      if (!response.ok || response.status === 401) {
        showAlert("Error al crear el producto", "error");
        console.log(
          "ERROR AL CREAR",
          !response.ok,
          response.status,
          response.status === 401
        );
        const { error } = await response.json();

        throw new Error(error);
      }

      const { data, status, userLogged } = await response.json();

      saveUser(userLogged);
      setIsDataSent(true);
      const redirectUrl =
        status === 201 ? `/product/${data.id}?saved=true` : "/404";
      router.push(redirectUrl);
    } catch (error) {
      setProductData({
        name: "",
        description: "",
        price: "",
        files: [],
      });
      showAlert(`Error ${error.message}`, "error");
      console.error("Error al guardar:", error.message);
    }
  };

  const handleOnChangeProduct = (value, name) => {
    setProductData({ ...productData, [name]: value });
  };

  const handleOnChangeUser = (value, name) => {
    setUserData({ ...userData, [name]: value });
  };

  const showAlert = (message, type) => {
    setErrorAlert(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    const renderAlert = () => {
      return (
        <Alert
          message={alertMessage}
          type={errorAlert}
          isLoading={loading}
          isVisible={alertVisible}
          onClose={handleCloseAlert}
        />
      );
    };
    setAlertComponent(renderAlert());
  }, [alertVisible, alertMessage, errorAlert, loading]);

  useEffect(() => {
    !isDataSent &&
      setTimeout(() => {
        setLoading(false);
      }, 3000);
  }, [loading, isDataSent, productData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center text-center h-full 2xl:h-full 4k:h-screen w-full bg-[#111317] text-[#CCCCCC]">
      {alertComponent}

      <div className="flex flex-col items-center">
        <div className="flex justify-center pt-[50px] pb-[71px]">
          <Image
            key={"logo"}
            src="/logo.png"
            alt="logo remoti"
            width={77.6}
            height={24}
          />
        </div>

        <div className="flex flex-col gap-8 px-6 md:px-[372px]">
          <div className="flex flex-col md:flex-row gap-10 4k:gap-20 w-[350px] md:w-[695px] items-center justify-center">
            <div className="flex flex-col pb-[69px] gap-5 w-full">
              <ProductForm
                key={"information"}
                label={"Crear Producto"}
                setAlert={showAlert}
                onChange={handleOnChangeProduct}
              />

              <UserForm
                key={"login"}
                label={"Login"}
                setAlert={showAlert}
                onChange={handleOnChangeUser}
              />

              <button
                type="button"
                className="h-14 w-full px-5 py-2.5 bg-[#fcb115] hover:bg-[#E7A724] rounded-xl text-center font-bold text-[#111217]"
                onClick={(e) => handleSubmit(e)}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
