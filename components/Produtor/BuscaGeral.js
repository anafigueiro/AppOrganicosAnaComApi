import React, { useState, useCallback } from 'react';
import ConnectAPI from '../config/ConnectAPI';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native';

import {
  View,
  Box,
  Icon,
  Text,
  Input,
  HStack,
  VStack,
  List,
  ScrollView,
  Image,
  useColorMode,
} from 'native-base';

export default function BuscaGeral({ navigation }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [carregando, setCarregando] = useState(true);

  const loadData = useCallback(async () => {
    setData([]);
    try {
      const response = await ConnectAPI.call('tipo-produto');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
    setCarregando(false);
  }, []);

  const dataFilter = data.filter(
    ({ nome }) => nome.toUpperCase()?.indexOf(search.toUpperCase()) > -1
  );

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log('The Enter key was pressed!');
      navigation.navigate('BuscaPorProdutorItem', { param: search || null });
    }
  };

  useState(() => {
    loadData();
  });

  return (
    <>
      <View w="100%" alignSelf="flex-start" backgroundColor="white">
        <Input
          placeholder="Pesquisar"
          onKeyPress={handleKeyPress}
          value={search}
          onChangeText={(value) => setSearch(value)}
          style={{
            width: '100%',
            borderRadius: 4,
            fontSize: 14,
          }}
          py="3"
          px="1" 
          InputLeftElement={
            <TouchableOpacity
              accessible={true}
              onPress={() =>
                navigation.navigate('BuscaPorProdutorItem', {
                  param: search || null,
                })
              }>
              <Icon
                m="2"
                ml="3"
                size="6"
                color="gray.400"
                as={<FontAwesome name="search" />}
              />
            </TouchableOpacity>
          }
          InputRightElement={
            <Icon
              m="2"
              mr="3"
              size="6"
              color="gray.400"
              as={<FontAwesome name="microphone" />}
            />
          }
        />
      </View>

      <View style={{ backgroundColor: 'white' }}>
        {carregando && (
          <View
            style={{
              backgroundColor: '#CBEDD1',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '3%',
              }}>
              Carregando...
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ width: '100%', backgroundColor: 'white' }}>
        <HStack 
          style={{
            alignItems:'flex-start',
            marginLeft:'5%',
            marginTop: '5%'
          }}>
          <Text style={{ fontSize: 16 , fontWeight: 'bold'}}>
            Categorias
          </Text>
        </HStack>

        <VStack style={{width:'100%', alignSelf:'flex-start'}}>
          <ScrollView contentContainerStyle={{ width: '100%' }}>
            <List
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
                border: 0,
                width: '100%',
              }}
              data={dataFilter}>
              {data?.map((item, index) => (
                <List.Item
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    width: '50%',
                  }}
                  key={index}
                  onPress={() => {
                    navigation.navigate('ListagemProdutorCategoria', {
                      item: item || '',
                    });
                  }}
                  _hover={{ bg: 'coolGray.300' }}>
                  <Box
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems:'center',
                      backgroundColor:'black',
                      borderRadius: 20,
                    }}>
                    <Image
                      size="70"
                      style={{
                        borderRadius: 20,
                        width: 150,
                        opacity: '0.6',
                      }}
                      source={require('../../assets/categorias.jpg')}></Image>
                    <VStack style={{alignItems:'center'}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          position: 'absolute',
                          marginTop: -50,
                          color: '#f5f5f5'
                        }}
                        fontSize="xl">
                        {item?.nome}
                      </Text>
                    </VStack>
                  </Box>
                </List.Item>
              ))}
            </List>
          </ScrollView>
        </VStack>
      </ScrollView>
    </>
  );
}
