import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConnectAPI from '../config/ConnectAPI';

//Import da listagem dos produtores mais pedidos
import ListagemProdutorMaisPedidos from './ListagemProdutorMaisPedidos';
import ListagemProdutosPorCategoria from './ListagemProdutosPorCategoria';

import {
  Box,
  Icon,
  Text,
  Input,
  HStack,
  VStack,
  List,
  ScrollView,
  Image,
  View,
  IconButton,
  useColorMode,
} from 'native-base';

const Tab = createMaterialTopTabNavigator();

//ListagemProdutorCategoria é a página de listagem principal

export default function ListagemProdutorCategoria({ route, navigation }) {
  const { item } = route.params;
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(null);
  const [paramCategoriaId, setParamCategoriaId] = useState(0);
  const [nomeCategoria, setNomeCategoria] = useState('FRUTA');
  const [carregando, setCarregando] = useState(true);

  const loadData = async (id = 0) => {
    let _id = item.id ? item.id : id;
    console.log('loadData');
    console.log(_id);
    console.log(item);
    try {
      /*
      const response = await ConnectAPI.call('produto-por-tipo/' + _id);
      setData(response.data); */

      const response = await ConnectAPI.call('tipo-produto');
      setData(response.data);
      setParamCategoriaId(item.id);
      setNomeCategoria(item.nome.toUpperCase());
      //setDataTP(response.data);
    } catch (error) {
      console.error(error);
    }
    setCarregando(false);
  };

  useState(() => {
    loadData();
  });

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
      <View style={{width: '100%', space:5, alignSelf:'center', backgroundColor:'white'}}>
        <Input
          placeholder="Buscar em Categoria"
          value={search}
          onChangeText={(value) => searchData(value)}
          onClear={(text) => searchData('')}
          style={{
            width:'100%',
            borderRadius:4,
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

        {/* Listagem de todos os tipo-produto cadastrados  */}
        <VStack style={{width:'100%', space:5, alignSelf:'flex-start', backgroundColor:'white'}}>
          <VStack
            style={{
              width:'100%',
              space: 5,
              alignSelf:'flex-start',
              backgroundColor:'white',
              marginTop: '5%',
              marginLeft:'5%'
            }}>
            <Text bold>Categorias disponíveis:</Text>
          </VStack>

          <ScrollView
            contentContainerStyle={{ width: '100%' }}
            horizontal
            backgroundColor="white">
            <List
            style={{
              flexDirection:'row',
              justifyContent:'flex-start',
              border:0,
              width:'100%'
            }}>
              {data?.map((item, index) => (
                <List.Item
                  key={index}
                  onPress={() => {
                    setParamCategoriaId(item.id);
                    setNomeCategoria(item.nome.toUpperCase());
                  }}
                  _hover={{ bg: 'coolGray.300' }}>
                  <Box
                    style={{
                      borderRadius:0,
                      shadowRadius:0,
                      width:'100%',
                      border: 0,
                      padding: 1,
                    }}>
                    <HStack style={{justifyContent:'space-between'}}>
                      <Box
                      style={{
                        borderRadius:0,
                        shadowRadius:0,
                        alignItems:'center'
                      }}>
                        <Image
                        style={{borderRadius:10, width:90}}
                          size="58"
                          source={require('../../assets/categorias.jpg')}
                        />
                        <VStack>
                          <Text
                            _dark={{
                              color: 'warmGray.50',
                            }}
                            color="coolGray.800"
                            style={{padding:1}}>
                            {item?.nome}
                          </Text>
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>
                </List.Item>
              ))}
            </List>
          </ScrollView>
        </VStack>

        <VStack
        style={{
          width:'100%',
          space:5,
          alignSelf:'flex-start',
          marginLeft:4,
          backgroundColor:'white',
        }}>
          <Text>
            Peça a categoria <strong>{nomeCategoria}: </strong>
          </Text>
        </VStack>

        {/* Listagem dos produtos da categoria*/}
        <VStack>
          <ListagemProdutosPorCategoria
            categoria_id={paramCategoriaId}
            navigation={navigation}
          />
        </VStack>

        {/* ----------Ajustar futuramente uma listagem filtrada dos mais pedidos------
      <VStack>
      <Text> Mais pedidos </Text>
      </VStack>
      
      <VStack>
        {<ListagemProdutorMaisPedidos/>}
      </VStack> */}
      </View>
    </>
  );
}
