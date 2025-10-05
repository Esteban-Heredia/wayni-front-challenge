"use client";
import { useState } from "react";

function FileSmall({ title, endpoint, SERVER, step }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor selecciona un archivo");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${SERVER}/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Archivo enviado correctamente ✅");
        setInfo(`Paso ${step} de 3 Completado`);
      } else {
        const text = await res.text();
        setMessage(`Error al enviar: ${text}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center font-bold text-lg">
          En este input file vamos a cargar los archivos de {title}
        </h3>
        {info && <h4>{info}</h4>}
      </div>

      <div className="flex flex-row items-center justify-between mt-3">
        <div className="m-2 flex flex-row items-center">
          <input type="file" onChange={handleFileChange} className="border border-gray-300 rounded py-2 px-4"/>
          <button
            onClick={handleUpload}
            className="bg-white hover:bg-red-600 text-black font-bold py-2 px-4 rounded mx-2"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
        <div>{message}</div>
      </div>
    </div>
  );
}

export default FileSmall;
