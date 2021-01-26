import React from "react";
import {Text, View, StyleSheet, FlatList} from "react-native";
import {ListItem} from 'react-native-elements';
import db from "../config";
import {Component} from "react";
import MyHeader from "../components/MyHeader";
import firebase from "firebase";

export default class MyReceivedBooksScreen extends Component{
    constructor(){
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            receivedBooksList : [],
        }
    }
    getReceivedBooksList=()=>{
        db.collection("Requested_Books").where("User_Id","==",this.state.userId).where("Book_Status","==","received")
        .onSnapshot(snapshot=>{
            var receivedBooksList = snapshot.docs.map(doc=>doc.data());
            this.setState({
                receivedBooksList : receivedBooksList,
            })
        })

    }
    componentDidMount(){
        this.getReceivedBooksList();
    }
    keyExtractor=(item,index)=>{
        index.toString();
    }
    renderItem=({item,index})=>{
        return(
            <ListItem key={index} title={item.Book_Name} subtitle={item.Book_Status} titleStyle={{
                color:"black", 
                fontWeight:"bold"
            }}bottomDivider></ListItem>
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="My Received Books" navigation={this.props.navigation}></MyHeader>
                <View style={{flex:1}}>
                {this.state.receivedBooksList.length===0?(
                    <View style={styles.subContainer}>
                        <Text style={{fontSize:20}}>No Books Received!</Text>
                    </View>
                ):(
                    <FlatList keyExtractor={this.keyExtractor} data={this.state.receivedBooksList}
                    renderItem={this.renderItem}></FlatList>
                )}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    subContainer:{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' 
    }, 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 } 
    } 
})