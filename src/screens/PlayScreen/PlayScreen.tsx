import s from "./PlayScreen.module.css";
import u from "../../styles/shared.module.css";
import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Match } from "../../game/types";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
interface Props {
  headingRef: RefObject<HTMLHeadingElement | null>;
  match: Match;
  onReveal: () => void;
}
export default function PlayScreen({ headingRef, match, onReveal }: Props) {
  const [confirm, setConfirm] = useState(false);
  const revealResultRef = useRef<HTMLButtonElement>(null);
  const closeConfirm = useCallback(() => setConfirm(false), []);
  return (
    <>
      <section className={u.centered}>
        <span className={u.eyebrow}>
          <span className={u.dot} /> PARTIDA VALENDO
        </span>
        <h1 ref={headingRef} tabIndex={-1}>
          Que comece
          <br />a desconfiança<span className={u.lime}>.</span>
        </h1>
        <p className={u.muted}>Celular na mesa. Agora é com vocês.</p>
        <div className={s.starter}>
          <span>QUEM COMEÇA</span>
          <strong>{match.startingPlayer.name}</strong>
          <span aria-hidden="true">↗</span>
        </div>
        <div className={s.rules}>
          <div>
            <span className={s.ruleIcon}>↻</span>
            <p>
              <strong>Votação após {match.rounds} rodadas</strong>
              <span>Uma rodada é uma volta completa: todos falam uma vez.</span>
            </p>
          </div>
          <div>
            <span className={s.ruleIcon}>◇</span>
            <p>
              <strong>Impostor, escolha sua hora</strong>
              <span>
                Você só pode tentar adivinhar a palavra na sua vez de falar.
              </span>
            </p>
          </div>
          <div>
            <span className={s.ruleIcon}>☷</span>
            <p>
              <strong>A decisão é do grupo</strong>
              <span>
                Conversem e votem. Revelem o segredo quando terminarem.
              </span>
            </p>
          </div>
        </div>
        <button
          ref={revealResultRef}
          className={u.primary}
          data-primary
          onClick={() => setConfirm(true)}
        >
          Revelar impostor <span aria-hidden="true">↗</span>
        </button>
        <p className={u.helper}>
          O segredo continua escondido até vocês decidirem.
        </p>
      </section>
      <ConfirmDialog
        open={confirm}
        onCancel={closeConfirm}
        onConfirm={onReveal}
        returnFocusRef={revealResultRef}
      />
    </>
  );
}
