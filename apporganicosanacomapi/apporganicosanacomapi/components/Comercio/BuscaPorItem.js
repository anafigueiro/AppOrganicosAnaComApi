import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConnectAPI from '../config/ConnectAPI';

import {
  Icon,
  Text,
  Input,
  HStack,
  Avatar,
  VStack,
  Spacer,
  List,
  Image,
  Box,
  ScrollView,
  View,
  useColorMode,
} from 'native-base';

const BuscaPorItem = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const loadData = async () => {
    try {
      const response = await ConnectAPI.call('comercio-produto/0'); //0 carrega todos
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
    setCarregando(false);
  };

  useState(() => {
    loadData();
  });

  const img = require('../../assets/sem_imagem.jpg');

  const checkImagemParam = (item) => {
    try {
      if (item.length === 0 || item.imagem == null) {
        //console.log('img');
        return img;
      } else if (item.imagem.includes('https')) {
        // console.log('Palavra "https" encontrada na URL');
        return { uri: item.imagem };
      } else {
        let img = item.imagem
          ? ConnectAPI.urlFile() + item.imagem
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU';
        return { uri: img };
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchData = (text) => {
    if (text) {
      const newArray = data.filter((item) => {
        const itemData = item.nome ? item.nome.toUpperCase() : ''.toUpperCase();
        console.log(text);
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearch(text);
      setData(newArray);
      console.log(data);
    } else {
      loadData();
      setSearch(null);
    }
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          alignSelf: 'flex-start',
          backgroundColor: 'white',
        }}>
        <Input
          placeholder="Pesquisar"
          value={search}
          onChangeText={(value) => searchData(value)}
          onClear={(text) => searchData('')}
          style={{
            width: '100%',
            borderRadius: 4,
            fontSize: 14,
          }}
          py="3"
          px="1"
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<FontAwesome name="search" />}
            />
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
        <List>
          {data?.map((item, index) => (
            <List.Item
              style={{
                justifyContent: 'flex-start',
                width: '95%',
                alignSelf: 'center',
                borderBottomWidth: 1,
              }}
              key={index}
              onPress={() => {
                navigation.navigate('ProdutosComercio', {
                  item: item || null,
                });
              }}
              _hover={{ bg: 'coolGray.300' }}>
              <VStack style={{ width: 280, alignSelf: 'center' }}>
                <HStack
                  space={[3, 0]}
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Avatar size="58" source={checkImagemParam(item)} />
                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      {item.nome}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {item.descricao || 'Descrição'}
                    </Text>
                  </VStack>
                </HStack>

                <HStack
                  style={{ width: '100%', alignSelf: 'flex-start' }}
                  space={5}>
                  <ScrollView
                    contentContainerStyle={{ width: '100%' }}
                    horizontal>
                    <List
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        border: 0,
                      }}>
                      {item.produtos.map((subItem, index) => (
                        <List.Item
                          key={index}
                          onPress={() => {
                            navigation.navigate('ProdutoDetalhe', {
                              item: subItem || null,
                              produtorObj: null,
                              comercioObj: item,
                            });
                          }}
                          _hover={{ bg: 'coolGray.300' }}>
                          <Box
                            style={{
                              borderRadius: 0,
                              shadowRadius: 0,
                              width: '100%',
                              border: 0,
                              padding: 2,
                            }}>
                            <HStack
                              style={{
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Image
                                size="60"
                                style={{ borderRadius: 5 }}
                                source={checkImagemParam(subItem)}
                              />
                              <VStack>
                                <Text
                                  style={{
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                  }}
                                  _dark={{
                                    color: 'warmGray.50',
                                  }}
                                  color="coolGray.800">
                                  {subItem.nome}
                                </Text>
                                <Text
                                  style={{ alignSelf: 'center' }}
                                  color="coolGray.600"
                                  _dark={{
                                    color: 'warmGray.200',
                                  }}>
                                  R$
                                  {subItem.preco}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>
                        </List.Item>
                      ))}
                    </List>
                  </ScrollView>
                </HStack>
              </VStack>
              <Spacer />
            </List.Item>
          ))}
        </List>
      </ScrollView>
    </>
  );
};

export default BuscaPorItem;
