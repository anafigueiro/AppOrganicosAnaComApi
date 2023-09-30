import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConnectAPI from '../config/ConnectAPI';

//Import da segunda aba da página - vai buscar por item do comercio
import BuscaPorItem from './BuscaPorItem';

import {
  Icon,
  Text,
  Input,
  HStack,
  Avatar,
  VStack,
  List,
  ScrollView,
  Fab,
  View,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

export default function BuscaPorComercioItem({ navigation, route }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(null);
  const [enableButton, setEnableButton] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { param } = route.params || '';

  const loadData = async () => {
    try {
      let response;
      if (param !== null) {
        console.log('param');
        console.log(param);
        response = await ConnectAPI.call(
          'produto/search/' + param,
          {nome: param} ,
          'POST'
        );
      } else {
        console.log("entrou")
        response = await ConnectAPI.call('comercio-produto/0');
      }
       
      //console.log(response.data)
      setData(response.data);

      let pedidoAS = await AsyncStorage.getItem('pedido');
      if (pedidoAS) {
        setEnableButton(true);
      } else {
        setEnableButton(false);
      }
    } catch (error) {
      console.error(error);
    }
    setCarregando(false);
  };

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

  const ListagemComercio = () => (
    <>
      <View style={{width:'100%', alignSelf:'flex-start', backgroundColor:'white'}}>
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
        contentContainerStyle={{ width: '100%' }}
        style={{backgroundColor:'white'}}>
        <List px={3} py={0} style={{borderWidth: 0, borderRightWidth:0, width:'100%'}}>
          {data?.map((item, index) => (
            <List.Item
              style={{borderBottomWidth:1}}
              key={index}
              onPress={() => {
                navigation.navigate('ProdutosComercio', { item: item || null }
                );
              }}
              _hover={{ bg: 'coolGray.300' }}>
              <View pl={['0', '4']} pr={['0', '5']} py="2">
                <HStack
                  space={[3, 0]}
                  style={{justifyContent: 'space-between', alignContent:'center'}}>
                  <Avatar
                    size="58"
                    source={checkImagemParam(item)}
                  />
                  <VStack style={{justifyContent:'center'}}>
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
              </View>
            </List.Item>
          ))}
        </List>
      </ScrollView>

      {enableButton ? (
        <Fab
          onPress={() => navigation.navigate('VerSacola')}
          renderInPortal={false}
          shadow={6}
          colorScheme="green"
          placement="bottom-left"
          right={4}
          style={{height: 10, borderRadius: 10}}
          size="sm"
          icon={<Icon as={FontAwesome} name="shopping-cart" size="5" />}
          label={
            <Text color="white" fontSize="sm">
              Ver Sacola
            </Text>
          }
        />
      ) : (
        <> </>
      )}
    </>
  );

  return (
    <Tab.Navigator>
      <Tab.Screen name="Comercio" component={ListagemComercio} />
      <Tab.Screen name="Itens" component={BuscaPorItem} />
    </Tab.Navigator>
  );
}
