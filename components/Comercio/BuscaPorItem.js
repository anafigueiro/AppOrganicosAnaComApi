import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
  Fab,
  FlatList,
  Pressable,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConnectAPI from '../config/ConnectAPI';
const img = require("../../assets/sem_imagem.jpg");

export default function BuscaPorItem({ navigation, route }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { param } = route.params || "";

  const loadData = async () => {
    try {
      let response;
      if (param !== undefined) {
        console.log("param");
        console.log(param);
        response = await ConnectAPI.call(
          "produto/search/" + param,
          { nome: param },
          "POST"
        );
        setData(response.data);
      } else {
        console.log("entrou");
        response = await ConnectAPI.call("comercio-produto/32"); // 32 id do comercio cadastrado
        console.log("response.data3");
        console.log(response.data[0]);
        setData(response.data[0].produtos);
      }

      let pedidoAS = await AsyncStorage.getItem("pedido");
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

  useEffect(() => {
    loadData();
  }, []);

  const checkImagemParam = (item) => {
    try {
      if (item.length === 0 || item.imagem == null) {
        return img;
      } else if (item.imagem.includes("https")) {
        return { uri: item.imagem };
      } else {
        let img = item.imagem
          ? ConnectAPI.urlFile() + item.imagem
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU";
        return { uri: img };
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dataFilter = data?.filter(
    ({ nome }) => nome.toLowerCase()?.indexOf(search.toLowerCase()) > -1
  );

  return (
    <>
      <VStack w="100%" space={5} alignSelf="center">
        <Input
          placeholder="Pesquisar"
          value={search}
          onChangeText={(value) => setSearch(value)}
          onClear={(text) => searchData("")}
          width="100%"
          borderRadius="4"
          py="3"
          px="1"
          fontSize="14"
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<FontAwesome name="search" />}
            />
          }
        />
      </VStack>
      <Box bg="white">
        {carregando && (
          <Box
            style={{
              backgroundColor: "#CBEDD1",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                padding: "3%",
              }}
            >
              Carregando...
            </Text>
          </Box>
        )}
      </Box>
      <FlatList
        data={dataFilter}
        initialNumToRender={6}
        bg="white"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate("ProdutoDetalhe", {
                item: item || null,
                produtorObj: null,
                comercioObj: item || null,
              });
            }}
            rounded="8"
            overflow="hidden"
            border="1"
            borderColor="coolGray.300"
            // maxW="96"
            shadow="3"
            bg="coolGray.100"
            p="5"
          >
            <Box py="2">
              <HStack
                space={[3, 0]}
                justifyContent="flex-start"
                alignContent="flex-start"
              >
                <Avatar alt="img" size="58px" source={checkImagemParam(item)} />
                <VStack justifyContent="center">
                  <Text
                    _dark={{
                      color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                  >
                    {item.nome}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                  >
                    {item.descricao || "Descrição"}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
      {enableButton ? (
        <VStack w="60%" alignSelf="center">
          <Fab
            onPress={() => navigation.navigate("VerSacola")}
            renderInPortal={false}
            shadow={6}
            colorScheme="green"
            placement="bottom-left"
            borderRadius="30"
            px="12"
            icon={<Icon as={FontAwesome} name="shopping-cart" size="5" />}
            label={
              <Text color="white" fontSize="xl">
                Ver Sacola
              </Text>
            }
          />
        </VStack>
      ) : (
        <></>
      )}
    </>
  );
}