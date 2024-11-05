import React, { useState } from 'react';
import { createStackNavigator,  } from '@react-navigation/stack';
import { NavigationContainer,  } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import AddToyScreen from './components/AddToyScreen';
import RenterScreen from './components/RenterScreen';
import ToyDetailScreen from './components/ToyDetailScreen';
import ShoppingCartScreen from './components/ShoppingCartScreen';
import ListToyScreen from './components/ListToyScreen';
import UpdateToyScreen from './components/UpdateToyScreen';
import OrderRentFormScreen from './components/OrderRentFormScreen';
import OrderSaleFormScreen from './components/OrderSaleFormScreen';
import StaffScreen from './components/StaffScreen';
import TransactionsScreen from './components/TransactionsScreen';


const Stack = createStackNavigator();


function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
          
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name='AddToy' component={AddToyScreen}/>
        <Stack.Screen name='Renter' component={RenterScreen}/>
        <Stack.Screen name='ToyDetail' component={ToyDetailScreen}/>
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
        <Stack.Screen name="ListToy" component={ListToyScreen} />
        <Stack.Screen name="UpdateToy" component={UpdateToyScreen} />
        <Stack.Screen name="OrderRentForm" component={OrderRentFormScreen} />
        <Stack.Screen name="OrderSaleForm" component={OrderSaleFormScreen} />
        <Stack.Screen name="Staff" component={StaffScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;