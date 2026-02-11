import { ContactForm } from "./components/forms";
import Header from "./components/Header";
import { RecordManager } from "./components/RecordManager";

interface IncomingRecord {
  id?: string | number;
  name: string;
  mail: string;
  phone: string;
}

const Home = async () => {
  const response = await fetch("http://localhost:3001/records", {
    cache: "no-store",
  });
  const incomingData = (await response.json()) as IncomingRecord[];
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-black/50">
              Dados centralizados
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-black md:text-5xl">
              Capture, organize e envie registros com WebHooks.
            </h1>
            <p className="text-lg text-black/70">
              Um fluxo leve para coletar contatos, sincronizar com Google Apps e
              visualizar tudo em um so lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#add"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
              >
                Adicionar registro
              </a>
              <a
                href="#manage"
                className="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-black transition hover:border-black/40"
              >
                Gerenciar registros
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-black/50">
                Status
              </p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                WebHook ativo
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Registros hoje
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {incomingData.length}
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Ultima sincronizacao
                </p>
                <p className="mt-2 text-base text-black/70">Agora mesmo</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="add"
          className="rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                Adicionar
              </p>
              <h2 className="text-2xl font-semibold">Novo registro</h2>
            </div>
            <span className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/60">
              Sincroniza em tempo real
            </span>
          </div>
          <ContactForm />
        </section>

        <section id="manage" className="mt-12">
          <RecordManager initialRecords={incomingData} />
        </section>
      </main>
    </>
  );
};

export default Home;
