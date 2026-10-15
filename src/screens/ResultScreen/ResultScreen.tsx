import s from "./ResultScreen.module.css";
import u from "../../styles/shared.module.css";
import type { RefObject } from "react";
import type { Match } from "../../game/types";
import Mask from "../../components/Mask/Mask";
interface Props {
  headingRef: RefObject<HTMLHeadingElement | null>;
  match: Match;
  onRestart: () => void;
}
export default function ResultScreen({ headingRef, match, onRestart }: Props) {
  return (
    <section className={u.centered}>
      <span className={u.eyebrow}>MISTÉRIO RESOLVIDO</span>
      <h1 ref={headingRef} tabIndex={-1}>
        Fim do blefe<span className={u.lime}>.</span>
      </h1>
      <p className={u.muted}>E aí, vocês desconfiaram da pessoa certa?</p>
      <div className={s.resultCard}>
        <Mask small />
        <span className={u.eyebrow}>
          {match.impostorIds.length === 1
            ? "O IMPOSTOR ERA"
            : "OS IMPOSTORES ERAM"}
        </span>
        <h2 className={s.impostorName}>
          {match.players
            .filter((p) => match.impostorIds.includes(p.id))
            .map((p) => p.name)
            .join(" & ")}
        </h2>
        <div className={s.resultWord}>
          <span>A PALAVRA SECRETA</span>
          <strong>{match.word.palavra}</strong>
          <small>Dica: {match.hint}</small>
        </div>
      </div>
      <button className={u.primary} data-primary onClick={onRestart}>
        Recomeçar jogo <span aria-hidden="true">↗</span>
      </button>
      <p className={u.helper}>Essa palavra fica fora das próximas partidas.</p>
    </section>
  );
}
