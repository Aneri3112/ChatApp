import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
//import GiftedChat
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default function Chat(props) {
    let { name, backgroundColor } = props.route.params;
    const [messages, setMessages] = useState([]);

  // Set the screen title to the user name entered in the start screen
    useEffect(() => {
      props.navigation.setOptions({ title: name });
      setMessages([
        {
          _id: 1,
          text: 'Hello Developer',
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://i.pinimg.com/564x/51/3c/27/513c27c5cfa8d1b65a60835764fd38d6.jpg',
          },
        },
        {
          _id: 2,
          text: `${name} has entered the chat.`,
          createdAt: new Date(),
          system: true,
        },
      ]);
    }, [])
    

    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    //Customize sender bubble color
    const renderBubble = (props) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#000'
            }
          }}
        />
      )
    }

    return (
      <View style={[{ backgroundColor: backgroundColor}, styles.conatainer]}>
        <GiftedChat
          renderBubble={renderBubble.bind()}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
        />  
      
        {/* Avoid keyboard to overlap text messages on older Andriod versions */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }

  const styles = StyleSheet.create({
    conatainer: {
      flex:1, 
    },
  })
