import { useEffect, useRef } from "react";
import { categories, wordCount } from "../data/catalog";
import Layout from "../components/Layout/Layout";
import CoverScreen from "../screens/CoverScreen/CoverScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import RevealScreen from "../screens/RevealScreen/RevealScreen";
import PlayScreen from "../screens/PlayScreen/PlayScreen";
import ResultScreen from "../screens/ResultScreen/ResultScreen";
import { useGame } from "./useGame";

export default function App() {
  const game = useGame();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [game.screen, game.playerIndex]);

  return (
    <Layout
      screen={game.screen}
      playerIndex={game.playerIndex}
      onHome={game.openCover}
    >
      {game.screen === "cover" && (
        <CoverScreen
          headingRef={headingRef}
          wordCount={wordCount}
          categoryCount={categories.length}
          onStart={game.openSettings}
        />
      )}
      {game.screen === "settings" && (
        <SettingsScreen
          headingRef={headingRef}
          nameRef={game.nameRef}
          settings={game.settings}
          name={game.name}
          setName={game.setName}
          addPlayer={game.addPlayer}
          onRemovePlayer={game.removePlayer}
          update={game.update}
          categories={categories}
          availableCount={game.availableCount}
          usedCount={game.usedCount}
          error={game.error}
          start={game.start}
        />
      )}
      {game.screen === "reveal" && game.match && (
        <RevealScreen
          key={game.playerIndex}
          headingRef={headingRef}
          match={game.match}
          playerIndex={game.playerIndex}
          nextPlayer={game.nextPlayer}
        />
      )}
      {game.screen === "play" && game.match && (
        <PlayScreen
          headingRef={headingRef}
          match={game.match}
          onReveal={game.revealResult}
        />
      )}
      {game.screen === "result" && game.match && (
        <ResultScreen
          headingRef={headingRef}
          match={game.match}
          onRestart={game.restart}
        />
      )}
    </Layout>
  );
}
