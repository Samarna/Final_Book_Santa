import React,{Component} from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import { ListItem,Icon } from 'react-native-elements';
import db from '../config';
import MyHeader from '../components/MyHeader';

export default class MyDonationsScreen extends Component{
    constructor(){
        super();
        this.state={
            donorId : firebase.auth().currentUser.email,
            donorName : '',
            allDonations : [],
        }
    }
    getDonorDetails=(donorId)=>{
        console.log("hello");
        console.log("donorId : "+donorId);
        db.collection('users').where("email_id","==",donorId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    donorName : doc.data().first_name+" "+doc.data().last_name,
                })
            })
        })
    }
    getAllDonations=()=>{
        console.log("getAllDonations!");
        console.log(this.state.donorId);
        this.requestRef = db.collection("All_Donations").where("Donor_Id","==",this.state.donorId)
        .where("Request_Status","==","Donor Interested!")
        .onSnapshot((snapshot)=>{
            var allDonations = []
            snapshot.docs.map((document)=>{
                var donation = document.data();
                donation["doc_id"] = document.id;
                allDonations.push(donation);
                this.setState({
                    allDonations : allDonations,
                })
            })
        })
    }
    sendNotification=(bookDetails,requestStatus)=>{
        var requestId = bookDetails.Request_Id; 
        console.log("requestId : "+requestId);
        var donorId = bookDetails.Donor_Id; 
        console.log(donorId); 
        db.collection("All_Notifications").where("request_id", "==", requestId) 
        .where("donor_id", "==", donorId) 
        .get().then((snapshot)=>{ 
            snapshot.forEach((doc) => { 
                var message = "" 
                if(requestStatus === "Book Sent!"){ 
                    message = this.state.donorName + " sent you book!"
                }else{ 
                    message = this.state.donorName + " has shown interest in donating the book!" 
                } 
                db.collection("All_Notifications").doc(doc.id).update({ 
                    "message": message, 
                    "notification_status" : "unread", 
                    "date" : firebase.firestore.FieldValue.serverTimestamp() 
                }) 
            }); 
        }) 
        console.log("All done here");
    }
    sendBook=(bookDetails)=>{
        console.log("bookDetails : "+bookDetails.doc_id);
        if(bookDetails.Request_Status==="Book Sent!"){
            var requestStatus = "Donor Interested!";
            db.collection('All_Donations').doc(bookDetails.doc_id).update({
                Request_Status : "Donor Interested!"
            });
            this.sendNotification(bookDetails,requestStatus);
        }else{
            var requestStatus = "Book Sent!";
            db.collection('All_Donations').doc(bookDetails.doc_id).update({
                Request_Status : "Book Sent!"
            });
            this.sendNotification(bookDetails,requestStatus);
        }
    }
    keyExtractor = (item,index)=>index.toString();

    renderItem = ({item,i})=>(
        <ListItem key={i}
        title = {item.Book_Name}
        subtitle = {"Requested by : "+item.Requested_By +"\nStatus : " + item.Request_Status}
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>} 
        titleStyle={{ color: 'black', fontWeight: 'bold' }} 
        rightElement={ <TouchableOpacity style={styles.button}
        onPress = {()=>{
            this.sendBook(item);
        }}> 
        <Text style={{color:'#ffff'}}>Send Book</Text> 
        </TouchableOpacity> 
        } bottomDivider></ListItem>
    )
    componentDidMount(){
        this.getDonorDetails(this.state.donorId);
        this.getAllDonations();
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader navigation = {this.props.navigation}
                title = "My Donations"></MyHeader>
                <View style = {{flex:1}}>{this.state.allDonations.length===0?(
                <View style = {styles.subtitle}>
                    <Text style = {{fontSize:20}}>No Donations Available</Text>
                </View>
                ):(<FlatList keyExtractor= {this.keyExtractor}
                data = {this.state.allDonations}
                renderItem = {this.renderItem}></FlatList>)}</View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 }, 
        elevation : 16 
    }, 
    subtitle :{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' 
    } 
})