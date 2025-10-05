"use client";

import { useState, useEffect } from "react";

function TopDeudoresSearch({SERVER}) {
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deudores, setDeudores] = useState([]);
  const [error, setError] = useState("");

  const fetchDeudores = async (cantidad) => {
    setLoading(true);
    setError("");
    setDeudores([]);

    try {
      const res = await fetch(`${SERVER}/api/deudores/top/${cantidad}`);
      if (!res.ok) throw new Error("Error al obtener los deudores.");

      const data = await res.json();
      setDeudores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeudores(limit);
  }, [limit]);

  return (
    <div className="flex flex-col items-center justify-center my-10 w-full">
      <h3 className="font-bold text-lg mb-3">Top de Deudores</h3>

      <div className="flex flex-row items-center mb-4">
        <label className="mr-2">Cantidad a mostrar:</label>
        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border bg-white border-gray-400 rounded p-2 text-black"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading && <p className="text-blue-500">Cargando deudores...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && deudores.length > 0 && (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="min-w-full border border-gray-300 text-sm bg-white text-black rounded-md shadow">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="border p-2 text-left">CUIT/CUIL</th>
                <th className="border p-2 text-left">Cliente</th>
                <th className="border p-2 text-left">Entidad</th>
                <th className="border p-2 text-center">Situación</th>
                <th className="border p-2 text-right">Total Préstamos</th>
              </tr>
            </thead>
            <tbody>
              {deudores.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.nro_identificacion}</td>
                  <td className="border p-2">{item.name_cliente}</td>
                  <td className="border p-2">{item.name_quien_debe}</td>
                  <td className="border p-2 text-center">{item.situacion_maxima}</td>
                  <td className="border p-2 text-right">
                    {Number(item.suma_total_prestamos).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && deudores.length === 0 && (
        <p className="text-gray-500 mt-3">No hay datos disponibles.</p>
      )}
    </div>
  );
}

export default TopDeudoresSearch;
