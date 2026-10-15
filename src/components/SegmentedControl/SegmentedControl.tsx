import s from "./SegmentedControl.module.css";
import u from "../../styles/shared.module.css";

interface Props<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ readonly value: T; readonly label: string }>;
  onChange: (value: T) => void;
  className?: string;
  helper?: string;
}

export default function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
  helper,
}: Props<T>) {
  return (
    <fieldset className={`${s.fieldset} ${className}`}>
      <legend>{label}</legend>
      <div className={s.segmented}>
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            aria-pressed={value === option.value}
            className={value === option.value ? s.selectedSegment : ""}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {helper && <p className={u.helper}>{helper}</p>}
    </fieldset>
  );
}
