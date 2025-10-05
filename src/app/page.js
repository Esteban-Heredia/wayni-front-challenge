import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-row gap-10 w-full align-center justify-center ">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          <Image
            src="/laravel.webp"
            alt="Laravel Logo"
            width={180}
            height={38}
            priority
          />
        </div>

        <div className="flex flex-col gap-4 align-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-center">
            Bienvenido a la prueba tecnica de Esteban Heredia
          </h1>
          <p className="text-sm sm:text-base text-center w-[80%] m-auto">En este Front podras encontrar el dashboard de la prueba tecnica para Wayni. Desde ya muchas gracias por la opportunidad</p>
        </div>

        <div className="flex flex-row gap-4 align-center justify-center w-full">
        <a href="/Home" className="bg-white hover:bg-red-600 text-black font-bold py-2 px-4 rounded">
          Ir al dashboard
        </a>
        </div>
      </main>
    </div>
  );
}
