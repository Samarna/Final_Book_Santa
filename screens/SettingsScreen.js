import React, { Component } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,Alert} from 'react-native';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from "react-native-responsive-fontsize";

export default class SettingsScreen extends Component{
    constructor(){
        super();
        this.state = {
            firstName : '',
            lastName : '',
            emailId : '',
            address : '',
            contact : '',
            docId : '',
        }
    }
    componentDidMount(){
        console.log("App Started");
        this.getUserDetails();
    }
    getUserDetails=()=>{
        var email = firebase.auth().currentUser.email;
        console.log(email);
        db.collection('users').where('email_id','==',email).get().
        then(snapshot=>{snapshot.forEach(doc=>{
            var data = doc.data();
            this.setState({
                firstName : data.first_name,
                lastName : data.last_name,
                address : data.address,
                contact : data.contact,
                emailId : data.email_id,
                docId : doc.id,
            })
        })})
    }
    updateUserDetails=()=>{
        db.collection('users').doc(this.state.docId).update({
            first_name : this.state.firstName,
            last_name : this.state.lastName,
            address : this.state.address,
            contact : this.state.contact,
        })
        Alert.alert("Profile updated successfully!");
    }    
    render(){
        return(
            <View style = {styles.container}>
                <View style={{flex:0.12}}>                
                    <MyHeader title = "Settings" 
                    navigation = {this.props.navigate}></MyHeader>
                </View>
                <View style = {styles.formContainer}>
                    <View style={{flex:0.66, padding:RFValue(10)}}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput style = {styles.formTextInput}
                        placeholder = "first name"
                        maxLength = {10}
                        onChangeText = {(text)=>{
                            this.setState({
                                firstName : text,
                            })
                        }}
                        value = {this.state.firstName}></TextInput>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput style = {styles.formTextInput}
                        placeholder = "last name"
                        maxLength = {10}
                        onChangeText = {(text)=>{
                            this.setState({
                                lastName : text,
                            })
                        }}
                        value = {this.state.lastName}></TextInput>
                        <Text style={styles.label}>Contact</Text>
                        <TextInput style = {styles.formTextInput}
                        placeholder = "contact"
                        maxLength = {10}
                        keyboardType = {'numeric'}
                        onChangeText = {(text)=>{
                            this.setState({
                                contact : text,
                            })
                        }}
                        value = {this.state.contact}></TextInput>
                        <Text style={styles.label}>Address</Text>
                        <TextInput style = {styles.formTextInput}
                        placeholder = "address"
                        multiline = {true}
                        onChangeText = {(text)=>{
                            this.setState({
                                address : text,
                            })
                        }}
                        value = {this.state.address}></TextInput>
                    </View>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style = {styles.button}
                        onPress = {()=>{
                                this.updateUserDetails()
                        }}>
                            <Text style = {styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({ 
    container : { 
        flex:1, 
    }, 
    formContainer:{ 
        flex:0.88,  
        justifyContent: 'center',
    }, 
    formTextInput:{ 
        width:"90%", 
        height:RFValue(50),  
        borderColor:'grey', 
        borderRadius:2, 
        borderWidth:1,  
        padding:RFValue(10),
        marginBottom : RFValue(20),
        marginLeft : RFValue(20), 
    }, 
    button:{ 
        width:"75%", 
        height:RFValue(60), 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:RFValue(50), 
        backgroundColor:"#32867D", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8, },
        shadowOpacity: 0.44, 
        shadowRadius: 10.32, 
        elevation: 16, 
        marginTop:20 
    }, 
    buttonText:{ 
        fontSize:RFValue(25), 
        fontWeight:"bold", 
        color:"#fff", 
    },
    label:{ 
        fontSize:RFValue(18), 
        color:"#717D7E", 
        fontWeight:'bold', 
        padding:RFValue(10), 
        marginLeft:RFValue(20) 
    }, 
    buttonView:{ 
        flex: 0.22, 
        alignItems: "center", 
        marginTop:RFValue(100) 
    },
})