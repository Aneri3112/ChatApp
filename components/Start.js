import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Pressable, Image, KeyboardAvoidingView} from "react-native";

// Importing the default background image from the assets folder
import BackgroundImage from "../img/Background_Image.png";

// Create constant that holds background colors for Chat Screen
const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default function Start(props) {
  let [name, setName] = useState();
  let [backgroundColor, setColor] = useState();

  return (
    // Components to create the color arrays, titles and the app's colors
      <View style= {styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.image}
        >

        <View style={styles.titleBox}>
            <Text style={styles.title}>Chat App</Text>
          </View>

        {/* Input box to set user name passed to chat screen */}
        <View style={styles.box}>
          <View style={styles.SectionStyle}>
          <Image source={require('../img/icon.png')} style={styles.ImageStyle}  />
          <TextInput
            onChangeText={(name) => setName(name)}
            value={name}
            placeholder="Type here...."
          />
        </View>
        {/* Allow user to choose a background color for the chat screen */}
        <View style={styles.colorBox}>
          <Text style={styles.chooseColor}>
            Pick your background color!
          </Text>
        </View>

        {/* colors to change the background are here! */}
        <View style={styles.colorArray}>

        <TouchableOpacity
          style={[{ backgroundColor: colors.black }, styles.colorbutton]}
          onPress={() => setColor(colors.black)}
        />
        <TouchableOpacity
          style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
          onPress={() => setColor(colors.purple)}
        />
        <TouchableOpacity
          style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
          onPress={() => setColor(colors.grey)}
        />
        <TouchableOpacity
          style={[{ backgroundColor: colors.green }, styles.colorbutton]}
          onPress={() => setColor(colors.green)}
        />
        </View> 
            {/* Open chatroom, passing user name and background color as props */}
            <Pressable
              onPress={() =>
                props.navigation.navigate("Chat", {
                  name: name,
                  backgroundColor: backgroundColor,
                })
              }
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? '#585563'
                    : '#757083'
                },
                styles.button
              ]}
            >
              
            <Text style={styles.buttonText}>Start Chatting</Text>

            {/*This will allow the user to click on a button and be redirected to the chat page */}
            </Pressable>
            </View>
       </ImageBackground>
       {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
}

// Creating the app's stylesheet, fixing sizes, centering items, changing colors
const styles = StyleSheet.create ({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  titleBox: {
    height: "40%",
    width: "88%",
    alignItems: "center",
    paddingTop: 100,
  },
  title:{
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
    alignItems:'center',
  },
  box:{
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    height: '48%',
    justifyContent: 'space-around',
    marginBottom: 10,
    padding: 10,
    minHeight: '48%',
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode : 'stretch',
    alignItems: 'center'
},

  colorBox: {
    marginRight: "auto",
    paddingLeft: 15,
    width: "88%",
  },

  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },

  SectionStyle: {
    flexDirection: 'row',
    borderWidth: .5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5 ,
    margin: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    width: '80%', 
    borderColor: "gray", 
    borderWidth: 1,
  },
  colorArray: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
  },

  colorbutton: {
    width: 48,
    height: 48,
    borderRadius: 25,
  },

  button: {
    width: "88%",
    height: 50,
    alignItems: "center",
    backgroundColor: "#757083",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
})