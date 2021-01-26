import React,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Image} from 'react-native';
import { ListItem } from 'react-native-elements';
import MyHeader from "../components/MyHeader.js";
import db from '../config';
import firebase from 'firebase';

export default class BookDonateScreen extends Component {
    constructor(){
        super();
        this.state={
            requestedBooksList : [],
        };
        this.requestRef = null;
    }
    getRequestedBooksList =()=>{
        this.requestRef=db.collection("Requested_Books").where("Book_Status","==","requested").onSnapshot((snapshot)=>{
            var requestedBooksList = snapshot.docs.map(document=>document.data());
            this.setState({
                requestedBooksList : requestedBooksList,
            });
        });
    }
    componentDidMount(){
        this.getRequestedBooksList();
        console.log(this.state.requestedBooksList.length);
    }
    componentWillUnmount(){
        this.requestRef();
    }
    keyExtractor =(item,index)=>index.toString();
    renderItem =({item,i})=>{
        console.log(item.Author_Name);
        return(
            <ListItem key = {i} 
            title = {item.Book_Name} 
            subtitle = {item.Reason_To_Request}
            titleStyle = {{color : 'black', fontWeight : 'bold'}}
            leftElement = {
                <Image style={{height:50,width:50}} source={{uri:item.Image_Link}}></Image>
            }
            rightElement = {
            <TouchableOpacity style = {styles.button}
            onPress = {()=>{
                this.props.navigation.navigate("receiverDetails",{"details":item})
            }}>
                <Text>Donate</Text>
            </TouchableOpacity>} 
            bottomDivider></ListItem>
        )
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader title="Donate Books" navigation={this.props.navigation}></MyHeader>
                <View style = {{flex:1}}>
                    {this.state.requestedBooksList.length===0?(
                        <View style = {styles.subContainer}>
                            <Text style = {{fontSize : 20}}>List of all requested books</Text>
                        </View>
                    ):(
                        <FlatList keyExtractor = {this.keyExtractor}
                        data = {this.state.requestedBooksList}
                        renderItem = {this.renderItem}></FlatList>
                    )}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ 
    button : { 
        width : 100, 
        height : 30, 
        justifyContent : 'center', 
        alignItems : 'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 } },
        subContainer:{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center'}, 
})