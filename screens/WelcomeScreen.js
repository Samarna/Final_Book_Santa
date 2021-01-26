import React,{Component} from 'react';
import {TouchableOpacity, TextInput, View, Text, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView,Image} from 'react-native';
import firebase from 'firebase';
import db from '../config.js';
import BookAnimation from '../components/books.js';
import {RFValue} from 'react-native-responsive-fontsize';

export default class WelcomeScreen extends Component {
    constructor(){
        super();
        this.state = {
            emailId : '',
            password : '',
            confirmPassword : '',
            isModalVisible : false,
            firstName : '',
            lastName : '',
            address : '',
            contact : '',
        }
    }
    userSignup=(emailId,password,confirmPassword)=>{
        if(password !== confirmPassword){
            return Alert.alert("Passwords don't match!");
        }else{
            firebase.auth().createUserWithEmailAndPassword(emailId,password)
            .then(()=>{
                db.collection('users').add({
                    first_name : this.state.firstName,
                    last_name : this.state.lastName,
                    email_id : this.state.emailId.toLowerCase(),
                    contact : this.state.contact,
                    address : this.state.address,
                    isBookRequestActive : false,
                })
                return Alert.alert("User successfully created!",' ',[{text:'OK', onPress:()=>{
                    this.setState({
                        isModalVisible : false
                    })
                }}]);
            }).catch((error)=>{
                var errorMessage = error.message;
                console.log(errorMessage);
                return Alert.alert(errorMessage);
            })
        }
    }
    userLogin=(emailId,password)=>{
        firebase.auth().signInWithEmailAndPassword(emailId,password)
        .then(()=>{
            //return Alert.alert("User successfully logged in!");
            console.log("User has logged in!")
            this.props.navigation.navigate('donateBooks');
        }).catch((error)=>{
            var errorMessage = error.message;
            console.log(errorMessage);
            return Alert.alert(errorMessage);
        })
    }
    showModal=()=>{
        return(
            <Modal 
            animationType ="slide"
            transparent = {true}
            visible = {this.state.isModalVisible}>
                    <ScrollView style = {styles.scrollview}>
                        <View style = {styles.signupView}>
                            <Text style={styles.signupText}>SIGN UP</Text>
                        </View>
                        <View style={{flex:0.95}}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "first name"
                            maxLength = {12}
                            onChangeText = {
                                text =>{this.setState({
                                    firstName : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "last name"
                            maxLength = {12}
                            onChangeText = {
                                text =>{this.setState({
                                    lastName : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Contact</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "contact number"
                            maxLength = {10}
                            keyboardType = {'numeric'}
                            onChangeText = {
                                text =>{this.setState({
                                    contact : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Address</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "address"
                            multiline = {true}
                            onChangeText = {
                                text =>{this.setState({
                                    address : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "email"
                            keyboardType = {'email-address'}
                            onChangeText = {
                                text =>{this.setState({
                                    emailId : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Password</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "password"
                            secureTextEntry = {true}
                            onChangeText = {
                                text =>{this.setState({
                                    password : text,
                                })}
                            }></TextInput>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput style = {styles.formInput}
                            placeholder = "confirm password"
                            secureTextEntry = {true}
                            onChangeText = {
                                text =>{this.setState({
                                    confirmPassword : text,
                                })}
                            }></TextInput>
                            </View>
                            <View style = {{flex:0.2,alignItems:"center"}}>
                            <TouchableOpacity 
                            style = {styles.registerButton}
                            onPress = {()=>{
                                this.userSignup(this.state.emailId,this.state.password, this.state.confirmPassword)}
                            }>
                                <Text style = {styles.registerButtonText}>Register</Text>
                            </TouchableOpacity>
                            <Text style={styles.cancelButtonText}
                            onPress={()=>{
                                this.setState({
                                    isModalVisible : false,
                                })
                            }}>Cancel</Text>
                        </View>
                    </ScrollView>
            </Modal>
        );

    }
    render(){
        return(<View style = {styles.container}> 
            {this.showModal()}<View style={{flex:0.25}}>
                <View style={{flex:0.15}}></View>
                <View style={styles.santaView}>
                    <Image source={require("../assets/santa.png")}
                    style={styles.santaImage}></Image>
                </View>
        </View>
        <View style={{flex:0.45}}>
        <View style = {styles.TextInput}>
            <TextInput style = {styles.loginBox} 
            placeholder = "abc@example.com"
            placeholderTextColor = "gray"
            keyboardType = "email-address"
            onChangeText = {(text)=>{
                this.setState({
                    emailId : text,
                })
            }}></TextInput>
            <TextInput style = {[styles.loginBox,{marginTop:RFValue(15)}]}
            placeholder = "enter passcode"
            placeholderTextColor = "gray"
            secureTextEntry = {true}
            onChangeText = {(text)=>{
                this.setState({
                    password : text,
                })
            }}></TextInput>
            </View>
            <View style={{flex:0.5,alignItems:"center"}}>
            <TouchableOpacity style = {styles.button}
            onPress = {()=>{
                this.userLogin(this.state.emailId,this.state.password)
            }}>
                <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.button}
            onPress = {()=>{
                //this.userSignup(this.state.emailId,this.state.password)
                this.setState({
                    isModalVisible : true,
                })
            }}>
                <Text style = {styles.buttonText}>Sign-up</Text>
            </TouchableOpacity>
        </View>
        </View>
        <View style={{flex:0.3}}>
            <Image source={require("../assets/book.png")}
            style={styles.bookImage}
            resizeMode={"stretch"}></Image>
            </View>
            </View>);
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#6fc0b8",
    },
    loginBox: {
      width: "80%",
      height: RFValue(50),
      borderWidth: 1.5,
      borderColor: "#ffffff",
      fontSize: RFValue(20),
      paddingLeft: RFValue(10),
    },
    button: {
      width: "80%",
      height: RFValue(50),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(25),
      backgroundColor: "#ffff",
      shadowColor: "#000",
      marginBottom:RFValue(10),
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10.32,
      elevation: 16,
    },
    buttonText: {
      color: "#32867d",
      fontWeight: "200",
      fontSize: RFValue(20),
    },
    label:{
      fontSize:RFValue(13),
      color:"#717D7E",
      fontWeight:'bold',
      paddingLeft:RFValue(10),
      marginLeft:RFValue(20)
    },
    formInput: {
      width: "90%",
      height: RFValue(45),
      padding: RFValue(10),
      borderWidth:1,
      borderRadius:2,
      borderColor:"grey",
      paddingBottom:RFValue(10),
      marginLeft:RFValue(20),
      marginBottom:RFValue(14)
    },
    registerButton: {
      width: "75%",
      height: RFValue(50),
      marginTop:RFValue(20),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(3),
      backgroundColor: "#32867d",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop: RFValue(10),
    },
    registerButtonText: {
      fontSize: RFValue(23),
      fontWeight: "bold",
      color: "#fff",
    },
    cancelButtonText:{
      fontSize : RFValue(20),
      fontWeight:'bold',
      color: "#32867d",
      marginTop:RFValue(10)
    },
    scrollview:{
      flex: 1,
      backgroundColor: "#fff"
    },
    signupView:{
      flex:0.05,
      justifyContent:'center',
      alignItems:'center'
  },
  signupText:{
    fontSize:RFValue(20),
    fontWeight:"bold",
    color:"#32867d"
  },
  santaView:{
    flex:0.75,
    justifyContent:"center",
    alignItems:"center",
    padding:RFValue(5)
  },
  santaImage:{
    width:"70%",
    height:"100%",
    resizeMode:"stretch"
  },
  TextInput:{
    flex:0.5,
    alignItems:"center",
    justifyContent:"center"
  },
  bookImage:{
    width:"100%",
    height:RFValue(190)
  }
  });