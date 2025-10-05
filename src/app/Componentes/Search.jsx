import { useState } from "react";
import CuilCuitSearch from "./CuilCuitSearch";
import CodeEntidadSearch from "./CodeEntidadSearch";
import TopDeudoresSearch from "./TopDeudoresSearch";
import SituationSearch from "./SituationSearch";

function Search({SERVER}) {
    const [viewActive, setviewActive] = useState("");


    
  return (
    <div className="flex flex-col mt-10">
      <div className="flex flex-col items-center justify-center ">
        <h4 className="font-bold text-2xl">Elige la manera de buscar al deudor</h4>
        <div className="flex flex-row items-center justify-center m-2">
            <button className="bg-white rounded font-light mx-1 p-1 text-black hover:bg-red-600" onClick={() => setviewActive("id")}>Buscar por identificacion</button>
            <button className="bg-white rounded font-light mx-1 p-1 text-black hover:bg-red-600" onClick={() => setviewActive("code")}>Buscar entidades</button>
            <button className="bg-white rounded font-light mx-1 p-1 text-black hover:bg-red-600" onClick={() => setviewActive("top")}>Top de deudores</button>
            <button className="bg-white rounded font-light mx-1 p-1 text-black hover:bg-red-600" onClick={() => setviewActive("situation")}>Top por situacion</button>
        </div>
      </div>

      {viewActive === "id" && <CuilCuitSearch SERVER={SERVER}/>}
      {viewActive === "code" && <CodeEntidadSearch SERVER={SERVER}/>}
      {viewActive === "top" && <TopDeudoresSearch SERVER={SERVER}/>}
      {viewActive === "situation" && <SituationSearch />}
    </div>
  )
}

export default Search
