import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
//import GiftedChat
import { GiftedChat, Bubble, InputToolbar, Day, SystemMessage} from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

// Dadabase credentials
const firebaseConfig = {
  apiKey: "AIzaSyDR22-M044ZIx2F3SfZqlD5qd_Cxpf7w1U",
  authDomain: "chatapp-eefcb.firebaseapp.com",
  projectId: "chatapp-eefcb",
  storageBucket: "chatapp-eefcb.appspot.com",
  messagingSenderId: "20224948606",
  appId: "1:20224948606:web:e3b01b334621d7f5729b2f",
  measurementId: "G-R7N3QDKDCB"
};

export default class Chat extends Component {
  constructor(){
    super();
    this.state ={
      messages: [],
      uid:0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };

    // initializes the Firestore app
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //Stores and retrieves the chat messages users send
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.referenceMessagesUser= null;

  }
  
  // To read the messages in storage
  async getMessages() {
    let messages = "";
    let userID = "";
    try {
      // Asynchronous functions can be paused with await (here, wait for a promise)
      messages = (await AsyncStorage.getItem("messages")) || [];
      userID = (await AsyncStorage.getItem("userID")) || "";
      this.setState({
        // to convert messages string back into an object:
        messages: JSON.parse(messages),
        userID,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  
  // Set the screen title to the user name entered in the start screen
  componentDidMount() {  
    let { name} = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to load messages from Firebase
    this.referenceChatMessages = firebase.firestore().collection('messages');

     // load messages from asyncStorage
     this.getMessages();

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
        console.log("online");

        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

        // Authenticate user anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // update user state with current user data
          this.setState({
            uid: user.uid,
            messages:[],
              user: {
                _id: user.uid,
                name: name,
                avatar: 'https://i.pinimg.com/564x/51/3c/27/513c27c5cfa8d1b65a60835764fd38d6.jpg',
              }
            });
          
          // listen for update in the collection
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate); 

            this.refMsgsUser = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);
        });  
        
        
        //save msgs when online
        this.saveMessages();

      } else {
        console.log("offline");
        this.setState({
          isConnected: false,
        });
        this.props.navigation.setOptions({ title: `${name} is Offline` });
      }
    });
  } 

  //Collection Update
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get the QueryDocumentsSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
    this.saveMessages();
  };  
   
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  // The next step is to create the function saveMessages
  async saveMessages() {
    // use a try-catch block, just in case the asyncStorage promise gets rejected
    try {
      // to convert messages object into a string:
      await AsyncStorage.setItem("messages", JSON.stringify(this.state.messages));
      await AsyncStorage.setItem("userID", this.state.user._id);
    } catch (error) {
      console.log(error.message);
    }
  }

  //  add messages to the database
  addMessages() {
    const message = this.state.messages[0];
    // add new message to messages collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

   // To delete messages in the asyncStirage if needed
   async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // function to hide input field when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }


  //Customize sender bubble color
  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
          left: {}
        }}
      />
    )
  }

  //renderDay function renders a message showing the date of the chat; the text color depends on the set background color
  renderDay(props) {
    const { bgColor } = this.props.route.params;
    return (
      <Day
        {...props}
        textStyle= {{color: bgColor === '#B9C6AE' ? '#555555' : '#dddddd'}}
      />
    );
  }

  //renderSystemMessage function renders a system message; the text color depends on the set background color
  renderSystemMessage(props) {
    const { bgColor } = this.props.route.params;
    return (
      <SystemMessage
        {...props}
        textStyle= {{color: bgColor === '#B9C6AE' ? '#555555' : '#dddddd'}}
      />
    );
  }

   //to access CustomActions
   renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //return a MapView when surrentMessage contains location data
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3}}
                region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            />
        );
    }
    return null;
  }

  render() {
    let { backgroundColor} = this.props.route.params;
    return (
      <View style={[{ backgroundColor: backgroundColor}, styles.conatainer]}>
        <GiftedChat
          // isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderDay={this.renderDay.bind(this)}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />  
      
        {/* Avoid keyboard to overlap text messages on older Andriod versions */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}  

  const styles = StyleSheet.create({
    conatainer: {
      flex:1, 
    },
  })