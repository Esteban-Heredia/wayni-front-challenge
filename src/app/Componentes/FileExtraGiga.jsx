"use client";
import { useState } from "react";
import axios from "axios";

export default function FileChunkUploader({ SERVER, endpoint }) {
  const [file, setFile] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [progress, setProgress] = useState("");
  const [currentPart, setCurrentPart] = useState(0);
  const [totalParts, setTotalParts] = useState(0);
  const [uploading, setUploading] = useState(false);

  const LINES_PER_CHUNK = 300000;
  const CHUNK_SIZE = 5 * 1024 * 1024; // 10MB por lectura

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress("");
    setCurrentPart(0);
    setTotalParts(0);
  };

  const readChunkAsText = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsText(blob);
    });

  // chunks en memoria
  const createChunks = async () => {
    if (!file) return [];

    let offset = 0;
    let chunkIndex = 0;
    let buffer = "";
    const chunks = [];
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    while (offset < file.size) {
      const blobPart = file.slice(offset, offset + CHUNK_SIZE);
      const textPart = await readChunkAsText(blobPart);
      buffer += textPart;
      offset += CHUNK_SIZE;

      const lines = buffer.split("\n");

      while (lines.length >= LINES_PER_CHUNK) {
        const chunkLines = lines.splice(0, LINES_PER_CHUNK);
        chunkIndex++;

        const chunkBlob = new Blob([chunkLines.join("\n")], {
          type: "text/plain",
        });

        chunks.push({
          file: chunkBlob,
          file_name: fileName,
          file_part: chunkIndex,
          file_finish: false,
          notify_email: notifyEmail,
        });

        console.log(
          `Parte ${chunkIndex} — tamaño ${(
            chunkBlob.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        );
      }

      buffer = lines.join("\n");
    }

    if (buffer.trim().length > 0) {
      chunkIndex++;
      const chunkBlob = new Blob([buffer], { type: "text/plain" });

      chunks.push({
        file: chunkBlob,
        file_name: fileName,
        file_part: chunkIndex,
        file_finish: true,
        notify_email: notifyEmail,
      });

      console.log(
        `Última parte ${chunkIndex} — tamaño ${(
          chunkBlob.size /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
    }

    setTotalParts(chunks.length);
    return chunks;
  };

  // Subida secuencial
  const uploadChunksSequentially = async (chunks) => {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      setCurrentPart(chunk.file_part);
      setProgress(`Subiendo parte ${chunk.file_part} de ${chunks.length}...`);

      const formData = new FormData();
      formData.append("notify_email", chunk.notify_email);
      formData.append("file", chunk.file, chunk.file_name);
      formData.append("file_name", chunk.file_name);
      formData.append("file_part", Number(chunk.file_part));
      formData.append("file_finish", chunk.file_finish ? 1 : 0 );

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/uploadFileDeudoresBCRA",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        // esto queda para probar y berificar en archivos grandes en entorno DEV
        console.log(
          `Parte ${chunk.file_part} subida correctamente ✅`,
          res.data
        );
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        console.error(err);
        alert(`Error en la parte ${chunk.file_part}: ${message}`);
        break; // detener secuencia si falla
      }
    }

    setProgress(`${step} de 3! Todas las partes enviadas ✅`);
    setUploading(false);
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo");
    if (!notifyEmail) return alert("Ingresá un email de notificación");

    setUploading(true);
    setProgress("Preparando subida...");

    const chunks = await createChunks();
    await uploadChunksSequentially(chunks);
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg w-120">
      <h2 className="text-xl font-bold mb-4">
        Subida de archivo grande por partes
      </h2>

      <input
        type="email"
        placeholder="Email para notificación"
        value={notifyEmail}
        onChange={(e) => setNotifyEmail(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <input
        type="file"
        onChange={handleFileChange}
        accept=".txt"
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 rounded text-black font-semibold ${
          uploading ? "bg-white" : "bg-white hover:bg-red-600"
        }`}
      >
        {uploading ? "Subiendo..." : "Subir archivo"}
      </button>

      {progress && (
        <div className="mt-4 text-center">
          <p>{progress}</p>
          {currentPart > 0 && (
            <p className="text-sm text-gray-600">
              Parte actual: {currentPart} / {totalParts}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
