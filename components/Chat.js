import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, LogBox} from 'react-native';
//import GiftedChat
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor(props){
    super(props);
    this.state ={
      messages: [],
      uid:0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    }
    
    // to remove warning message in the consile
    LogBox.ignoreLogs([
      "Setting a timer",
      "Warning: ...",
      "Console Warning: ...",
      "undefined",
      "Animated.event now requires a second argument for options",
      "Possible Unhandled Promise Rejection (id:0)",
    ]);

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

    // initializes the Firestore app
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //Stores and retrieves the chat messages users send
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.referenceMessagesUser= null;

  }

  // Set the screen title to the user name entered in the start screen
  componentDidMount() {  
    let { name} = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to load messages from Firebase
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

    // Authenticate user anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
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
      });
    });
    this.setState({
      messages,
    });
  };  
   
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessages();
      }
    );
  }

  //  add messages to the database
  addMessages() {
    const message = this.state.messages[0];
    // add new message to messages collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }

  //Customize sender bubble color
  renderBubble (props) {
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

  render() {
    let { backgroundColor} = this.props.route.params;
    return (
      <View style={[{ backgroundColor: backgroundColor}, styles.conatainer]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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

