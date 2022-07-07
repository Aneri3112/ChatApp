import React, { useEffect } from 'react';
import { StyleSheet, View, Text} from 'react-native';
//import GiftedChat
import { GiftedChat } from 'react-native-gifted-chat'

export default function Chat(props) {
    let { name, backgroundColor } = props.route.params;
    useEffect(() => {
      props.navigation.setOptions({ title: name });
    }, [])
    

    return (
      <View style={[{ backgroundColor: backgroundColor}, styles.conatainer]}>
        <Text style={styles.text}>Welcome to Chat App!</Text>
      </View>
    )
  }

  const styles = StyleSheet.create({
    conatainer: {
      flex:1, 
      justifyContent: "center", 
      alignItems: 'center',
    },

    text: {
      color: 'white'
    },
  })