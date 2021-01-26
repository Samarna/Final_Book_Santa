import React, {Component} from 'react';
import {View,Text,StyleSheet, TouchableOpacity,Image} from 'react-native';
import firebase from 'firebase';
import db from "../config";
import MyHeader from '../components/MyHeader';
import { Icon,Card } from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : firebase.auth().currentUser.email,
            userName : "",
            receiverId : this.props.navigation.getParam("details")["User_Id"],
            requestId : this.props.navigation.getParam("details")["Request_Id"],
            bookName : this.props.navigation.getParam("details")["Book_Name"],
            authorName : this.props.navigation.getParam("details")["Author_Name"],
            reasonForRequesting : this.props.navigation.getParam("details")["Reason_To_Request"],
            receiverName : '',
            receiverContact : '',
            receiverAddress : '',
            receiverRequestDocId : '',
            bookImage : '#'
        }
    }
    getUserName=(userId)=>{
        db.collection('users').where('email_id','==',userId)
        .get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    userName : doc.data().first_name+" "+doc.data().last_name,
                })
            })
        })
    }
    addNotifications=()=>{
        var message = this.state.userName+" has shown interest in donating the book!";
        db.collection('All_Notifications').add({
            donor_id : this.state.userId,
            targeted_user_id : this.state.receiverId,
            request_id : this.state.requestId,
            book_name : this.state.bookName,
            date : firebase.firestore.FieldValue.serverTimestamp(),
            notification_status : "unread",
            message : message,
        })
    }
    updateBookStatus=()=>{
        console.log("Entered updateBookStatus!");
        db.collection('All_Donations').add({
            Book_Name:this.state.bookName, 
            Request_Id:this.state.requestId, 
            Requested_By:this.state.receiverName,
            Donor_Id:this.state.userId,
            Request_Status:"Donor Interested!",
        })
    }
    getReceiverDetails(){
        console.log(this.state.receiverId+','+this.state.requestId);
        db.collection('users').where('email_id','==',this.state.receiverId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                console.log(doc.data());
                this.setState({
                    receiverName : doc.data().first_name,
                    receiverContact : doc.data().contact,
                    receiverAddress : doc.data().address,
                })
            })
        })
        db.collection('Requested_Books').where('Request_Id','==',this.state.requestId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverRequestDocId : doc.id,
                    bookImage : doc.data().image_link,
                })
            })
        })
    }
    componentDidMount(){
        this.getReceiverDetails();
        this.getUserName(this.state.userId);
    }
    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex : 0.1}}>
                    <MyHeader leftComponent = {
                        <Icon name = "arrow-left" 
                        type = 'feather' 
                        color = '#FFFFFF' 
                        onPress = {()=>{
                            this.props.navigation.goBack();
                            }
                        }></Icon>
                    } centerComponent = {{
                        text : 'Donate Books',
                        style : {
                            color : '#FFFFFF', 
                            fontSize : RFValue(20), 
                            fontWeight : 'bold'
                        }
                    }} backgroundColor = '#32867B'></MyHeader>
                </View>
                <View style = {{flex:0.9}}>
                    <View style={{
                        flex : 0.3, 
                        flexDirection : 'row', 
                        paddingTop : RFValue(30),
                        paddingLeft : RFValue(10),
                        }}>
                            <View style={{flex:0.4}}>
                                <Image source={{uri:this.state.bookImage}} 
                                style={{
                                    width:"100%",
                                    height:"100%",
                                    resizeMode:'contain'
                                }}></Image>
                            </View>
                            <View style={{
                                flex:0.6,
                                alignItems:"center",
                                justifyContent:"center"
                            }}>
                            <Text style = {{
                                fontWeight : '400', 
                                fontSize:RFValue(18), 
                                textAlign: "left"
                            }}>{this.state.bookName}</Text>
                            <Text style = {{
                                fontWeight : '400', 
                                fontSize:RFValue(15), 
                                textAlign:'left', 
                                marginTop:RFValue(15)
                            }}>{this.state.reasonForRequesting}</Text>
                        </View>
                    </View>
                <View style = {{
                    flex:0.7,
                    padding:RFValue(20)
                }}>
                    <View style={{ 
                        flex: 0.7 ,
                        justifyContent:'center',
                        alignItems:'center',
                        marginTop:RFValue(50), 
                        borderWidth:1,
                        borderColor:'#deeedd',
                        padding:RFValue(10)
                        }}>
                            <Text style = {{fontWeight : '500', fontSize:RFValue(25)}}>Receiver Information</Text>
                            <Text style = {styles.receiverText}>Name : {this.state.receiverName}</Text>
                            <Text style = {styles.receiverText}>Contact : {this.state.receiverContact}</Text>
                            <Text style = {styles.receiverText}>Address : {this.state.receiverAddress}</Text>
                </View>
                <View style = {styles.buttonContainer}>{this.state.receiverId!=this.state.userId?
                (
                    <TouchableOpacity style = {styles.button} onPress = {()=>{
                        this.updateBookStatus();
                        this.addNotifications();
                        this.props.navigation.navigate('MyDonations');
                    }}>
                        <Text>I want to donate!</Text>
                    </TouchableOpacity>
                ):null}</View>
            </View>
            </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    container: { 
        flex:1,
    }, 
    buttonContainer : { 
        flex:0.3, 
        justifyContent:'center', 
        alignItems:'center' 
    }, 
    button:{ 
        width:"75%", 
        height:RFValue(60), 
        justifyContent:'center', 
        alignItems : 'center', 
        borderRadius: RFValue(60), 
        backgroundColor: '#FF5722', 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 }, 
        elevation : 16 
    },
    receiverText : { 
        fontWeight: "400", 
        fontSize: RFValue(20), 
        marginTop: RFValue(30), 
    }
})