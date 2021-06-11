import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  //when a user send a message this function will be called
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({title: name});
    let backgroundColor = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)} 
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
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