import React, { useState, useEffect } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectAPI from '../config/ConnectAPI';
import { Linking } from 'react-native';

import {
  Box,
  Text,
  HStack,
  Avatar,
  VStack,
  Spacer,
  List,
  Fab,
  Stack,
  NativeBaseProvider,
  Button,
  Image,
  Modal,
  Icon,
  ScrollView,
  useColorMode,
} from 'native-base';

export default function FinalizarPedido({ navigation }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState('');
  const [produtor, setProdutor] = useState({});
  const [endereco, setEndereco] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  //save data para salvar os dados do pedido no banco
  const saveData = async () => {
    setShowModal2(true);

    try {
      const pedidoAS = await AsyncStorage.getItem('pedido');
      let dataPedido = (await JSON.parse(pedidoAS)) || [];

      const timeElapsed = Date.now();
      let date = new Date(timeElapsed);
      date =
        /*
       // date.toLocaleDateString() +
        ' - ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds();
*/
        console.log(date);

      let itens = dataPedido.itens.map((item) => {
        return {
          estoque_id: item.estoque_id,
          desconto: item.desconto,
          quantidade: item.quantidade,
        };
      });

      let pedido = {
        endereco_id: dataPedido.endereco.id,
        usuario_id: 1,
        status: 'ABERTO',
        numero_pedido: 1,
        total_valor: total,
        itens: itens,
        observacao: dataPedido.observacao,
      };

      console.log(pedido);
      const response = await ConnectAPI.call(
        'pedido', // nome da url
        pedido, // objeto
        'POST' // method
      );
    //  console.log('Pedido');
      //console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const finalizar = async () => {
    await AsyncStorage.clear();
    setShowModal2(false);
    navigation.push('BuscaGeral');
  };

  //load data para carregar os dados do pedido do async storage
  const loadData = async () => {
    try {
      const pedidoAS = await AsyncStorage.getItem('pedido');
      let dataPedido = (await JSON.parse(pedidoAS)) || [];
      console.log(dataPedido);
      setTotal(dataPedido.total);
      console.log(dataPedido.total);
      setProdutor(dataPedido.produtor);
      setEndereco(dataPedido.endereco);
      console.log(dataPedido.endereco.nome);
      setData(dataPedido.itens);
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

  useState(() => {
    loadData();
  });

  return (
    <NativeBaseProvider backgroundColor="white">
      {/* Mostra o pedido para confirmação*/}
      <ScrollView
        contentContainerStyle={{ width: '100%', backgroundColor:'white' }}>
        <Text style={{margin:2, marginTop:8, fontWeight:'bold'}}>
          Pedido finalizado:
        </Text>

        <List px={3} py={0} style={{border:0, width:'100%'}}>
          {data?.map((item, index) => (
            <List.Item
            style={{backgroundColor:'#CBEDD1', marginTop:2, borderRadius:10}}
              key={index}
              onPress={() => {
                navigation.navigate('ProdutoDetalhe', {
                  item: item,
                  produtorObj: produtor,
                });
              }}
              _hover={{ bg: 'coolGray.300' }}>
              <Box pl={['0', '4']} pr={['0', '5']} py="2">
                <HStack space={[3, 0]} style={{justifyContent:'space-between'}}>
                  <Image
                    size="58"
                    style={{borderRadius:10}}
                    source={checkImagemParam(item)}
                  />
                  <VStack>
                    <Text bold>{item.nome}</Text>
                    <Text>R${item.preco}</Text>
                    <Text>Quantidade: {item.quantidade} </Text>
                  </VStack>
                  <Spacer />
                </HStack>
              </Box>
            </List.Item>
          ))}
        </List>

        <HStack
        style={{
          margin:4,
          marginTop:8,
          backgroundColor:'#3eb863',
          alignItems:'center',
          flex:1,
          flexDirection:'row',
          justifyContent:'center'
        }}>
          <Text
          style={{
            fontSize:15,
            fontWeight:'bold',
            color:'white',
            margin:2,
            alignItems:'center',
            textAlign:'center',
          }}>
            TOTAL = R$ {total}
          </Text>
        </HStack>

        {/*Sessão do pop up com confirmação de finalização de pedido */}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content style={{maxWidth:400}}>
            <Modal.CloseButton />

            <Modal.Header>Confirmação de pedido </Modal.Header>

            <Modal.Body>
              Você tem certeza que deseja finalizar o pedido?
            </Modal.Body>

            <Modal.Footer>
              <Button.Group style={{alignItems:'center'}}>
                <Button colorScheme="green" onPress={() => saveData()}>
                  {/*onPress={() => {setShowModal2(true)}}>*/}
                  Sim
                </Button>
                <Button
                  colorScheme="green"
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Não
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/*Sessão do pop up 2 com finalização de pedido e chama a função finalizar */}

        <Modal isOpen={showModal2} onClose={() => setShowModal2(false)}>
          <Modal.Content style={{maxWidth:400}}>
            <Modal.Header>Pedido finalizado com sucesso! </Modal.Header>

            <Modal.Body>
              Obrigado(a) pela preferência. Entre em contato com o produtor para
              mais detalhes.
            </Modal.Body>

            <Modal.Footer>
              <Button.Group style={{alignItems:'center'}}>
                <Button colorScheme="green" onPress={() => finalizar()}>
                  Sair
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <HStack
          onPress={() => {
            navigation.navigate('SelecionarEntregaRetirada');
          }}
          style={{
            marginTop:8,
            margin:4,
            padding:2,
            borderBottomWidth:1,
            borderTopWidth:1,
            borderColor:'grey',
          }}>
          <Image
            size="50"
            style={{borderRadius:10, margin: 1}}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2776/2776063.png',
            }}
          />
          <VStack style={{justifyContent:'center'}}>
            <Text style={{fontWeight:'bold', marginLeft:2, justifyContent:'center'}}>
              {endereco?.nome || ''}
            </Text>
          </VStack>
        </HStack>

        <Text style={{marginLeft:4, fontWeight:'bold'}}>
          Contate o produtor:
        </Text>

        <HStack
        style={{
          margin:4,
          paddingBottom:4,
          borderBottomWidth:1,
          borderColor:'grey',
          justifyContent:'space-around'
        }}>
          <HStack>
            <Avatar
              size="58"
              source={checkImagemParam(produtor)}
            />
            <VStack style={{justifyContent:'center'}}>
              <Text style={{fontWeight:'bold', marginLeft:3}}>
                {produtor.nome || ''}
              </Text>
              <Text style={{marginLeft:3}}>{produtor.telefone1 || ''}</Text>
            </VStack>
          </HStack>

          <HStack style={{justifyContent:'flex-end'}}>
            <Button
              colorScheme="green"
              style={{alignSelf:'flex-end'}}
              leftIcon={<Icon as={FontAwesome} name="whatsapp" size="lg" />}
              onPress={() =>
                Linking.canOpenURL(
                  'https://wa.me//' +
                    produtor.telefone1 +
                    '?text=Tenho%20interesse%20em%20comprar%20seu%20carro'
                ).then((supported) => {
                  if (supported) {
                    return Linking.openURL(
                      'https://wa.me//' +
                        produtor.telefone1 +
                        '?text=Tenho%20interesse%20em%20comprar%20seu%20carro'
                    );
                  } else {
                    return Linking.openURL(
                      'https://api.whatsapp.com/send?phone=5531999999999&text=Oi'
                    );
                  }
                })
              }></Button>
          </HStack>
        </HStack>

        <Stack
          style={{
            backgroundColor: '#CBEDD1',
            marginTop: '5%',
            padding: '10%',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Fab
            onPress={() => setShowModal(true)}
            renderInPortal={false}
            shadow={6}
            colorScheme="green"
            placement="bottom"
            right={0}
            style={{
              paddingRight:'40%',
              paddingLeft:'40%',
              height:10,
              borderRadius:10,
            }}
            size="sm"
            label={
              <Text color="white" fontSize="sm">
                Finalizar pedido
              </Text>
            }
          />
        </Stack>
      </ScrollView>
    </NativeBaseProvider>
  );
}
