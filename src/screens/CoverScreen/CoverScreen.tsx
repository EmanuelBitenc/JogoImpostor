import s from "./CoverScreen.module.css";
import u from "../../styles/shared.module.css";
import type { RefObject } from "react";
import Mask from "../../components/Mask/Mask";
interface Props {
  headingRef: RefObject<HTMLHeadingElement | null>;
  wordCount: number;
  categoryCount: number;
  onStart: () => void;
}
export default function CoverScreen({
  headingRef,
  wordCount,
  categoryCount,
  onStart,
}: Props) {
  return (
    <section className={s.cover}>
      <div className={s.coverText}>
        <span className={u.eyebrow}>
          <span className={u.dot} /> JOGO DO IMPOSTOR
        </span>
        <h1 ref={headingRef} tabIndex={-1}>
          Todo mundo sabe.
          <br />
          <span>Ou quase todo mundo.</span>
        </h1>
        <p className={s.lead}>
          Você conhece seus amigos.
          <br />
          Mas deveria confiar em todos?
        </p>
        <p className={s.freeBadge}>
          ✓ Jogo completo e grátis <span>Sem cadastro. Sem instalação.</span>
        </p>
        <button className={u.primary} data-primary onClick={onStart}>
          Bora jogar <span aria-hidden="true">↗</span>
        </button>
        <p className={s.coverNote}>
          Junte os amigos. O celular passa de mão em mão.
        </p>
        <div className={s.coverStats}>
          <span>
            <strong>3+</strong> jogadores
          </span>
          <span>
            <strong>{wordCount}</strong> palavras
          </span>
          <span>
            <strong>{categoryCount}</strong> categorias
          </span>
        </div>
      </div>
      <div className={s.art} aria-hidden="true">
        <div className={s.orbit} />
        <span className={s.artStar}>✳</span>
        <div className={s.behindCard}>
          <span>UMA PALAVRA.</span>
          <div>?</div>
          <span>QUASE TODO MUNDO SABE.</span>
        </div>
        <div className={s.frontCard}>
          <div className={s.cardTop}>
            <span>IDENTIDADE SECRETA</span>
            <span>↗</span>
          </div>
          <Mask />
          <strong>
            Quem está
            <br />
            mentindo?
          </strong>
          <div className={s.cardBottom}>
            <span>CONFIE COM MODERAÇÃO.</span>
            <span>● ● ○</span>
          </div>
        </div>
        <span className={s.artLabel}>o próximo suspeito pode ser você.</span>
      </div>
      <div className={s.steps}>
        <div>
          <b>01</b>
          <span>Configure o jogo</span>
        </div>
        <div>
          <b>02</b>
          <span>Descubra a palavra</span>
        </div>
        <div>
          <b>03</b>
          <span>Desconfie de todo mundo.</span>
        </div>
      </div>
      <section className={s.howTo} aria-labelledby="como-jogar">
        <div className={s.howToHeading}>
          <span className={u.eyebrow}>TODO MUNDO PODE JOGAR</span>
          <h2 id="como-jogar">
            Jogo do impostor com amigos.
            <br />
            <span>Completo e gratuito.</span>
          </h2>
          <p>
            Reúna a turma e passe o celular de mão em mão. O Um de Nós é um jogo
            de palavras secretas, pistas e dedução para jogar juntos, no mesmo
            lugar.
          </p>
        </div>
        <div className={s.instructions}>
          <h3>Como jogar</h3>
          <ol>
            <li>
              <strong>Prepare a partida.</strong> Adicione pelo menos 3
              jogadores, escolha as categorias, os impostores e a quantidade de
              rodadas até a votação. Com 2 impostores ou no modo aleatório, são
              pelo menos 5 pessoas.
            </li>
            <li>
              <strong>Veja seu segredo.</strong> Cada pessoa segura o card para
              consultar a palavra. O impostor recebe uma dica e precisa
              improvisar. Solte o card antes de passar o aparelho.
            </li>
            <li>
              <strong>Converse e desconfie.</strong> Cada jogador fala uma
              palavra relacionada ao segredo. O app sorteia quem começa e
              informa quando o grupo deve votar.
            </li>
            <li>
              <strong>Descubra quem está mentindo.</strong> Façam a votação
              entre vocês e revelem os impostores ao terminar. O impostor também
              pode tentar adivinhar a palavra na própria vez: se acertar, ganha;
              se errar, perde individualmente.
            </li>
          </ol>
        </div>
      </section>
    </section>
  );
}
