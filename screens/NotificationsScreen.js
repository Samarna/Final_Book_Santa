import React, {Component} from "react";
import firebase from "firebase";
import db from "../config";
import { Icon, ListItem } from "react-native-elements";
import { View,Text } from "react-native";
import MyHeader from "../components/MyHeader";
import SwipeableFlatList from "../components/SwipeableFlatList";

export default class NotificationsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            userId : firebase.auth().currentUser.email,
            allNotifications : [],
        }
    }
    getAllNotifications =()=>{
        db.collection('All_Notifications').where("notification_status","==","unread")
        .where("targeted_user_id","==",this.state.userId)
        .onSnapshot(snapshot=>{
            var allNotifications = [];
            snapshot.docs.map(doc=>{
                var notification = doc.data();
                notification["doc_id"]=doc.id;
                allNotifications.push(notification);
            })
            this.setState({
                allNotifications : allNotifications,
            })
        })
    }
    componentDidMount(){
        this.getAllNotifications();
    }
    keyExtractor = (item,index)=>{
        index.toString();
    }
    renderItem =({item,index})=>{
        return(
            <ListItem key={index}
            leftElement={<Icon name="book" type="font-awesome" color="#696969"></Icon>}
            title={item.book_name}
            titleStyle={{color:'black', fontWeight:'bold'}}
            subtitle={item.message}
            bottomDivider></ListItem>
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <MyHeader title="Notifications"
                    navigation={this.props.navigation}></MyHeader>
                </View>
        <View style={{flex:0.9}}>{
            this.state.allNotifications.length===0?(<View style={{
                flex:1, 
                justifyContent:'center',
                alignItems:'center'}}>
                    <Text style={{fontSize:25}}>You have no notifications.</Text>
                </View>):(<SwipeableFlatList allNotifications={this.state.allNotifications}></SwipeableFlatList>)
        }</View>
            </View>
        )
    }
}