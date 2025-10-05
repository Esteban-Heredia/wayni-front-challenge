"use client";

import { useState } from "react";

function CuilCuitSearch({ SERVER }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!value.trim()) {
      setError("Por favor, ingresa un CUIL o CUIT válido.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${SERVER}/api/deudores/${value}`);

      if (!res.ok) {
        throw new Error("No se encontró el deudor o hubo un error en la solicitud.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <h3 className="font-bold text-lg mb-3">Buscar por CUIL / CUIT</h3>

      <div className="flex flex-row items-center">
        <input
          type="text"
          placeholder="Ej: 20307201225"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-400 bg-white rounded p-2 mx-2 text-black"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {result && (
        <div className="mt-5 bg-white text-black rounded-lg shadow-md p-4 w-full max-w-lg">
          <h4 className="font-bold text-lg mb-2">Resultado:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-semibold">ID:</span> {result.id}</p>
            <p><span className="font-semibold">CUIL/CUIT:</span> {result.nro_identificacion}</p>
            <p><span className="font-semibold">Cliente:</span> {result.name_cliente}</p>
            <p><span className="font-semibold">Código entidad:</span> {result.code_quien_debe}</p>
            <p><span className="font-semibold">Entidad:</span> {result.name_quien_debe}</p>
            <p><span className="font-semibold">Situación:</span> {result.situacion_maxima}</p>
            <p><span className="font-semibold">Total préstamos:</span> {result.suma_total_prestamos}</p>
            <p><span className="font-semibold">Creado:</span> {new Date(result.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuilCuitSearch;
