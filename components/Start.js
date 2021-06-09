import React from 'react';
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
const image =require('../assets/Background-image.png');

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      backgroundColor: '',
    };
  }

  onPressChat = (name, backgroundColor) => {
    if(name == '') {
      return Alert.alert('Please enter a nick Name.');
    }
    this.props.navigation.navigate('Chat', {
      name: `${name}`,
      backgroundColor: `${backgroundColor}`,
    });
  };

  render() {
    return (
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.title}>Lets Chat</Text>
        <View style={styles.boxInput}>
          <TextInput style={styles.inputName} onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
          placeholder='Choose a name.'
          >
          </TextInput>

        <View style={styles.backgroundColorContainer}>
          <Text style={styles.backgroundColorText}>
            Choose Background Color:
          </Text>
        </View>

        <View style={styles.chatButtonColor}>
          <TouchableOpacity onPress={() => this.setState({ backgroundColor: "#090C08" })} width='70' style={styles.chatButton1}></TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ backgroundColor: "#474056" })} width='70' style={[styles.chatButton1, styles.chatButton2]}></TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ backgroundColor: "#8A95A5" })} style={[styles.chatButton1, styles.chatButton3]}></TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ backgroundColor: "#B9C6AE" })} style={[styles.chatButton1, styles.chatButton4]}></TouchableOpacity>
        </View>   
          <View style={styles.chatButton}>
            <Button
              title='start chatting'
              color='#757083'
              onPress={() => this.onPressChat(this.state.name, this.state.backgroundColor)}
              //onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name, backgroundColor: this.state.backgroundColor })}
            />
          </View>      
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },

  boxInput: {
    width: '88%',
    height: '44%',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: 'white',
    marginBottom: 30,
  },

  title: {
    top: 30,
    height: '50%',
    fontSize: 45,
    fontWeight: 600,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },

  inputName: {
    fontSize: 16,
    width: '88%',
    fontWeight: '300',
    opacity: 50,
    color: '#757083',
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    position: 'relative',
    marginTop: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: 3,
    padding: 10,
  },

  chatButton1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
  },

  chatButton2: {
    backgroundColor: '#474056',
  },

  chatButton3: {
    backgroundColor: '#8A95A5',
  },

  chatButton4: {
    backgroundColor: '#B9C6AE',
  },

  chatButton: {
    fontWeight: '600',
    fontSize: 16,
    position: 'relative',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '88%',
    borderRadius: 10,
    padding: 15,
  },

  backgroundColorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  backgroundColorText: {
    marginTop: 30,
    marginLeft: 25,
    fontSize: 16,
    fontWeight: '500',
    color: '#757083',
  }, backgroundColorContainer: {
    flexDirection: 'column',
  },

  chatButtonColor: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

});