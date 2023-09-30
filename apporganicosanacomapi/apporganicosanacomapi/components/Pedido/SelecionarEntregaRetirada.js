import React, { useState, useEffect } from 'react';
import ConnectAPI from '../config/ConnectAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  Stack,
  HStack,
  Avatar,
  View,
  Fab,
  Modal,
  Button,
  ScrollView,
} from 'native-base';
import { SelectList } from 'react-native-dropdown-select-list';
import SelecionarRetirada from '../Pedido/SelecionarRetirada';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function SelecionarEntregaRetirada({ navigation }) {
  const SelecionarEntrega = ({ navigation }) => {
    const [enderecoUsuario, setEnderecoUsuario] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState([]);
    const [pedido, setPedido] = useState({});
    const [data, setData] = useState([]);
    const [verificaSelecionado, setVerificaSelecionado] = useState(0);

    const [showModal1, setShowModal1] = useState(false);

    const loadData = async () => {
      try {
        const values = await AsyncStorage.getItem('@usuario');
        let usuario = await JSON.parse(values);

        const pedidoAS = await AsyncStorage.getItem('pedido');
        let dataPedido = (await JSON.parse(pedidoAS)) || [];
        if (usuario) {
          setData(usuario);
        } //data = usuario

        console.log('usuario');
        console.log(usuario);

        const response = await ConnectAPI.call(
          'usuario-endereco/' + usuario.usuario_id
        );

        setEnderecoUsuario(response.data[0].enderecos);
        setPedido(dataPedido);

        let ep = response.data[0].enderecos.map((item) => {
          return {
            key: item.id,
            value: item.nome,
          };
        });
        setEnderecoSelecionado(ep);
        console.log('ep');
        console.log(ep);
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

    const saveData = async (data) => {
      try {
        if (pedido.endereco) {
          setPedido({
            ...pedido,
            endereco: enderecoUsuario,
          });

          console.log('pedido.endereco');
          console.log(pedido.endereco);

          if (pedido.endereco) {
            console.log('usuário selecionou o endereço');
            setVerificaSelecionado(1);
            console.log(verificaSelecionado);
          } else {
            console.log('vetor vazio');
            setShowModal1(true);
            setVerificaSelecionado(0);
            console.log(verificaSelecionado);
          }
          console.log('selecionou');

          await AsyncStorage.setItem('pedido', JSON.stringify(pedido));
          console.log(pedido.endereco);
          navigation.push('ConfirmarPedido');
          
        } else if (verificaSelecionado === 0) {
          setShowModal1(true);
          console.log('não selecionou');
        }
      } catch (error) {
        console.error(error);
      }
    };

    {
      /* Primeira tab- SELECIONAR ENTREGA */
    }

    return (
      <>
        <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
          <Modal.Content style={{maxWidth:400}}>
            <Modal.CloseButton />
            <Modal.Header> Selecione um endereço </Modal.Header>

            <Modal.Body>
              Para continuar, é obrigatório informar o endereço que deseja
              retirar.
            </Modal.Body>

            <Modal.Footer>
              <Button.Group style={{alignItems:'center'}}>
                <Button
                  colorScheme="green"
                  onPress={() => {
                    setShowModal1(false);
                  }}>
                  Ok
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <ScrollView
          contentContainerStyle={{ width: '100%', backgroundColor:'white' }}>
          <View
            style={{
              backgroundColor: '#CBEDD1',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                padding: '5%',
              }}>
              Receba o produto na sua casa!
            </Text>
          </View>
          <HStack
          style={{
            margin:4,
            paddingBottom:5,
            borderBottomWidth:1,
            alignItems:'center',
            borderColor:'grey',
          }}>
            <Avatar size="58" source={checkImagemParam(data)} />
            <Text bold marginLeft="3">
              {data.name || 'Nome do usuario'}
            </Text>
          </HStack>

          <View style={{margin:'5%'}}>
            <Text style={{fontWeight:'bold', fontSize:14, marginBottom:'5%'}}>
              Endereço de entrega:
            </Text>

            <SelectList
              onSelect={() => pedido.endereco}
              setSelected={(value) => {
                let ep = enderecoUsuario.filter((e) => e.id === value);
                setPedido({ ...pedido, endereco: ep[0] });
              }}
              data={enderecoSelecionado}
              save="key"
              defaultOption={{
                key: pedido.endereco?.id || 1,
                value: pedido.endereco?.nome || '',
              }}
              searchPlaceholder="Selecione seu endereço "
              placeholder="Selecione seu endereço"
              boxStyles={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#d9d9d9',
                padding: 10,
              }} //override default styles
              dropdownStyles={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#d9d9d9',
                padding: 10,
                backgroundColor: '#CBEDD1',
              }}
            />

            <Text
              onPress={() => {
                navigation.navigate('FormularioEnderecos');
              }}
              style={{
                fontSize:12,
                color:'grey',
                marginTop:'7%',
                textDecorationLine:'underline'
              }}>
              Não tem endereço cadastrado?
            </Text>

            <Button
              size="sm"
              colorScheme="green"
              style={{width:'60%', marginTop:'3%'}}
              onPress={() => {
                navigation.navigate('FormularioEnderecos');
              }}>
              Cadastrar novo endereço
            </Button>

            <Text style={{fontWeight:'bold', fontSize:14, marginTop:'10%'}}>
              Data de entrega:
            </Text>
            <Text style={{fontSize:14, marginTop:'2%'}}>
              A ser combinada com o vendedor
            </Text>
          </View>

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
              style={{
                paddingRight:'40%',
                paddingLeft:'40%',
                height:10,
                borderRadius:10
              }}
              size="sm"
              label={
                <Text color="white" fontSize="sm">
                  Continuar
                </Text>
              }
            />
          </Stack>
        </ScrollView>
      </>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Entrega" component={SelecionarEntrega} />
      <Tab.Screen name="Retirada" component={SelecionarRetirada} />
    </Tab.Navigator>
  );
}
