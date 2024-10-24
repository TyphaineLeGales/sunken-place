import React, { createContext, useState, useContext, useEffect } from 'react';

export const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [audioEnabled, setAudioEnabled] = useState(true); // Pour la production, laisser à 'true'
  const [sounds, setSounds] = useState({});

  useEffect(() => {
    const audioFiles = {
      ambiance: {
        background: new Audio('fx/ambiance/background.mp3'),
        menu: new Audio('fx/ambiance/menu.mp3'),
        startGame: new Audio('fx/ambiance/start-game.mp3'),
        end: new Audio('fx/ambiance/end.mp3'),
      },
      actions: {
        coton: new Audio('fx/actions/coton.mp3'),
        shoot: new Audio('fx/actions/shoot.mp3'),
        spoon: new Audio('fx/actions/spoon.mp3'),
        wave1: new Audio('fx/actions/wave-1.mp3'),
        wave2: new Audio('fx/actions/wave-2.mp3'),
        ultiChrisStart: new Audio('fx/actions/ulti-chris-start.mp3'),
        ultiChrisEnd: new Audio('fx/actions/ulti-chris-end.mp3'),
        jauge: new Audio('fx/actions/jauge.wav'),
        tic: new Audio('fx/actions/tic.mp3'),
        tac: new Audio('fx/actions/tac.mp3'),
        ultiMissyStart: new Audio('fx/actions/ulti-missy-start.mp3'),
      },
      voices: {
        chris: new Audio('fx/voices/chris.mp3'),
        iCantMove: new Audio('fx/voices/i-cant-move.mp3'),
        paralysed: new Audio('fx/voices/paralysed.mp3'),
        swallowed: new Audio('fx/voices/swallowed.mp3'),
      },
    };
    setSounds(audioFiles);
  }, []);

  // Fonction pour jouer un son
  const playSound = (category, name, loop = false) => {
    if (audioEnabled && sounds[category] && sounds[category][name]) {
      sounds[category][name].loop = loop; // Définit la boucle du son
      sounds[category][name].play();
    }
  };

  // Fonction pour arrêter un son
  const stopSound = (category, name) => {
    if (sounds[category] && sounds[category][name]) {
      sounds[category][name].pause();
      sounds[category][name].currentTime = 0;
    }
  };

  // Fonction pour définir le volume d'un son
  const setVolume = (category, name, volume) => {
    if (sounds[category] && sounds[category][name]) {
      sounds[category][name].volume = volume;
    }
  };

  // Fonction pour activer ou désactiver la boucle d'un son
  const setLoop = (category, name, loop) => {
    if (sounds[category] && sounds[category][name]) {
      sounds[category][name].loop = loop;
    }
  };

  const gameState = {
    audioEnabled,
    setAudioEnabled,
    playSound,
    stopSound,
    setVolume,
    setLoop, // Ajout de la fonction pour contrôler la boucle
  };

  return <AudioContext.Provider value={gameState}>{children}</AudioContext.Provider>;
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudioContext must be used inside a `AudioProvider`');
  return context;
}
