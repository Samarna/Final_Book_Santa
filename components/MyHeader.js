import React, { Component } from 'react';
import { View } from 'react-native';
import {Badge, Header, Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class MyHeader extends Component{
    constructor(props){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            value : "",
        }
    }
    BellIconWithBadge=()=>{
        return(
            <View>
                <Icon name="bell" type="font-awesome" color="#696969" size={25} onPress={()=>{
                    this.props.navigation.navigate("Notifications");
                }}></Icon>
                <Badge value={this.state.value} containerStyle={{
                    position:'absolute', 
                    top:-4,
                    right:-4,}}></Badge>
            </View>
        );
    }
    getNumberOfUnreadNotifications(){
        db.collection('All_Notifications').where("notification_status","==","unread")
        .where("targeted_user_id","==",this.state.userId).onSnapshot((snapshot)=>{
            var unreadNotifications = snapshot.docs.map((doc)=>{
                doc.data();
            })
            this.setState({
                value : unreadNotifications.length,
            })
        })
    }
    componentDidMount(){
        this.getNumberOfUnreadNotifications();
    }
    render(){
        return(
            <Header leftComponent = {
                <Icon name="bars" type="font-awesome" color="#696969" onPress={()=>{
                    this.props.navigation.toggleDrawer()
                }}></Icon>
            }centerComponent={{text:this.props.title, style:{
                color:'#90A5A9', 
                fontSize:20,
                fontWeight : "bold",
            }}} backgroundColor = "#EAF8FE"
            rightComponent={
                <this.BellIconWithBadge{...this.props}></this.BellIconWithBadge>
            }></Header>
        )
    }
}