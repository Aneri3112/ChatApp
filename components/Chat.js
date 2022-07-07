import React from 'react';
import { StyleSheet, View, Text} from 'react-native';


export default function Chat(props) {
    let { name, backgroundColor } = props.route.params;
    props.navigation.setOptions({ title: name });

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