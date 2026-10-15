import type { RefObject } from "react";
import type { Player } from "../../game/types";
import s from "./PlayerList.module.css";
import u from "../../styles/shared.module.css";
interface Props {
  players: Player[];
  name: string;
  setName: (name: string) => void;
  nameRef: RefObject<HTMLInputElement | null>;
  addPlayer: () => void;
  onRemove: (id: string) => void;
  minimumPlayers: number;
}
export default function PlayerList({
  players,
  name,
  setName,
  nameRef,
  addPlayer,
  onRemove,
  minimumPlayers,
}: Props) {
  return (
    <section className={u.panel}>
      <div className={u.sectionTitle}>
        <h2>
          <span>01</span> Quem vai jogar?
        </h2>
        <span className={u.badge}>
          {players.length} {players.length === 1 ? "jogador" : "jogadores"}
        </span>
      </div>
      <form
        className={s.addPlayer}
        onSubmit={(e) => {
          e.preventDefault();
          addPlayer();
        }}
      >
        <label className={u.srOnly} htmlFor="player-name">
          Nome do jogador
        </label>
        <input
          id="player-name"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome ou apelido"
          maxLength={24}
          autoComplete="off"
        />
        <button type="submit" aria-label="Adicionar jogador">
          +
        </button>
      </form>
      <div className={s.playerList}>
        {players.length === 0 ? (
          <div className={s.empty}>
            <span>＋</span>
            <p>A turma começa por aqui.</p>
            <small>Adicione o primeiro jogador acima.</small>
          </div>
        ) : (
          players.map((p, i) => (
            <div className={s.playerRow} key={p.id}>
              <span className={s.avatar}>{String(i + 1).padStart(2, "0")}</span>
              <span>{p.name}</span>
              <button
                onClick={() => onRemove(p.id)}
                aria-label={`Remover ${p.name}`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
      <p className={u.helper}>
        Pelo menos {minimumPlayers} jogadores neste modo. Vale usar apelido.
      </p>
    </section>
  );
}
