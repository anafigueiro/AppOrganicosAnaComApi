import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

// You can import from local files
import ProdutosProdutor from '../components/Produto/ProdutosProdutor';
import ProdutoDetalhe from '../components/Produto/ProdutoDetalhe';
import BuscaGeral from '../components/Produtor/BuscaGeral';
import BuscaPorProdutorItem from '../components/Produtor/BuscaPorProdutorItem';
import BuscarPorItem from '../components/Produtor/BuscarPorItem';
import ListagemProdutorCategoria from '../components/Produtor/ListagemProdutorCategoria';
import ListagemProdutorMaisPedidos from '../components/Produtor/ListagemProdutorMaisPedidos';
import ListagemProdutosPorCategoria from '../components/Produtor/ListagemProdutosPorCategoria';
import VerSacola from '../components/Pedido/VerSacola';
import SelecionarEntregaRetirada from '../components/Pedido/SelecionarEntregaRetirada';
import SelecionarRetirada from '../components/Pedido/SelecionarRetirada';
import ConfirmarPedido from '../components/Pedido/ConfirmarPedido';
import FinalizarPedido from '../components/Pedido/FinalizarPedido';
import Teste from '../components/Login/Teste';
import Login from '../components/Login/Login';
import BuscaPorComercioItem from '../components/Comercio/BuscaPorComercioItem';
import BuscaPorItem from '../components/Comercio/BuscaPorItem';
import ProdutosComercio from '../components/Comercio/ProdutosComercio'

const LoginStack = createNativeStackNavigator();

function LoginStackScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="Login"
        component={Login} 
        options={{ title: 'Login' }}
      />
      <LoginStack.Screen
        name="Teste"
        component={Teste}
        options={{ title: 'Teste' }}
      />
    </LoginStack.Navigator>
  );
}

const BuscaStack = createNativeStackNavigator();

function BuscaStackScreen() {
  return (
    <BuscaStack.Navigator 
   // initialRouteName="ProdutoDetalhe"
    >
      <BuscaStack.Screen
        name="BuscaGeral"
        component={BuscaGeral}
        options={{ title: 'Busca Geral' }}
      />
      <BuscaStack.Screen
        name="ListagemProdutorCategoria"
        component={ListagemProdutorCategoria}
        options={{ title: 'Listagem Produtor Categoria' }}
      />
      <BuscaStack.Screen
        name="ListagemProdutosPorCategoria"
        component={ListagemProdutosPorCategoria}
        options={{ title: 'Listagem produtos por categoria' }}
      />
      <BuscaStack.Screen
        name="ListagemProdutorMaisPedidos"
        component={ListagemProdutorMaisPedidos}
        options={{ title: 'Listagem Produtor mais pedidos' }}
      />
      <BuscaStack.Screen
        name="BuscaPorProdutorItem"
        component={BuscaPorProdutorItem}
        options={{ title: 'Busca Produtor/ Item' }}
      />
      <BuscaStack.Screen
        name="BuscarPorItem"
        component={BuscarPorItem}
        options={{ title: 'Buscar por item' }}
      />
      <BuscaStack.Screen
        name="BuscaPorComercioItem"
        component={BuscaPorComercioItem}
        options={{ title: 'Busca Comercio/ Item' }}
      />
      <BuscaStack.Screen
        name="BuscaPorItem"
        component={BuscaPorItem}
        options={{ title: 'Busca por item' }}
      />
      <BuscaStack.Screen
        name="ProdutosComercio"
        component={ProdutosComercio}
        options={{ title: ' Produtos do Comercio' }}
      />
      <BuscaStack.Screen
        name="ProdutosProdutor"
        component={ProdutosProdutor}
        options={{ title: ' Produtos do Produtor' }}
      />
      <BuscaStack.Screen 
        name="ProdutoDetalhe" 
        component={ProdutoDetalhe}
        options={{ title: 'Produto' }}
      />
      <BuscaStack.Screen
        name="VerSacola"
        component={VerSacola}
        options={{ title: 'Ver Sacola' }}
      />
      <BuscaStack.Screen
        name="SelecionarEntregaRetirada"
        component={SelecionarEntregaRetirada}
        options={{ title: 'Selecionar Entrega' }}
      />
      <BuscaStack.Screen
        name="SelecionarRetirada"
        component={SelecionarRetirada}
        options={{ title: 'Selecionar Retirada' }}
      />
      <BuscaStack.Screen
        name="ConfirmarPedido"
        component={ConfirmarPedido}
        options={{ title: 'Confirmar Pedido' }}
      />
      <BuscaStack.Screen
        name="FinalizarPedido"
        component={FinalizarPedido}
        options={{ title: 'Finalizar Pedido' }}
      />
    </BuscaStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="busca"
          component={BuscaStackScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => (
              <Icon name="search" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="login"
          component={LoginStackScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => (
              <Icon name="sign-in" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
