"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

export default function FileBrowser({ setLoadedFiles, setAlert }) {
  const [files, setFiles] = useState([]);
  const [porcentajeCarga, setPorcentajeCarga] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [showLoadedImages, setShowLoadedImages] = useState("");
  const [text, setText] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);

    if (files.length + selected.length > 6) {
      setAlert("Solo puedes cargar hasta 6 archivos", "error");
      return;
    }

    const newFiles = [...files, ...selected];
    e.target.value = "";
    setFiles(newFiles);
    simulateUpload(newFiles);
  };

  const handleRemoveFile = (fileName) => {
    const newFiles = files.filter((file) => file.name !== fileName);
    setFiles(newFiles);
  };

  const simulateUpload = (files) => {
    if (files.length === 0) return;

    setCargando(true);
    setPorcentajeCarga(0);

    let progress = 0;
    const totalFiles = files.length;
    const baseTimeInMs = 50;
    const timeExecution = baseTimeInMs * totalFiles;

    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCargando(false);
          setPorcentajeCarga(0);
        }, 1000);
        return;
      }

      progress += Math.random() * 10;
      progress = Math.min(progress, 100);

      setPorcentajeCarga(progress);
    }, timeExecution);
  };

  useEffect(() => {
    setLoadedFiles && setLoadedFiles(files);
  }, [files]);

  useEffect(() => {
    let styleComponent;

    let text;

    if (!cargando && files.length > 0) {
      styleComponent = fadeIn;

      text = "Imágenes cargadas";
    } else {
      styleComponent = fadeOut;

      text = "Carga hasta 6 imágenes de tu producto";
    }

    const component = (
      <div
        className="text-[#9396a5] text-xs rounded-lg bg-gradient-to-r from-[#00CDDA] via-[#E96DA2] to-[#FCB115] p-[1px]"
        style={styleComponent}
      >
        <div className="rounded-lg bg-[#181A1F] p-4">
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex justify-between items-center"
              >
                <span className="">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="cursor-pointer hover:text-orange-500/50"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    setText(text);
    setShowLoadedImages(component);
  }, [cargando, files]);

  const fadeIn = {
    opacity: 1,
    transition: "opacity 0.4s ease-in",
  };

  const fadeOut = {
    opacity: 0,
    transition: "opacity 0.5s ease-out",
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[#9396A5] text-base md:text-xl">{text}</h1>
      {files.length <= 0 && (
        <div
          className={`md:h-[75px] flex-col justify-start items-start gap-2 inline-flex relative ${
            cargando ? "hidden" : "flex"
          }`}
        >
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept=".jpg, .png, .tiff, .pdf, .zip"
            disabled={cargando || files.length >= 4}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-pink-300"
          />
          <div className="flex w-full p-4 bg-[#272a33] rounded-[11px] border border-[#272a33] items-start cursor-pointer gap-2">
            <div className="flex items-start justify-start">
              <Image
                key={"inbox"}
                src="/direct-inbox.svg"
                alt="direct inbox"
                width={32}
                height={32}
                className="w-14 h-14 md:w-8 md:h-8"
              />
            </div>
            <div className="w-[623px] flex-col justify-center items-start gap-1.5 inline-flex">
              <div className="self-stretch text-white text-sm md:text-base font-medium">
                Haz clic o arrastra los archivos a esta área para cargarlo
              </div>
              <div className="self-stretch text-[#9396a5] text-xs font-normal">
                JPG, PNG, Tiff, hasta 2 mb
              </div>
            </div>
          </div>
        </div>
      )}

      {cargando ? (
        <div
          className={`flex items-center ${
            porcentajeCarga === 100 && "justify-center"
          } text-white text-sm md:text-base md:h-[75px] rounded-[11px] relative bg-transparent overflow-hidden`}
        >
          <div className="px-[18px] z-10">
            {porcentajeCarga !== 100 ? (
              "Cargando documento..."
            ) : (
              <Image
                src="/tick-circle.svg"
                alt="check circle"
                width={24}
                height={24}
                className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]"
              />
            )}
          </div>
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
              porcentajeCarga > 50 ? "from-cyan-400" : "from-rose-400"
            } ${
              porcentajeCarga > 50 ? "via-rose-400" : "via-orange-400"
            } to-orange-400`}
            style={{ width: `${porcentajeCarga}%` }}
          />
        </div>
      ) : (
        ""
      )}
      {!cargando && files.length > 0 && showLoadedImages}
    </div>
  );
}
