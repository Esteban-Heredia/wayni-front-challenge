import { useState, useEffect } from "react";

function SituationSearch() {
  const [codigo, setCodigo] = useState("1");
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const situaciones = [
    { code: "1", label: "Situación Normal" },
    { code: "21", label: "Riesgo Bajo" },
    { code: "23", label: "Tratamiento Especial" },
    { code: "3", label: "Riesgo Medio" },
    { code: "4", label: "Riesgo Alto" },
    { code: "5", label: "Irrecuperable" },
    { code: "11", label: "Garantías Preferidas A" },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8000/api/deudores/situaciones/${codigo}?page=${page}&limit=${limit}`
      );
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Error en la búsqueda");

      setData(json.data || []);
      setMeta(json.meta || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [codigo, page]);

  const handlePrev = () => {
    if (meta && meta.current_page > 1) setPage(meta.current_page - 1);
  };

  const handleNext = () => {
    if (meta && meta.current_page < meta.last_page)
      setPage(meta.current_page + 1);
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">Buscar por Situación</h3>

      <div className="relative inline-block my-5">
        <select
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value);
            setPage(1);
          }}
          className="appearance-none text-black border border-gray-400 p-2 pr-8 rounded-md bg-white"
        >
          {situaciones.map((s) => (
            <option
              key={s.code}
              value={s.code}
              className="bg-gray-200 text-black"
            >
              {s.code} - {s.label}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          ▼
        </span>
      </div>

      {loading && <p className="text-gray-500">Cargando resultados...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && data.length > 0 && (
        <div className="w-full max-w-3xl overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">CUIT/CUIL</th>
                <th className="p-2 border">Cliente</th>
                <th className="p-2 border">Entidad</th>
                <th className="p-2 border">Situación</th>
                <th className="p-2 border">Préstamos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={i}
                  className="bg-white text-black transition-all border-b text-sm text-center"
                >
                  <td className="p-2">{item.nro_identificacion}</td>
                  <td className="p-2">{item.name_cliente}</td>
                  <td className="p-2">{item.name_quien_debe}</td>
                  <td className="p-2">{item.descripcion}</td>
                  <td className="p-2 font-medium">
                    ${parseFloat(item.suma_total_prestamos).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <div className="flex flex-col items-center justify-center my-5 space-y-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrev}
              disabled={meta.current_page === 1}
              className="px-3 py-1 bg-red-600 rounded disabled:opacity-50 hover:bg-red-800"
            >
              ← Anterior
            </button>

            <span className="text-gray-700 font-medium">
              Página {meta.current_page} de {meta.last_page}
            </span>

            <button
              onClick={handleNext}
              disabled={meta.current_page === meta.last_page}
              className="px-3 py-1 bg-red-600 rounded disabled:opacity-50 hover:bg-red-800"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SituationSearch;
