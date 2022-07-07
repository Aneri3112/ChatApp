import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Pressable, Image} from "react-native";
import BackgroundImage from "../img/Background_Image.png";
//import Icon from "../img/icon_image.svg";

const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default function Start(props) {
  let [name, setName] = useState();
  let [backgroundColor, setColor] = useState();

  /*constructor(props) {
    super(props);
    this.state= { 
      name: "",
      backgroundColor: colors.black
    };
  }

  // function to update the state with the new background color for Chat Screen chosen by the user
  changeBackgroundColor = (newColor) => {
    this.setState({ backgroundColor: newColor });
  };*/

  return (
      <View style= {styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.image}
        >
        <Text style={styles.title}>Chat App</Text>
    
        <View style={styles.box}>
          <View style={styles.SectionStyle}>
          <Image source={require('../img/icon.png')} style={styles.ImageStyle}  />
          <TextInput
            onChangeText={(name) => setName(name)}
            value={name}
            placeholder="Type here...."
          />
        </View>
        <View style={styles.colorBox}>
          <Text style={styles.chooseColor}>
            Pick your background color!
          </Text>
        </View>

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
            </Pressable>
            </View>
       </ImageBackground>
      </View>
    );
}


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
    height: '44%',
    justifyContent: 'space-evenly',
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
    //opacity: 1,
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
    //opacity: '50',
    width: '80%', 
    borderColor: "gray", 
    borderWidth: 1,
  },
  colorArray: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  colorbutton: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },

  button: {
    width: "88%",
    height: 70,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#757083",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})