import type { ReactNode } from "react";
import type { GameScreen } from "../../game/types";
import Mask from "../Mask/Mask";
import s from "./Layout.module.css";
import u from "../../styles/shared.module.css";
interface Props {
  screen: GameScreen;
  playerIndex: number;
  onHome: () => void;
  children: ReactNode;
}
export default function Layout({
  screen,
  playerIndex,
  onHome,
  children,
}: Props) {
  return (
    <div className={s.app}>
      <a className={s.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={s.header}>
        <button
          className={s.brand}
          onClick={() => {
            if (screen === "settings") onHome();
          }}
          disabled={screen !== "settings"}
          aria-label="Um de Nós — voltar à capa"
        >
          <Mask small />
          <span>
            um de <span className={s.brandAccent}>nós.</span>
          </span>
        </button>
        <span className={s.headerTag}>
          <i /> UM CELULAR. VÁRIOS SUSPEITOS.
        </span>
      </header>
      <main
        id="conteudo"
        tabIndex={-1}
        key={`${screen}-${screen === "reveal" ? playerIndex : ""}`}
        className={`${s.main} ${s.screenEnter}`}
      >
        {children}
      </main>
      <footer className={s.footer}>
        <span>FEITO PARA JOGAR JUNTO.</span>
        <span>
          O segredo está em um de nós. <span className={u.lime}>✳</span>
        </span>
        <small className={s.credit}>
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/emanuelbitencourt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Emanuel Bitencourt no LinkedIn (abre em nova aba)"
          >
            Emanuel Bitencourt
          </a>
        </small>
      </footer>
    </div>
  );
}
