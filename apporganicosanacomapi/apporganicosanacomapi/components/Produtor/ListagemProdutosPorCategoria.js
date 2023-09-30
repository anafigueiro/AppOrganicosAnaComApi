import React, { useState, useEffect } from 'react';
import ConnectAPI from '../config/ConnectAPI';
import { CommonActions } from '@react-navigation/native';

import {
  Box,
  Text,
  HStack,
  VStack,
  List,
  ScrollView,
  useColorMode,
  Image,
} from 'native-base';

const ListagemProdutosPorCategoria = ({ categoria_id, navigation }) => {
  console.log('ListagemProdutosPorCategoria');
  console.log(categoria_id);
  const [data, setData] = useState([]);

  const loadData = async (categoria_id = 0) => {
    try {
      const response = await ConnectAPI.call(
        'produto-por-tipo/' + categoria_id
      );
      setData(response.data[0].produtos);
      console.log(response.data[0])
    } catch (error) {
      console.error(error); 
    }
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

  useEffect(() => {
    loadData(categoria_id);
  }, [categoria_id]);

  return (
    <>
      {console.log(data)}
      {/* Listagem de todos os tipo-produto cadastrados  */}
      <VStack style={{width:'90%', space:5, alignSelf:'center', backgroundColor:'white'}}>
        <ScrollView
          contentContainerStyle={{ width: '100%', backgroundColor:'white' }}
          horizontal>
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
                  console.log('pressionou');
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ProdutoDetalhe',
                      params: {
                        item: item || null,
                        produtorObj: null, 
                      },
                    })
                  );
                  /*
                  navigation.navigate('ProdutoDetalhe', {
                    item: item || null,
                    produtorObj: null,
                  });
                  */
                }}
                _hover={{ bg: 'coolGray.300' }}>
                <Box
                style={{
                  borderRadius:0,
                  shadowRadius:0,
                  width:'100%',
                  border:0,
                  margin:0, 
                  padding:2
                }}>
                  <HStack style={{justifyContent:'flex-start'}}>
                    <Box style={{borderRadius:0, shadowRadius:0, alignItems:'center'}}>
                      <Image
                        size="60"
                        style={{borderRadius:5}}
                        source={checkImagemParam(item)}
                      />
                      {console.log(item.imagem)}
                      <VStack>
                        <Text
                        style={{alignSelf:'center', fontWeight:'bold'}}
                          _dark={{
                            color: 'warmGray.50',
                          }}
                          color="coolGray.800">
                          {item?.nome}
                        </Text>
                        <Text
                           style={{alignSelf:'center'}}
                          color="coolGray.600"
                          _dark={{
                            color: 'warmGray.200',
                          }}>
                          {item?.preco}
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
    </>
  );
};

export default ListagemProdutosPorCategoria;
