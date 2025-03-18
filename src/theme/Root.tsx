import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createSystem } from '@chakra-ui/react';
import { defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider, SetColorModeFromLocalStorage } from '../components/ui/color-mode';

const system = createSystem(defaultConfig, { preflight: false })

export default function Root({children}) {
  return (
    <ChakraProvider value={system}>
        <ColorModeProvider>
          <SetColorModeFromLocalStorage />
          {children}
        </ColorModeProvider>
    </ChakraProvider>
  );
}