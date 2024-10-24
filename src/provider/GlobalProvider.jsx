import React, { createContext, useContext } from 'react';

import { GameStateProvider } from './GameStateProvider';
import { InitProvider } from './InitProvider';
import { AudioProvider } from './AudioProvider';
import { DirectionProvider } from './DirectionProvider';
import { TextureProvider } from './TextureProvider';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const providers = [AudioProvider, TextureProvider, GameStateProvider, DirectionProvider, InitProvider].reverse();
  const initialValue = {};

  return (
    <GlobalContext.Provider value={initialValue}>
      {providers.reduce(
        (children, Provider) => (
          <Provider>{children}</Provider>
        ),
        children
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw Error('useDaronContext must be used inside a `DaronProvider`');
  return context;
};
