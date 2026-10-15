import type { Category } from "../../game/types";
import s from "./CategoryPicker.module.css";
import u from "../../styles/shared.module.css";

interface Props {
  categories: Category[];
  selected: string[];
  availableCount: number;
  usedCount: number;
  onChange: (selected: string[]) => void;
}

export default function CategoryPicker({
  categories,
  selected,
  availableCount,
  usedCount,
  onChange,
}: Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    );
  }

  return (
    <section className={u.panel}>
      <div className={u.sectionTitle}>
        <h2>
          <span>03</span> O assunto é…
        </h2>
        <button
          className={u.textButton}
          onClick={() =>
            onChange(
              selected.length === categories.length
                ? []
                : categories.map((category) => category.id),
            )
          }
        >
          {selected.length === categories.length ? "Limpar" : "Todas"}
        </button>
      </div>
      <p className={s.categoryIntro}>
        Misture categorias e deixe a conversa imprevisível.
      </p>
      <div className={s.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            aria-pressed={selected.includes(category.id)}
            className={selected.includes(category.id) ? s.categorySelected : ""}
            onClick={() => toggle(category.id)}
          >
            <span aria-hidden="true">{category.simbolo}</span>
            {category.nome}
            <span className={s.check} aria-hidden="true">
              {selected.includes(category.id) ? "✓" : "+"}
            </span>
          </button>
        ))}
      </div>
      <p className={u.helper}>
        {availableCount} palavras disponíveis · {usedCount} usadas nesta sessão
      </p>
    </section>
  );
}
