import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from 'native-base';

import Rotas from './routes/Rotas';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#5B8DF6',
      800: '#ffffff',
      700: '#ffffff',
    }, 
  },
});

//https://random-data-api.com/api/v2/users
export default function App() { 
  return (
    <NativeBaseProvider theme={theme}>
      <Rotas />
    </NativeBaseProvider>
  );
}
