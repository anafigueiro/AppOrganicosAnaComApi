import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import ConnectAPI from '../config/ConnectAPI';

import {
  Box,
  Icon,
  Text,
  Input,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Stack,
  Image,
  Fab,
  List,
  Divider,
  NativeBaseProvider,
  View,
  ScrollView,
  useColorMode,
  Heading,
} from 'native-base';

export default function EnderecosUsuario({ route }) {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const values = await AsyncStorage.getItem('@usuario');
      let usuario = await JSON.parse(values);
      if (usuario) {
        setData(usuario); 
      } //data = usuario

      const response = await ConnectAPI.call(
        'usuario-endereco/' + usuario.usuario_id
      );
      
      setData(response.data[0]);
      console.log('Endereços');
      console.log(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useState(() => {
    loadData();
  });

  return (
    <NativeBaseProvider>
      {console.log('dataaaaa')}
      {console.log(data)}
      <Heading size="md">
        Nome: {data.name}, Id usuario: {data.usuario_id}
      </Heading>
      <>
        <ScrollView contentContainerStyle={{ width: '100%' }} marginTop="15px">
          <HStack
            alignSelf="center"
            style={styles.endereco}
            w="90%"
            py={3}
            px={3}>
            <VStack>
              <Text style={{ fontWeight: 'bold' }}>
                Usar Localização atual:{' '}
              </Text>
              <Text>Usar Localização atual </Text>
            </VStack>
          </HStack>

          <List
            style={styles.back}
            px={3}
            // mt={12}
            py={3}
            // borderColor="red.200"

            alignSelf="center"
            w="90%"
            marginTop="10px">
            {data?.enderecos?.map((item, index) => (
              <List.Item
                key={index}
                onPress={() => {
                  navigation.navigate('EnderecoFormulario', {
                    item: item || null,
                  });
                  // alert('Teste ' + item.enderecos[0].tipo + ' - ' + item.id);
                }}
                style={styles.endereco}
                w="95%"
                alignSelf="center">
                <Box pl={['0', '4']} pr={['0', '5']} py="2">
                  <HStack space={[3, 0]} justifyContent="space-between">
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        Endereço {index + 1}:
                      </Text>

                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {item.municipio.nome}, {item.bairro}, {item.rua},
                      </Text>

                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {item.numero},{item.complemento}, {item.cep}
                      </Text>
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {item.ponto_referencia}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </List.Item>
            ))}
          </List>
        </ScrollView>
        <Fab
          placement="bottom-right"
          colorScheme="blue"
          size="lg"
          renderInPortal={false}
          icon={<Icon as={FontAwesome} name="plus" size="sm" />}
          onPress={() =>
            navigation.navigate('EnderecoFormulario', { item: '' })
          }
        />
      </>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  back: {
    backgroundColor: '#CBEDD1',
  },
  endereco: {
    marginTop: '5px',
    backgroundColor: '#8fbc8f',
    borderRadius: '5px',
  },
});