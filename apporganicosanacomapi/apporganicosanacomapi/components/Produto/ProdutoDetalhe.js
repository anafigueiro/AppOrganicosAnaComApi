import React, { useState, useEffect } from 'react';

import {
  Stack,
  Button,
  Text,
  ScrollView,
  View,
  Image,
  Fab,
  Modal,
  NativeBaseProvider,
  Select,
} from 'native-base';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectAPI from '../config/ConnectAPI';

export default function ProdutoDetalhe({ route, navigation }) {
  const { item, produtorObj, comercioObj } = route.params;
  const [enableButton, setEnableButton] = useState(false);
  const [count, setCount] = useState(0);
  const [unidade_medida, setUnidade_medida] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pesoEstimadoCount, setPesoEstimadoCount] = useState(0);

console.log('produtorObj')
  console.log(produtorObj)

  const img = require('../../assets/sem_imagem.jpg');

  const checkImagemParam = () => {
    try {
      console.log('img');
      console.log(item.imagem);
      if (item.length === 0 || item.imagem == null) {
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

  let estoque_id = '';

  if (item.pivot?.id != undefined) {
    estoque_id = item.pivot?.id;
  } else if (item.estoque_id != undefined) {
    estoque_id = item.estoque_id;
  } else {
    estoque_id = '';
  }

  const [produto, setProduto] = useState({
    id: item.id || '',
    nome: item.nome || '',
    preco: item.preco || '',
    unidade_medida_id: item.unidade_medida_id || '',
    tipo_produto_id: item.tipo_produto_id || '',
    imagem: checkImagemParam(),
    sasionalidade: item.sasionalidade || '',
    estoque_id: estoque_id,
    peso_estimado: item.peso_estimado,
  });

  const [produtor, setProdutor] = useState({
    id: produtorObj?.id || '',
    nome: produtorObj?.nome || '',
    cpf: produtorObj?.cpf || '',
    produtos: produtorObj?.produtos || '',
    telefone1: produtorObj?.telefone1 || '',
  });

  const [comercio, setComercio] = useState({
    id: comercioObj?.id || '',
    nome: comercioObj?.nome || '',
    cnpj: comercioObj?.cnpj || '',
    produtos: comercioObj?.produtos || '',
    telefone1: comercioObj?.telefone1 || '',
  });

  const [tempProduto, setTempProduto] = useState([]);

  const [pedido, setPedido] = useState({
    produtor: produtor,
    comercio: comercio,
    obs: '',
    itens: [],
    endereco: {},
    total: '',
  });

  const loadData = async () => {
    try {
      let pedidoAS = await AsyncStorage.getItem('pedido');
      let data = (await JSON.parse(pedidoAS)) || pedido;
      console.log(data);

      //console.log('unidade');
      //console.log(produto?.unidade_medida_id);

      const responseUM = await ConnectAPI.call(
        'unidade-medida/' + produto?.unidade_medida_id
      );

      setUnidade_medida(responseUM.data);

      console.log('unidade-medida');
      console.log(responseUM.data);

      setProduto({});
      const response = await ConnectAPI.call('produto/' + produto?.id); //recarrega as informações do produto
      /*
      console.log('response.data');
      console.log(response.data);
      //setItem(response.data);
      console.log('item');
      console.log(item);
      console.log('response.data.preco');
      console.log(response.data.preco);
      */
      setPesoEstimadoCount(parseFloat(response.data.peso_estimado))

      setProduto({
        ...produto,
        preco: response.data.preco,
        imagem: response.data?.imagem,
      });

      setPedido(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadData();
    });
  });

  const saveData = async () => {
    //console.log('produto?.preco');
    //console.log(produto?.preco);
    //console.log('item.preco');
    //console.log(item.preco);
    try {
      if (count !== 0) {
        for (i = 0; i < count; i++) {
          tempProduto?.push(produto);
        }
        setEnableButton(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveDataVerSacola = async () => {
    try {
      let mergerProduto = [];
      console.log('pedido.itens');
      console.log(pedido);

      if (pedido.itens.length !== 0) {
        let tempProdutoDirefente = pedido.itens.filter(
          (e) => e.id != produto?.id
        );

        mergerProduto = [...tempProdutoDirefente, ...tempProduto];
      } else {
        mergerProduto = [...tempProduto];
      }

      pedido.itens = [];
      for (i = 0; i < count; i++) {
        pedido.itens = [...mergerProduto];
      }
      await AsyncStorage.setItem('pedido', JSON.stringify(pedido));
      console.log('saveDataVerSacola');
      console.log(await AsyncStorage.getItem('pedido'));

      navigation.navigate('VerSacola')

      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: 'VerSacola',
            },
          ],
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <ScrollView style={{width:'100%', backgroundColor: 'white'}}>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content style={{maxWidth:400}}>
            <Modal.CloseButton />
            <Modal.Header>Ops! </Modal.Header>

            <Modal.Body>Adicione pelo menos um item a sacola.</Modal.Body>
          </Modal.Content>
        </Modal>

        <Stack
          space={2.5}
          style={{
            alignSelf: 'center',
          }}
          px="4"
          safeArea
          mt="4"
          w={{
            base: '100%',
            md: '25%',
          }}>
          <Image
            source={checkImagemParam()}
            alt="imagem produto"
            size="100%"
            style={{maxHeight:'80'}} 
          />
          <View>
            <Text style={{fontSize:15, fontWeight:'bold', textAlign:'flex-start'}}>
              {produto?.nome}
            </Text>
          </View>

          <View>
            <Text style={{fontSize:14, textAlign:'flex-start'}}>
              {produto?.sasionalidade}
            </Text>
          </View>

          <View>
            <Text style={{fontSize:14, textAlign:'flex-start'}}>
              R$ {produto?.preco} por {unidade_medida}
            </Text>
          </View>

          <View>
            <Text style={{fontSize:14, textAlign:'flex-start'}}>
              Tempo de entrega: a combinar com o produtor
            </Text>
          </View>


          <View>
            <Text style={{ fontSize: 14, textAlign: 'flex-start' }}>
              Unidade de medida: {unidade_medida.nome}
            </Text>
          </View>

          {pesoEstimadoCount>0 &&
          <View>
            <Text style={{ fontSize: 14, textAlign: 'flex-start' }}>
              Peso estimado: {produto?.peso_estimado}
            </Text>
          </View>
        }

            <Stack>
              <Stack
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#004D0C',
                    flexDirection: 'row',
                    width: '30%',
                    fontSize: 14,
                    marginTop: 5,
                  }}>


                  <Button
                    style={{
                      color: 'white', 
                      marginTop: 0,
                      borderRadius:0,
                      backgroundColor:'none'
                  }}  
                    onPress={() => {
                      pesoEstimadoCount ? setCount(count > 0 ? count - pesoEstimadoCount : 0) 
                      : setCount(count > 0 ? count - 1 : 0);

                      count == 1 ? setEnableButton(false) : '';
                    }}>
                    <Text style={{color:'white'}}> - </Text>
                  </Button>
                  <Text style={{color:'white', marginTop: 5}} >
                    {    
                       count 
                    }
                  </Text>
                  <Button
                    style={{
                      color: 'white',
                      marginTop: 0,
                      padding: 2,
                      borderRadius: 0,
                      backgroundColor: 'none',
                    }}
                    onPress={() =>{ 
                      pesoEstimadoCount ? setCount(count + pesoEstimadoCount) 
                      : setCount(count + 1)}}>
                    <Text style={{color:'white'}}> + </Text>
                  </Button>
                </View>

                <Button
                  style={{
                    color: 'white',
                    width:'60%',
                    marginTop: 5,
                    padding: 5,
                    borderRadius: 0,
                    backgroundColor:'#004D0C',
                    fontSize: 14,
                    variant: 'subtle',
                    name: 'save',
                    size: 'sm',
                  }}
                  onPress={saveData}>
                  <Text style={{color:'white'}}>
                    Adicionar R$ {
                      pesoEstimadoCount ? produto?.preco * count / 1000
                      :
                      produto?.preco * count}
                  </Text>
                </Button>
              </Stack>
              {enableButton ? (
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
                    onPress={saveDataVerSacola}
                    renderInPortal={false}
                    shadow={6}
                    colorScheme="green"
                    placement="bottom"
                    right={0}
                    style={{
                      paddingRight: '40%',
                      paddingLeft: '40%',
                      height: 10,
                      size: 'sm',
                      borderRadius: 10,
                    }}
                    label={
                      <Text style={{color:'white', fontSize: 'sm'}}>
                        Ver Sacola
                      </Text>
                    }
                  />
                </Stack>
              ) : (
                <></>
              )}
            </Stack>
        </Stack>
      </ScrollView>
  );
}
