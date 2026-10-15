import s from "./Mask.module.css";
export default function Mask({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? s.smallMask : s.mask}
      viewBox="0 0 240 180"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 74C58 14 182 14 222 74L202 141C167 159 145 136 120 123C95 136 73 159 38 141L18 74Z"
        fill="currentColor"
      />
      <path
        d="M52 76L99 91L61 109L52 76ZM188 76L141 91L179 109L188 76Z"
        fill="#151810"
      />
    </svg>
  );
}
