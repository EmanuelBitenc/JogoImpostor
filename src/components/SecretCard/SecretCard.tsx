import type { Match } from "../../game/types";
import Mask from "../Mask/Mask";
import { useRevealCard } from "./useRevealCard";
import s from "./SecretCard.module.css";
import u from "../../styles/shared.module.css";
type RevealControls = ReturnType<typeof useRevealCard>;
interface Props {
  match: Match;
  isImpostor: boolean;
  controls: RevealControls;
}
export default function SecretCard({ match, isImpostor, controls }: Props) {
  const { visible, press, keyPress, hide } = controls;
  return (
    <button
      type="button"
      className={`${s.secretCard} ${visible ? (isImpostor ? s.impostorCard : s.wordCard) : ""}`}
      aria-label="Segure para revelar sua informação"
      onPointerDown={press}
      onPointerUp={hide}
      onPointerCancel={hide}
      onLostPointerCapture={hide}
      onPointerLeave={hide}
      onKeyDown={keyPress}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") hide();
      }}
      onBlur={hide}
      onContextMenu={(e) => e.preventDefault()}
    >
      {visible ? (
        isImpostor ? (
          <>
            <Mask small />
            <span className={u.eyebrow} data-secret-label>
              VOCÊ É O IMPOSTOR
            </span>
            <span className={s.cardDescription}>Sua dica é</span>
            <strong className={s.secretWord}>{match.hint}</strong>
            <small>Disfarce e tente descobrir a palavra.</small>
          </>
        ) : (
          <>
            <Mask small />
            <span className={u.eyebrow}>A PALAVRA É</span>
            <strong className={s.secretWord}>{match.word.palavra}</strong>
            <small>Guarde essa informação com você.</small>
          </>
        )
      ) : (
        <>
          <Mask small />
          <span className={s.secretTitle}>Seu segredo está aqui.</span>
          <span className={s.cardDescription}>
            Segure este card para revelar.
          </span>
          <small>Soltou? A informação fica escondida.</small>
        </>
      )}
      <span className={s.cardAction}>
        {visible ? "Solte para esconder" : "Segure para revelar"}
      </span>
    </button>
  );
}
