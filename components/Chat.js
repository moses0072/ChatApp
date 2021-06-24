import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

import firebase from 'firebase';
import 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const firebaseConfig = {
  apiKey: "AIzaSyBijIRfjKjDBScmh-JOLLeul-6o0YyInKI",
  authDomain: "chatapp-2894a.firebaseapp.com",
  projectId: "chatapp-2894a",
  storageBucket: "chatapp-2894a.appspot.com",
  messagingSenderId: "141069277292",
  appId: "1:141069277292:web:76cc1f6574e77ee0812049",
  measurementId: "G-XXK5BY2VMK"
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
    }    
    //config allow the app to connect to Firestore
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  componentDidMount() {    
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });
    //Find out connection status
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        // Authenticates user via Firebase
        this.authUnsubscribe = firebase.auth()
        .onAuthStateChanged(async (user) => {
        if (!user) {
          await firebase.auth().signInAnonymously();
        }
        this.setState({
          uid: user.uid,
          user: {
            _id: user.uid,
            name: name,
            avatar: 'https://placeimg.com/140/140/any',
          },
          messages: [],
        });
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
        }); 
      } else {
          console.log('offline');
          this.setState({ isConnected: false});
          this.getMessages();
        }
    });
  }  

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  //Update the messages
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });  
    } catch (error) {
      console.log(error.message);
    }
  };
  //Add a new Message
  addMessage() {
    const message = this.state.messages[0];
    //console.log(message);
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  //retrieve the current data in  collection and store it in your state messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || null,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      }); //console.log(data.text);3
    });
    this.setState({
      messages,
    });
  }

  //This function saves new messages to client-side storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));      
    } catch (error) {
      console.log(error.message);
    }
  }

  //when a user send a message this function will be called
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  }

  //Delete messages from client-side storage
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //To add play audio functionality and changed the background color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#eceff1',
          },
          right: {
            backgroundColor: '#000'
          },
        }}
      />
    );
  }
  
  //Render the default InputTollbar when the user is online
  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar {...props} />
      )
    }
  }

  //Displays additional communication features (photos, camera, map)
  renderCustomActions = props => <CustomActions {...props} />;

  // returns custom map view
  renderCustomView = props => {
    const {currentMessage} = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: Number(currentMessage.location.latitude),
            longitude: Number(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  render() {   
    let backgroundColor = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble }
          renderInputToolbar={this.renderInputToolbar}
          renderUsernameOnMessage={true}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {/* Android keyboard fix */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})