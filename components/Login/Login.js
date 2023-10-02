import React, { useState } from 'react';
import ConnectAPI from '../config/ConnectAPI';
import {
  NativeBaseProvider,
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  Button,
  Image,
  View,
  Text,
  Icon,
} from 'native-base';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; //sistema de armazenamento local que é global para todo o aplicativo

export default function TelaLogin({ navigation }) {
  const [user, setUser] = useState({
    email: 'admin@admin.com',
    password: 'admin@123',
  });

  const [loading, setLoading] = useState(false);

  {
    /*const logar = async () => { */
  }
  {
    /*para logar (salvar os dados na API?), basta chamar essa função*/
  }
  {
    /*setLoading(true); */
  }
  {
    /* para aparecer a tela carregando */
  }
  {
    /*ConnectAPI.call('login', user, 'POST'); */
  }
  {
    /* está passando o objeto user através do método POST para o url 'login' da API (https://data.oesteorganicos.com.br/api/login)*/
  }
  {
    /*};*/
  }

  const logar = async () => {
    setLoading(true);
    console.log(user);
    try {
      var response = await ConnectAPI.call(
        'login', // nome da url
        user, // objeto
        'POST' // method
      );
      console.log('logar');
      console.log(response.data);

      await AsyncStorage.setItem('@usuario', JSON.stringify(response.data)); //armazenando em "usuario" o valor de response.data

      navigation.push('Teste', { item: '' });
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor="#CBEDD1">
        <Box alignItems="center">
          <View maxWidth="130px">
           
          </View>

          <Box w="100%" maxWidth="300px">
            <FormControl isRequired>
              <Stack mx="4">
                <Box>
                  <FormControl isInvalid>
                    <Input
                      type="user"
                      placeholder="Usuário"
                      marginTop="10px"
                      backgroundColor="white"
                      name="email"
                      value={user.email}
                      onChangeText={(value) =>
                        setUser({ ...user, email: value })
                      }
                    />
                  </FormControl>
                </Box>

                <Box>
                  <FormControl isInvalid>
                    <Input
                      marginTop="10px"
                      backgroundColor="white"
                      type="password"
                      name="password"
                      value={user.password}
                      secureTextEntry={true}
                      onChangeText={(value) =>
                        setUser({ ...user, password: value })
                      }
                      placeholder="******"
                    />
                  </FormControl>
                </Box>

                {/*<FormControl.HelperText> No mínimo 6 caracteres. </FormControl.HelperText>*/}
                <FormControl.HelperText>
                  {' '}
                  Problemas com login?{' '}
                </FormControl.HelperText>

                <Box alignItems="center">
                  <Button
                    marginTop="10px"
                    backgroundColor="white"
                    onPress={logar}>
                    {' '}
                    {/* quando clicar no botão login, vai chamar a função "logar" */}
                    <Text colorScheme="dark">Login</Text>
                  </Button>

                  <Button
                    marginTop="10px"
                    backgroundColor="white"
                    onPress={() =>
                      navigation.navigate('Teste', { item: '' })
                    }>
                    <Text colorScheme="dark">Cadastre-se</Text>
                  </Button>
                </Box>

                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>
          </Box>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
