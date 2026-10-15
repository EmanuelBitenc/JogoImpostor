import s from "./RevealScreen.module.css";
import u from "../../styles/shared.module.css";
import type { RefObject } from "react";
import type { Match } from "../../game/types";
import SecretCard from "../../components/SecretCard/SecretCard";
import { useRevealCard } from "../../components/SecretCard/useRevealCard";
interface Props {
  headingRef: RefObject<HTMLHeadingElement | null>;
  match: Match;
  playerIndex: number;
  nextPlayer: () => void;
}
export default function RevealScreen({
  headingRef,
  match,
  playerIndex,
  nextPlayer,
}: Props) {
  const player = match.players[playerIndex];
  const isImpostor = match.impostorIds.includes(player.id);
  const controls = useRevealCard();
  const { visible, seen } = controls;
  return (
    <section className={u.centered}>
      <span className={u.eyebrow}>SÓ VOCÊ PODE VER</span>
      <div
        className={s.progress}
        aria-label={`Jogador ${playerIndex + 1} de ${match.players.length}`}
      >
        {match.players.map((p, i) => (
          <span
            key={p.id}
            className={i <= playerIndex ? s.progressActive : ""}
          />
        ))}
      </div>
      <p className={u.muted}>Passe o celular para</p>
      <h1 ref={headingRef} tabIndex={-1} className={s.playerName}>
        {player.name}
      </h1>
      <p className={u.muted}>
        Jogador {playerIndex + 1} de {match.players.length}. Os outros, olhem
        para o lado.
      </p>
      <SecretCard match={match} isImpostor={isImpostor} controls={controls} />
      <button
        className={u.secondary}
        disabled={!seen || visible}
        onClick={nextPlayer}
      >
        {playerIndex === match.players.length - 1
          ? "Iniciar rodada"
          : "Próximo jogador"}{" "}
        <span aria-hidden="true">→</span>
      </button>
      <p className={u.helper}>
        {!seen
          ? "Veja sua informação antes de continuar."
          : visible
            ? "Solte o card para esconder sua informação."
            : playerIndex === match.players.length - 1
              ? "Tudo pronto. Inicie a rodada quando quiser."
              : "Informação escondida. Continue e passe o celular."}
      </p>
    </section>
  );
}
