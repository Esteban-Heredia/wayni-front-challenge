"use client";
import { useState } from "react";
import FileExtraGiga from "../Componentes/FileExtraGiga";
import FileSmall from "../Componentes/FileSmall";
import FusionTable from "../Componentes/FusionTable";
import Search from "../Componentes/Search";

export default function HomePage() {
  const [viewActive, setviewActive] = useState("");

  const SERVER = process.env.NEXT_PUBLIC_SERVER;
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col mt-15 mb-2 justify-center items-center">
        <h1 className="text-4xl font-bold mt-20 mb-1">
          Por favor seguir la documentacion
        </h1>
        <a
          href="https://docs.google.com/document/d/18Ycuwa2FzTEcwQ0Y2WZxFz1DGIJGJDgE42ZCUEwLUP8/edit?usp=sharing"
          target="_blank"
          className="font-extralight"
        >
          Documentacion
        </a>
      </div>

      <div className="mb-10">
        <button
          onClick={() => setviewActive("upload")}
          className="bg-white m-2 p-2 rounded text-black font-bold hover:bg-red-600"
        >
          Cargar Archivos
        </button>
        <button
          onClick={() => setviewActive("fusion")}
          className="bg-white m-2 p-2 rounded text-black font-bold hover:bg-red-600"
        >
          Fusionar Archivos
        </button>
        <button
          onClick={() => setviewActive("search")}
          className="bg-white m-2 p-2 rounded text-black font-bold hover:bg-red-600"
        >
          Busque al deudor
        </button>
      </div>

      {viewActive === "upload" && (
        <>
          <FileSmall
            SERVER={SERVER}
            endpoint={"api/uploadEntidades"}
            title={"Entidades"}
            step={1}
          />
          <FileSmall
            SERVER={SERVER}
            endpoint={"api/uploadClientes"}
            title={"Clientes"}
            step={2}
          />
          <FileExtraGiga
            SERVER={SERVER}
            endpoint={"api/uploadFileDeudoresBCRA"}
            step={3}
          />
        </>
      )}

      {viewActive === "fusion" && <FusionTable SERVER={SERVER} />}
      {viewActive === "search" && <Search SERVER={SERVER} />}
    </div>
  );
}
