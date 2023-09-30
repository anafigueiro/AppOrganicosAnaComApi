import React, { useState } from 'react';
import ConnectAPI from '../config/ConnectAPI';

import {
  Text,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Image,
  List,
  NativeBaseProvider,
  View,
  ScrollView,
} from 'native-base';

export default function ProdutosComercio({ navigation, route }) {
  const { item } = route.params;
  const [data, setData] = useState([item]);
  console.log('data');
  console.log(data);

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

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <List>
        {data?.map((item, index) => (
          <List.Item key={index} borderWidth={0}>
            <VStack style={{ width: '100%' }}>
              <HStack
                space={[5, 0]}
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  margin: '5%',
                  border: 0,
                }}>
                <Avatar size="58" source={checkImagemParam(item)} />
                <VStack>
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    style={{
                      color: 'coolGray.800',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {item?.nome}
                  </Text>
                  <Text
                    style={{ color: 'coolGray.600' }}
                    _dark={{
                      color: 'warmGray.200',
                    }}>
                    {item?.descricao || 'Descrição'}
                  </Text>
                </VStack>
              </HStack>

              <VStack style={{ alignItems: 'center' }}>
                <HStack
                  style={{
                    backgroundColor: '#004D0C',
                    margin: '2%',
                    textAlign: 'center',
                    alignSelf: 'center',
                    paddingTop: '2%',
                    paddingBottom: '2%',
                    paddingLeft: '10%',
                    paddingRight: '10%',
                    borderRadius: 10,
                    shadow: 3,
                  }}>
                  <Text style={{ color: 'white' }}> Entrega ou retirada </Text>
                </HStack>

                {/* Mostra todos os produtos do comercio*/}
                <View style={{ margin: '5%', border: 0 }}>
                  <List
                    style={{
                      border: 0,
                      width: '100%',
                      alignItems: 'flex-start',
                    }}>
                    {item?.produtos?.map((subItem, index) => (
                      <List.Item
                        style={{ borderBottomWidth: 1 }}
                        key={index}
                        onPress={() => {
                          navigation.navigate('ProdutoDetalhe', {
                            item: subItem || null,
                            produtorObj: null,
                            comercioObj: item || null,
                          });
                        }}
                        _hover={{ bg: 'coolGray.300' }}>
                        <View
                          style={{
                            width: '100%',
                            padding: '5%',
                          }}>
                          <HStack
                            style={{
                              width: '100%',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                            space={[3, 0]}>
                            <Image
                              size="60"
                              style={{ borderRadius: 5 }}
                              source={checkImagemParam(subItem)}
                            />
                            <VStack>
                              <Text
                                _dark={{
                                  color: 'warmGray.50',
                                }}
                                style={{
                                  color: 'coolGray.800',
                                  fontWeight: 'bold',
                                }}>
                                {subItem.nome}
                              </Text>
                              <Text
                                style={{ color: 'coolGray.600' }}
                                _dark={{
                                  color: 'warmGray.200',
                                }}>
                                R$ {subItem.preco}
                              </Text>
                            </VStack>
                            <Spacer />
                          </HStack>
                        </View>
                      </List.Item>
                    ))}
                  </List>
                </View>
              </VStack>
            </VStack>
          </List.Item>
        ))}
      </List>
    </ScrollView>
  );
}
