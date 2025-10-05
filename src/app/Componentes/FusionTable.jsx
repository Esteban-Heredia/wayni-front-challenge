"use client";
import { useState } from "react";
import axios from "axios";

export default function FusionTable({SERVER}) {
  const [loadingEntidades, setLoadingEntidades] = useState(false);
  const [loadingBcra, setLoadingBcra] = useState(false);
  const [statusEntidades, setStatusEntidades] = useState(null);
  const [statusBcra, setStatusBcra] = useState(null);

  const handleFusionEntidades = async () => {
    setLoadingEntidades(true);
    setStatusEntidades("Ejecutando fusión...");
    try {
      const res = await axios.get(`${SERVER}/api/entidadesFull`);
      setStatusEntidades(`✅ Fusión completada: ${res.data.message || "OK"}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setStatusEntidades(`❌ Error: ${msg}`);
    } finally {
      setLoadingEntidades(false);
    }
  };

  const handleFusionBcra = async () => {
    setLoadingBcra(true);
    setStatusBcra("Ejecutando fusión...");
    try {
      const res = await axios.get(`${SERVER}/api/deudoresFull`);
      setStatusBcra(`✅ Fusión completada: ${res.data.message || "OK"}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setStatusBcra(`❌ Error: ${msg}`);
    } finally {
      setLoadingBcra(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-10">
        <h6 className="mt-2 text-sm text-center text-gray-500 text-light">
            Este proceso puede tardar unos minutos dependiendo de la cantidad de deudores
        </h6>
      <div className="flex flex-col items-center justify-center gap-3 p-6 border rounded-lg text-white max-w-xl w-full">
        <h5 className="text-lg font-semibold text-center">
          Fusionar tabla de entidades y su deuda
        </h5>
        <button
          onClick={handleFusionEntidades}
          disabled={loadingEntidades}
          className={`px-5 py-2 rounded font-semibold ${
            loadingEntidades
              ? "bg-white text-black cursor-not-allowed"
              : "bg-white text-black hover:bg-red-600"
          }`}
        >
          {loadingEntidades ? "Fusionando..." : "Fusionar"}
        </button>
        {statusEntidades && (
          <p className="mt-2 text-sm text-center">{statusEntidades}</p>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-3 p-6 border rounded-lg text-white max-w-xl w-full">
        <h5 className="text-lg font-semibold text-center">
          Fusionar tabla deudores del BCRA, clientes y entidades
        </h5>
        <button
          onClick={handleFusionBcra}
          disabled={loadingBcra}
          className={`px-5 py-2 rounded font-semibold ${
            loadingBcra
              ? "bg-white text-black cursor-not-allowed"
              : "bg-white text-black hover:bg-red-600"
          }`}
        >
          {loadingBcra ? "Fusionando..." : "Fusionar"}
        </button>
        {statusBcra && <p className="mt-2 text-sm text-center">{statusBcra}</p>}
      </div>
    </div>
  );
}
