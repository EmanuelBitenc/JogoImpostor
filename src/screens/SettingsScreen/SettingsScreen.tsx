import s from "./SettingsScreen.module.css";
import u from "../../styles/shared.module.css";
import type { RefObject } from "react";
import type { Category, Settings } from "../../game/types";
import PlayerList from "../../components/PlayerList/PlayerList";
import CategoryPicker from "../../components/CategoryPicker/CategoryPicker";
import SegmentedControl from "../../components/SegmentedControl/SegmentedControl";
const impostorOptions = [
  { value: "1", label: "1 impostor" },
  { value: "2", label: "2 impostores" },
  { value: "random", label: "1 ou 2 ↝" },
] as const;
const roundOptions = [
  { value: "2", label: "2 rodadas" },
  { value: "3", label: "3 rodadas" },
  { value: "4", label: "4 rodadas" },
  { value: "random", label: "Aleatório" },
] as const;
interface Props {
  headingRef: RefObject<HTMLHeadingElement | null>;
  nameRef: RefObject<HTMLInputElement | null>;
  settings: Settings;
  name: string;
  setName: (name: string) => void;
  addPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  update: (patch: Partial<Settings>) => void;
  categories: Category[];
  availableCount: number;
  usedCount: number;
  error: string;
  start: () => void;
}
export default function SettingsScreen({
  headingRef,
  nameRef,
  settings,
  name,
  setName,
  addPlayer,
  onRemovePlayer,
  update,
  categories,
  availableCount,
  usedCount,
  error,
  start,
}: Props) {
  return (
    <section className={s.settings}>
      <div className={s.pageHeading}>
        <span className={u.eyebrow}>ANTES DO BLEFE</span>
        <h1 ref={headingRef} tabIndex={-1}>
          Prepare a mesa<span>.</span>
        </h1>
        <p>Chame a turma e escolha como a próxima partida vai ser.</p>
      </div>
      <div className={s.settingsGrid}>
        <PlayerList
          players={settings.players}
          name={name}
          setName={setName}
          nameRef={nameRef}
          addPlayer={addPlayer}
          onRemove={onRemovePlayer}
          minimumPlayers={settings.impostors === "1" ? 3 : 5}
        />
        <div className={s.rightColumn}>
          <section className={u.panel}>
            <div className={u.sectionTitle}>
              <h2>
                <span>02</span> As regras da vez
              </h2>
            </div>
            <SegmentedControl
              label="Impostores"
              options={impostorOptions}
              value={settings.impostors}
              onChange={(value) => update({ impostors: value })}
            />
            {settings.impostors === "random" && (
              <p className={u.helper}>
                Quantidade sorteada em segredo. O grupo terá que descobrir.
              </p>
            )}
            <SegmentedControl
              className={s.roundOptions}
              label="Hora da votação"
              options={roundOptions}
              value={settings.rounds}
              onChange={(value) => update({ rounds: value })}
              helper={
                settings.rounds === "random"
                  ? "Sorteia entre 2, 3 e 4 rodadas."
                  : "Depois que todos falarem em cada rodada."
              }
            />
          </section>
          <CategoryPicker
            categories={categories}
            selected={settings.categories}
            availableCount={availableCount}
            usedCount={usedCount}
            onChange={(selected) => update({ categories: selected })}
          />
        </div>
      </div>
      <div className={s.startBar}>
        <div>
          <strong>Tudo pronto para desconfiar?</strong>
          <p>Os papéis serão revelados um de cada vez.</p>
        </div>
        <button className={u.primary} data-primary onClick={start}>
          Iniciar partida <span aria-hidden="true">↗</span>
        </button>
      </div>
      {error && (
        <p role="alert" className={u.error}>
          {error}
        </p>
      )}
    </section>
  );
}
