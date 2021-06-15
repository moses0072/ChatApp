import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import firebase from 'firebase';
import 'firebase/firestore';

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
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addMessage() {
    const message = this.state.messages[0];
    console.log(message);
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
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
      }); console.log(data.text);
    });
    this.setState({
      messages,
    });
  }

  //when a user send a message this function will be called
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      },
    );
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
  
  render() {   
    let backgroundColor = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)} 
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
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