import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-4 self-center">Votaciones HY</h1>

        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/votar"
            className="group glass-panel p-6 flex items-center justify-between hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-primary">Soy Votante</span>
              <span className="text-sm text-gray-600">Ingresar a la asamblea</span>
            </div>
            <div className="bg-success/10 text-success p-3 rounded-full">➜</div>
          </Link>

          <Link
            href="/admin"
            className="group glass-panel p-6 flex items-center justify-between hover:scale-105 transition-all cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-primary">Soy Admin</span>
              <span className="text-sm text-gray-600">Gestionar votaciones</span>
            </div>
            <div className="bg-info/10 text-info p-3 rounded-full">⚙</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
