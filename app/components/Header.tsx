const Header = () => {
    return (
        <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-black/15 bg-gradient-to-br from-white to-slate-100" />
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-black/60">
                            WebHooks
                        </p>
                        <p className="text-lg font-semibold">
                            Google Apps Records
                        </p>
                    </div>
                </div>
                <nav className="flex items-center gap-3">
                    <a
                        href="#add"
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/30"
                    >
                        Adicionar
                    </a>
                    <a
                        href="#manage"
                        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                    >
                        Gerenciar
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;