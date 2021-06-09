import React from 'react';

//import Start and Chat screens
import Start from './components/Start';
import Chat from './components/Chat';

//import react native gesture handler
import 'react-native-gesture-handler';

//import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      //Wrap the app within NavigationContainer in order for react navigttion to work
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen name='Start' component={Start} />
          <Stack.Screen name='Chat' component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>  
    );
  }
}