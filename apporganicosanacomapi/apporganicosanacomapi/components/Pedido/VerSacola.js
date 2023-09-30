import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Box,
  Text,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Stack,
  List,
  View,
  NativeBaseProvider,
  Button,
  Image,
  Fab,
  ScrollView,
  Modal,
  useColorMode,
} from 'native-base';

export default function VerSacola({ navigation }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState('0');
  const [produtor, setProdutor] = useState({});
  const [comercio, setComercio] = useState({});
  const [pedido, setPedido] = useState({});
  const [carregando, setCarregando] = useState(true);

  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const loadData = async () => {
    try {
      //await AsyncStorage.clear();

      const pedidoAS = await AsyncStorage.getItem('pedido');
      let dataPedido = (await JSON.parse(pedidoAS)) || [];

      setProdutor(dataPedido.produtor);
      setComercio(dataPedido.comercio);
      setPedido(dataPedido);
      console.log('dataPedido');
      console.error(dataPedido);

      if (dataPedido.itens.length !== 0) {
        var newDataPedido = [];

        //conta a quantidade de itens iguais separados por objeto em um novo vetor
        dataPedido.itens.map((item) => {
          if (newDataPedido.some((el) => el.id === item.id) === false) {
            //verifica se os itens dos objetos são iguais

            item.quantidade = dataPedido.itens.filter(
              (el) => el.id == item.id
            ).length; //conta quantidade de objetos no vetor

            item.preco = item.preco * item.quantidade;

            newDataPedido.push(item);
          }
        });

        //calcular o total dos produtos
        let calcTotal = newDataPedido.reduce((acumulador, item) => {
          if (acumulador != undefined) {
            return acumulador + item.preco;
          } else {
            return 0;
          }
        }, 0);

        setTotal(calcTotal);
        setData(newDataPedido);
        setPedido({
          ...pedido,
          itens: newDataPedido,
          produtor: dataPedido.produtor,
          comercio: dataPedido.comercio,
          total: calcTotal,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setCarregando(false);
  };

  const saveData = async () => {
    try {
      console.log('Pedido:');
      console.log(pedido);

      await AsyncStorage.setItem('pedido', JSON.stringify(pedido));

      navigation.push('SelecionarEntregaRetirada');
    } catch (error) {
      console.error(error);
    }
  };

  const cancelarPedido = async () => {
    await AsyncStorage.clear();
    setShowModal2(false);
    navigation.push('BuscaGeral');
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
    loadData();
  }, []);

  return (
    <NativeBaseProvider>
      <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
        <Modal.Content style={{maxWidth:400}}>
          <Modal.CloseButton />
          <Modal.Header>Cancelamento de pedido </Modal.Header>

          <Modal.Body>
            Você tem certeza que deseja cancelar o pedido?
          </Modal.Body>

          <Modal.Footer>
            <Button.Group style={{alignItems:'center'}}>
              <Button
                colorScheme="green"
                onPress={() => {
                  setShowModal2(true);
                }}>
                Sim
              </Button>
              <Button
                colorScheme="green"
                onPress={() => {
                  setShowModal1(false);
                }}>
                Não
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal2} onClose={() => setShowModal2(false)}>
        <Modal.Content style={{maxWidth:400}}>
          <Modal.Header>Pedido cancelado! </Modal.Header>
          <Modal.Body>
            Seu pedido foi cancelado. Fique tranquilo(a) pois temos mais opções
            de produtos orgânicos para você!
          </Modal.Body>

          <Modal.Footer>
            <Button.Group style={{alignItems:'center'}}>
              <Button colorScheme="green" onPress={() => cancelarPedido()}>
                Sair
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

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

      {/* Mostra a sacola*/}
      <ScrollView
        contentContainerStyle={{ width: '100%', backgroundColor:'white' }}>
        <HStack style={{margin:4}}>
          <Avatar
            size="58"
            source={checkImagemParam(produtor)}
          />
          <VStack style={{marginTop:2}}>
            <Text style={{marginLeft:3, fontWeight:'bold'}}>
              {produtor.nome || ''}
            </Text>
            <Text
              onPress={() => {
                if(comercio!==null)
                {
                  navigation.navigate('ProdutosComercio', { item: comercio });
                }
                else{
                  navigation.navigate('ProdutosProdutor', { item: produtor });
                }
                
              }}
              style={{
                fontSize:12,
                color:'grey',
                marginLeft:3,
                textDecorationLine:'underline'
              }}>
              Adicionar mais itens
            </Text>
          </VStack>
        </HStack>

        <List
          px={3}
          py={0}
          style={{border:0, width:'100%', marginBottom:5}}>
          {data?.map((item, index) => (
            <List.Item
              style={{borderTopWidth:1}}
              key={index}
              onPress={() => {
                navigation.navigate('ProdutoDetalhe', {
                  item: item,
                  produtorObj: produtor,
                  comercioObj: comercio,
                });
              }}
              _hover={{ bg: 'coolGray.300' }}>
              {console.log("item aqui")}
              {console.log(item)}
              <Box pl={['0', '4']} pr={['0', '5']} py="2">
                <HStack space={[3, 0]} justifyContent="space-between">
                  <Image
                    size="58"
                    style={{borderRadius:10}}
                    source={checkImagemParam(item)}
                  />
                 { console.log(item)}
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

        <Stack
          style={{
            backgroundColor: '#CBEDD1',
            marginTop: '8%',
            padding: '8%',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <View
          style={{
            flexDirection:'row',
            justifyContent:'space-between',
            marginBottom:'5%'
          }}>
            <Text style={{fontSize:16}}> Total: </Text>
            <Text  style={{fontSize:16, fontWeight:'bold'}}>
              R${total}
            </Text>
          </View>

          <Fab
            onPress={saveData}
            renderInPortal={false}
            shadow={6}
            colorScheme="green"
            placement="bottom"
            right={0}
            style={{
              paddingRight:'40%',
              paddingLeft:'40%',
              height:10,
              borderRadius:10
            }}
            size="sm"
            label={
              <Text style={{color:'white', fontSize: 'sm'}}>
                Continuar
              </Text>
            }
          />
          <Fab
            onPress={() => setShowModal1(true)}
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
              marginTop:'5%'
            }}
            size="sm"   
            label={
              <Text style={{color:'white', fontSize: 'sm'}}>
                Cancelar Pedido
              </Text>
            }
          />
        </Stack>
      </ScrollView>
    </NativeBaseProvider>
  );
}
