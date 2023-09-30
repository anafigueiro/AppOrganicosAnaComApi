import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Box,
  Text,
  HStack,
  Avatar,
  Stack,
  VStack,
  Spacer,
  List,
  NativeBaseProvider,
  Fab,
  Button,
  FormControl,
  Image,
  Input,
  ScrollView,
  Modal,
  useColorMode,
} from 'native-base';

export default function ConfirmarPedido({ navigation }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState('0');
  const [produtor, setProdutor] = useState({});
  const [obs, setObs] = useState('');

  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const [pedido, setPedido] = useState({
    produtor: produtor,
    // observacao: '',
    itens: [],
    endereco: {},
  });

  const loadData = async () => {
    try {
      //await AsyncStorage.clear();

      const pedidoAS = await AsyncStorage.getItem('pedido');
      let dataPedido = (await JSON.parse(pedidoAS)) || [];

      setProdutor(dataPedido.produtor);
      console.log(dataPedido);

      if (dataPedido.itens.length !== 0) {
        var newDataPedido = [];

        //conta a quantidade de itens iguais separados por objeto em um novo vetor
        dataPedido.itens.map((item) => {
          if (newDataPedido.some((el) => el.id === item.id) === false) {
            //verifica se os itens dos objetos são iguais

            item.obs = obs;
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
          total: calcTotal,
          endereco: dataPedido.endereco,
          observacao: obs,
        });
      }
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

  const saveData = async () => {
    try {
      console.log('Pedido:');
      let p = pedido;
      p.observacao = obs;
      setPedido(p);
      console.log(p);
      await AsyncStorage.setItem('pedido', JSON.stringify(pedido));
      navigation.navigate('FinalizarPedido');
    } catch (error) {
      console.error(error);
    }
  };

  const cancelarPedido = async () => {
    await AsyncStorage.clear();
    setShowModal2(false);
    navigation.push('BuscaGeral');
  };

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
            <Button.Group alignItems="center">
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
      {/* Mostra o pedido para confirmação*/}
      <ScrollView
        contentContainerStyle={{ width: '100%', backgroundColor:'white' }}>
        <HStack
          style={{
            margin:4,
            paddingBottom:5,
            borderBottomWidth:1,
            borderColor:'grey'
          }}>
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
                navigation.navigate('ProdutosProdutor', { item: produtor });
              }}
              style={{fontSize:12, color: 'grey', marginLeft:3, textDecorationLine:'underline'}}>
              Adicionar mais itens
            </Text>
          </VStack>
        </HStack>

        <Text style={{margin:2, fontWeight:'bold'}}>
          Pedido:
        </Text>

        <List px={3} py={0} style={{border:0, width:'100%'}}>
          {data?.map((item, index) => (
            <List.Item
              style={{
                backgroundColor:'#CBEDD1',
                marginTop:2,
                borderRadius:10,
              }}
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

        <Box
        style={{
          width:'100%',
          flexDirection:'row',
          alignItems:'space-between',
          alignContent:'center',
          margin:5
        }}>
          <Text style={{fontSize:15, marginLeft:8}}>
            Valor total do pedido:
          </Text>
          <Text style={{fontSize:15, marginLeft:1}}>
            R${total}
          </Text>
        </Box>

        <Box style={{ margin:5}}>
          <FormControl>
            <FormControl.Label>
              <Text style={{fontSize: 14, textAlign:'flex-start', fontWeight:'bold'}}>
                Observação
              </Text>
            </FormControl.Label>

            <Input
            style={{marginTop:3, height:70, font:12}}
              placeholder="Observação"
              value={obs}
              onChangeText={(value) => setObs(value)}
            />
          </FormControl>
        </Box>

        {console.log(obs)}

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
            onPress={saveData}
            renderInPortal={false}
            shadow={6}
            colorScheme="green"
            placement="bottom"
            right={0}
            size="sm"
            style={{borderRadius:10, height:10, paddingLeft:'40%', paddingRight:'40%'}}
            label={
              <Text style={{color:'white',fontSize:'sm'}}>
                Confirmar pedido
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
            size="sm"
            style={{borderRadius:10, height:10, paddingLeft:'40%', paddingRight:'40%', marginTop:'5%'}}
            label={
              <Text style={{color:'white',fontSize:'sm'}}>
                Cancelar Pedido
              </Text>
            }
          />
        </Stack>
      </ScrollView>
    </NativeBaseProvider>
  );
}