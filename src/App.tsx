import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import catalog from './data/words.json';
import { availableWords, createMatch, validateSettings } from './game/game';
import type { Category, Match, Settings } from './types';
import s from './App.module.css';

const categories = catalog as Category[];
const storageKey = 'entre-nos:settings:v1';
const defaults: Settings = { players: [], categories: categories.map(c => c.id), impostors: '1', rounds: '2' };

function loadSettings(): Settings {
  if (typeof window === 'undefined') return defaults;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (!saved || !Array.isArray(saved.players) || !Array.isArray(saved.categories)) return defaults;
    const players = saved.players.filter((p: unknown): p is Settings['players'][number] => !!p && typeof p === 'object' && 'id' in p && typeof p.id === 'string' && 'name' in p && typeof p.name === 'string');
    if (new Set(players.map((p: Settings['players'][number]) => p.id)).size !== players.length) return defaults;
    return {
      players,
      categories: saved.categories.filter((id: string) => categories.some(c => c.id === id)),
      impostors: ['1', '2', 'random'].includes(saved.impostors) ? saved.impostors : '1',
      rounds: ['2', '3', '4', 'random'].includes(saved.rounds) ? saved.rounds : '2',
    };
  } catch { return defaults; }
}

function Mask({ small = false }: { small?: boolean }) {
  return <svg className={small ? s.smallMask : s.mask} viewBox="0 0 240 180" fill="none" aria-hidden="true">
    <path d="M18 74C58 14 182 14 222 74L202 141C167 159 145 136 120 123C95 136 73 159 38 141L18 74Z" fill="currentColor" />
    <path d="M52 76L99 91L61 109L52 76ZM188 76L141 91L179 109L188 76Z" fill="#151810" />
  </svg>;
}

export default function App() {
  const [screen, setScreen] = useState<'cover' | 'settings' | 'reveal' | 'play' | 'result'>('cover');
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [used, setUsed] = useState<Set<string>>(() => new Set());
  const [match, setMatch] = useState<Match | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const revealResultRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const words = availableWords(categories, settings.categories, used);
  const player = match?.players[playerIndex];
  const isImpostor = !!player && !!match?.impostorIds.includes(player.id);

  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Storage can be disabled. */ } }, [settings]);
  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [screen, playerIndex]);
  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('blur', hide); document.removeEventListener('visibilitychange', hide); };
  }, []);
  useEffect(() => {
    if (!confirm) return;
    cancelRef.current?.focus();
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') closeConfirm(); };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [confirm]);

  function update(patch: Partial<Settings>) { setSettings(current => ({ ...current, ...patch })); setError(''); }
  function addPlayer() {
    const trimmed = name.trim();
    if (!trimmed) { setError('Digite um nome para adicionar o jogador.'); nameRef.current?.focus(); return; }
    if (settings.players.some(p => p.name.toLocaleLowerCase('pt-BR') === trimmed.toLocaleLowerCase('pt-BR'))) { setError('Esse nome já está na partida. Use um apelido diferente.'); return; }
    const id = [...crypto.getRandomValues(new Uint8Array(16))].map(value => value.toString(16).padStart(2, '0')).join('');
    update({ players: [...settings.players, { id, name: trimmed }] });
    setName(''); nameRef.current?.focus();
  }
  function start() {
    if (name.trim()) { setError('Adicione o nome digitado usando o botão + antes de começar.'); nameRef.current?.focus(); return; }
    const message = validateSettings(settings, words);
    if (message) { setError(message); return; }
    const next = createMatch(settings, words);
    setMatch(next); setUsed(current => new Set([...current, next.word.id]));
    setPlayerIndex(0); setVisible(false); setSeen(false); setError(''); setScreen('reveal');
  }
  function reveal() { setVisible(true); setSeen(true); }
  function nextPlayer() {
    setVisible(false); setSeen(false);
    if (match && playerIndex === match.players.length - 1) setScreen('play');
    else setPlayerIndex(i => i + 1);
  }
  function press(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); reveal();
  }
  function keyPress(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); reveal(); }
  }
  function closeConfirm() { setConfirm(false); revealResultRef.current?.focus(); }
  const count = categories.reduce((sum, category) => sum + category.palavras.length, 0);

  return <div className={s.app}>
    <a className={s.skipLink} href="#conteudo">Pular para o conteúdo</a>
    <header className={s.header}>
      <button className={s.brand} onClick={() => { if (screen === 'settings') setScreen('cover'); }} disabled={screen !== 'settings'} aria-label="Entre Nós — voltar à capa"><Mask small /><span>entre<span className={s.brandAccent}>nós.</span></span></button>
      <span className={s.headerTag}><i /> UM CELULAR. VÁRIOS SUSPEITOS.</span>
    </header>
    <main id="conteudo" tabIndex={-1} key={`${screen}-${screen === 'reveal' ? playerIndex : ''}`} className={`${s.main} ${s.screenEnter}`}>
      {screen === 'cover' && <section className={s.cover}>
        <div className={s.coverText}>
          <span className={s.eyebrow}><span className={s.dot} /> JOGO DO IMPOSTOR</span>
          <h1 ref={headingRef} tabIndex={-1}>Todo mundo sabe.<br /><span>Ou quase todo mundo.</span></h1>
          <p className={s.lead}>Você conhece seus amigos.<br />Mas deveria confiar em todos?</p>
          <p className={s.freeBadge}>✓ Jogo completo e grátis <span>Sem cadastro. Sem instalação.</span></p>
          <button className={s.primary} onClick={() => setScreen('settings')}>Bora jogar <span aria-hidden="true">↗</span></button>
          <p className={s.coverNote}>Junte os amigos. O celular passa de mão em mão.</p>
          <div className={s.coverStats}><span><strong>3+</strong> jogadores</span><span><strong>{count}</strong> palavras</span><span><strong>10</strong> categorias</span></div>
        </div>
        <div className={s.art} aria-hidden="true">
          <div className={s.orbit} /><span className={s.artStar}>✳</span>
          <div className={s.behindCard}><span>UMA PALAVRA.</span><div>?</div><span>QUASE TODO MUNDO SABE.</span></div>
          <div className={s.frontCard}><div className={s.cardTop}><span>IDENTIDADE SECRETA</span><span>↗</span></div><Mask /><strong>Quem está<br />mentindo?</strong><div className={s.cardBottom}><span>CONFIE COM MODERAÇÃO.</span><span>● ● ○</span></div></div>
          <span className={s.artLabel}>o próximo suspeito pode ser você.</span>
        </div>
        <div className={s.steps}><div><b>01</b><span>Configure o jogo</span></div><div><b>02</b><span>Descubra a palavra</span></div><div><b>03</b><span>Desconfie de todo mundo.</span></div></div>
        <section className={s.howTo} aria-labelledby="como-jogar">
          <div className={s.howToHeading}><span className={s.eyebrow}>TODO MUNDO PODE JOGAR</span><h2 id="como-jogar">Jogo do impostor com amigos.<br /><span>Completo e gratuito.</span></h2><p>Reúna a turma e passe o celular de mão em mão. O Entre Nós é um jogo de palavras secretas, pistas e dedução para jogar juntos, no mesmo lugar.</p></div>
          <div className={s.instructions}><h3>Como jogar</h3><ol><li><strong>Prepare a partida.</strong> Adicione pelo menos 3 jogadores, escolha as categorias, os impostores e a quantidade de rodadas até a votação. Com 2 impostores ou no modo aleatório, são pelo menos 5 pessoas.</li><li><strong>Veja seu segredo.</strong> Cada pessoa segura o card para consultar a palavra. O impostor recebe uma dica e precisa improvisar. Solte o card antes de passar o aparelho.</li><li><strong>Converse e desconfie.</strong> Cada jogador fala uma palavra relacionada ao segredo. O app sorteia quem começa e informa quando o grupo deve votar.</li><li><strong>Descubra quem está mentindo.</strong> Façam a votação entre vocês e revelem os impostores ao terminar. O impostor também pode tentar adivinhar a palavra na própria vez: se acertar, ganha; se errar, perde individualmente.</li></ol></div>
        </section>
      </section>}

      {screen === 'settings' && <section className={s.settings}>
        <div className={s.pageHeading}><span className={s.eyebrow}>ANTES DO BLEFE</span><h1 ref={headingRef} tabIndex={-1}>Prepare a mesa<span>.</span></h1><p>Chame a turma e escolha como a próxima partida vai ser.</p></div>
        <div className={s.settingsGrid}>
          <section className={s.panel}><div className={s.sectionTitle}><h2><span>01</span> Quem vai jogar?</h2><span className={s.badge}>{settings.players.length} {settings.players.length === 1 ? 'jogador' : 'jogadores'}</span></div>
            <form className={s.addPlayer} onSubmit={e => { e.preventDefault(); addPlayer(); }}><label className={s.srOnly} htmlFor="player-name">Nome do jogador</label><input id="player-name" ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="Nome ou apelido" maxLength={24} autoComplete="off" /><button type="submit" aria-label="Adicionar jogador">+</button></form>
            <div className={s.playerList}>{settings.players.length === 0 ? <div className={s.empty}><span>＋</span><p>A turma começa por aqui.</p><small>Adicione o primeiro jogador acima.</small></div> : settings.players.map((p, i) => <div className={s.playerRow} key={p.id}><span className={s.avatar}>{String(i + 1).padStart(2, '0')}</span><span>{p.name}</span><button onClick={() => update({ players: settings.players.filter(item => item.id !== p.id) })} aria-label={`Remover ${p.name}`}>×</button></div>)}</div>
            <p className={s.helper}>Pelo menos {settings.impostors === '1' ? '3' : '5'} jogadores neste modo. Vale usar apelido.</p>
          </section>
          <div className={s.rightColumn}>
            <section className={s.panel}><div className={s.sectionTitle}><h2><span>02</span> As regras da vez</h2></div>
              <fieldset className={s.fieldset}><legend>Impostores</legend><div className={s.segmented}>{([{ value: '1', label: '1 impostor' }, { value: '2', label: '2 impostores' }, { value: 'random', label: '1 ou 2 ↝' }] as const).map(option => <button type="button" key={option.value} aria-pressed={settings.impostors === option.value} className={settings.impostors === option.value ? s.selectedSegment : ''} onClick={() => update({ impostors: option.value })}>{option.label}</button>)}</div></fieldset>
              {settings.impostors === 'random' && <p className={s.helper}>Quantidade sorteada em segredo. O grupo terá que descobrir.</p>}
              <fieldset className={`${s.fieldset} ${s.roundOptions}`}><legend>Hora da votação</legend><div className={s.segmented}>{([{ value: '2', label: '2 rodadas' }, { value: '3', label: '3 rodadas' }, { value: '4', label: '4 rodadas' }, { value: 'random', label: 'Aleatório' }] as const).map(option => <button type="button" key={option.value} aria-pressed={settings.rounds === option.value} className={settings.rounds === option.value ? s.selectedSegment : ''} onClick={() => update({ rounds: option.value })}>{option.label}</button>)}</div><p className={s.helper}>{settings.rounds === 'random' ? 'Sorteia entre 2, 3 e 4 rodadas.' : 'Depois que todos falarem em cada rodada.'}</p></fieldset>
            </section>
            <section className={s.panel}><div className={s.sectionTitle}><h2><span>03</span> O assunto é…</h2><button className={s.textButton} onClick={() => update({ categories: settings.categories.length === categories.length ? [] : categories.map(c => c.id) })}>{settings.categories.length === categories.length ? 'Limpar' : 'Todas'}</button></div><p className={s.categoryIntro}>Misture categorias e deixe a conversa imprevisível.</p>
              <div className={s.categories}>{categories.map(category => <button key={category.id} aria-pressed={settings.categories.includes(category.id)} className={settings.categories.includes(category.id) ? s.categorySelected : ''} onClick={() => update({ categories: settings.categories.includes(category.id) ? settings.categories.filter(id => id !== category.id) : [...settings.categories, category.id] })}><span aria-hidden="true">{category.simbolo}</span>{category.nome}<span className={s.check} aria-hidden="true">{settings.categories.includes(category.id) ? '✓' : '+'}</span></button>)}</div>
              <p className={s.helper}>{words.length} palavras disponíveis · {used.size} usadas nesta sessão</p>
            </section>
          </div>
        </div>
        <div className={s.startBar}><div><strong>Tudo pronto para desconfiar?</strong><p>Os papéis serão revelados um de cada vez.</p></div><button className={s.primary} onClick={start}>Iniciar partida <span aria-hidden="true">↗</span></button></div>
        {error && <p role="alert" className={s.error}>{error}</p>}
      </section>}

      {screen === 'reveal' && match && player && <section className={s.centered}>
        <span className={s.eyebrow}>SÓ VOCÊ PODE VER</span><div className={s.progress} aria-label={`Jogador ${playerIndex + 1} de ${match.players.length}`}>{match.players.map((p, i) => <span key={p.id} className={i <= playerIndex ? s.progressActive : ''} />)}</div>
        <p className={s.muted}>Passe o celular para</p><h1 ref={headingRef} tabIndex={-1} className={s.playerName}>{player.name}</h1><p className={s.muted}>Jogador {playerIndex + 1} de {match.players.length}. Os outros, olhem para o lado.</p>
        <button type="button" className={`${s.secretCard} ${visible ? (isImpostor ? s.impostorCard : s.wordCard) : ''}`} aria-label="Segure para revelar sua informação" onPointerDown={press} onPointerUp={() => setVisible(false)} onPointerCancel={() => setVisible(false)} onLostPointerCapture={() => setVisible(false)} onPointerLeave={() => setVisible(false)} onKeyDown={keyPress} onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') setVisible(false); }} onBlur={() => setVisible(false)} onContextMenu={e => e.preventDefault()}>
          {visible ? isImpostor ? <><Mask small /><span className={s.eyebrow}>VOCÊ É O IMPOSTOR</span><span className={s.cardDescription}>Sua dica é</span><strong className={s.secretWord}>{match.hint}</strong><small>Disfarce e tente descobrir a palavra.</small></> : <><Mask small /><span className={s.eyebrow}>A PALAVRA É</span><strong className={s.secretWord}>{match.word.palavra}</strong><small>Guarde essa informação com você.</small></> : <><Mask small /><span className={s.secretTitle}>Seu segredo está aqui.</span><span className={s.cardDescription}>Segure este card para revelar.</span><small>Soltou? A informação fica escondida.</small></>}
          <span className={s.cardAction}>{visible ? 'Solte para esconder' : 'Segure para revelar'}</span>
        </button>
        <button className={s.secondary} disabled={!seen || visible} onClick={nextPlayer}>{playerIndex === match.players.length - 1 ? 'Iniciar rodada' : 'Próximo jogador'} <span aria-hidden="true">→</span></button>
        <p className={s.helper}>{!seen ? 'Veja sua informação antes de continuar.' : visible ? 'Solte o card para esconder sua informação.' : playerIndex === match.players.length - 1 ? 'Tudo pronto. Inicie a rodada quando quiser.' : 'Informação escondida. Continue e passe o celular.'}</p>
      </section>}

      {screen === 'play' && match && <section className={s.centered}>
        <span className={s.eyebrow}><span className={s.dot} /> PARTIDA VALENDO</span><h1 ref={headingRef} tabIndex={-1}>Que comece<br />a desconfiança<span className={s.lime}>.</span></h1><p className={s.muted}>Celular na mesa. Agora é com vocês.</p>
        <div className={s.starter}><span>QUEM COMEÇA</span><strong>{match.startingPlayer.name}</strong><span aria-hidden="true">↗</span></div>
        <div className={s.rules}><div><span className={s.ruleIcon}>↻</span><p><strong>Votação após {match.rounds} rodadas</strong><span>Uma rodada é uma volta completa: todos falam uma vez.</span></p></div><div><span className={s.ruleIcon}>◇</span><p><strong>Impostor, escolha sua hora</strong><span>Você só pode tentar adivinhar a palavra na sua vez de falar.</span></p></div><div><span className={s.ruleIcon}>☷</span><p><strong>A decisão é do grupo</strong><span>Conversem e votem. Revelem o segredo quando terminarem.</span></p></div></div>
        <button ref={revealResultRef} className={s.primary} onClick={() => setConfirm(true)}>Revelar impostor <span aria-hidden="true">↗</span></button><p className={s.helper}>O segredo continua escondido até vocês decidirem.</p>
      </section>}

      {screen === 'result' && match && <section className={s.centered}><span className={s.eyebrow}>MISTÉRIO RESOLVIDO</span><h1 ref={headingRef} tabIndex={-1}>Fim do blefe<span className={s.lime}>.</span></h1><p className={s.muted}>E aí, vocês desconfiaram da pessoa certa?</p><div className={s.resultCard}><Mask small /><span className={s.eyebrow}>{match.impostorIds.length === 1 ? 'O IMPOSTOR ERA' : 'OS IMPOSTORES ERAM'}</span><h2 className={s.impostorName}>{match.players.filter(p => match.impostorIds.includes(p.id)).map(p => p.name).join(' & ')}</h2><div className={s.resultWord}><span>A PALAVRA SECRETA</span><strong>{match.word.palavra}</strong><small>Dica: {match.hint}</small></div></div><button className={s.primary} onClick={() => { setMatch(null); setScreen('settings'); }}>Recomeçar jogo <span aria-hidden="true">↗</span></button><p className={s.helper}>Essa palavra fica fora das próximas partidas.</p></section>}
    </main>
    <footer className={s.footer}><span>FEITO PARA JOGAR JUNTO.</span><span>O segredo fica entre nós. <span className={s.lime}>✳</span></span></footer>
    {confirm && <div className={s.backdrop} onClick={closeConfirm}><section className={s.dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Tab') { const buttons = [...e.currentTarget.querySelectorAll('button')]; const first = buttons[0]; const last = buttons[buttons.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}><span className={s.eyebrow}>ÚLTIMA CHANCE DE BLEFAR</span><h2 id="dialog-title">O grupo já terminou?</h2><p>Isso vai mostrar os impostores e a palavra secreta para todo mundo.</p><button className={s.primary} onClick={() => { setConfirm(false); setScreen('result'); }}>Sim, revelar o segredo ↗</button><button ref={cancelRef} className={s.secondary} onClick={closeConfirm}>Continuar jogando</button></section></div>}
  </div>;
}
