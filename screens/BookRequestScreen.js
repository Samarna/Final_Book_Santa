import React,{Component} from 'react';
import {View,Text,StyleSheet,KeyboardAvoidingView,TextInput,TouchableOpacity,Alert,Image} from 'react-native';
import MyHeader from '../components/MyHeader.js';
import db from '../config';
import firebase from 'firebase';
import {BookSearch} from 'react-native-google-books';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import {Input} from 'react-native-elements';

export default class BookRequestScreen extends Component {
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            bookName : '',
            reasonToRequest : '',
            author : '',
            bookStatus : '',
            requestedBookName : '',
            requestId : '',
            docId : '',
            isBookRequestActive : '',
            imageLink : '',
            dataSource : '',
            showFlatList : false,
            requestedImageLink : '',
        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }
    getBookRequest=()=>{
        var bookRequest = db.collection("Requested_Books").where("User_Id","==",this.state.userId)
        .get().then((snapshot)=>{
            snapshot.forEach(doc=>{
                if(doc.data().Book_Status!=="received"){
                    this.setState({
                        requestId : doc.data().Request_Id,
                        requestedBookName : doc.data().Book_Name,
                        bookStatus : doc.data().Book_Status,
                        requestedImageLink : doc.data().Image_Link,
                        docId : doc.id,
                    })
                }
            })
        })
    }
    getIsBookRequestActive=()=>{
        db.collection("users").where("email_id","==",this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    isBookRequestActive : doc.data().isBookRequestActive,
                    docId : doc.id,
                })
            })
        })
    }
    sendNotification=()=>{
        db.collection("users").where("email_id","==",this.state.userId)
        .get().then((snapshot)=>{
            snapshot.forEach(doc=>{
                var name = doc.data().first_name;
                var lname = doc.data().last_name;
                db.collection('All_Notifications').where("request_id","==",this.state.requestId)
                .get().then(snapshot=>{
                    snapshot.forEach(doc=>{
                        var donorId = doc.data().donor_id;
                        var bookName = doc.data().book_name;
                        db.collection("All_Notifications").add({
                            "targeted_user_id" : donorId, 
                            "message" : name +" " + lname + " received the book " + bookName , 
                            "notification_status" : "unread", 
                            "book_name" : bookName,
                        })
                    })
                })
            })
        })
    }
    updateBookRequestStatus=()=>{
        db.collection("Requested_Books").doc(this.state.docId)
        .update({
            Book_Status : "received",
        })
        db.collection("users").where("email_id","==",this.state.userId)
        .get().then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive : false,
                })
            })
        })
    }
    async getBooksFromAPI(bookName){
        this.setState({
            bookName : bookName,
        })
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName,'AIzaSyBYts0TiMrRAUSvjY5KYtUyaKeBaJ6ImYw');
            console.log(books);
            this.setState({
                dataSource : books.data,
                showFlatList : true,
            })
        }
    }
    renderItem=({item,i})=>{
        return(
            <TouchableHighlight style={styles.bookSelect}
            activeOpacity={0.8} underlayColor="#DDDDDD" 
            onPress={()=>{
                this.setState({
                    showFlatList : false,
                    bookName : item.volumeInfo.title,
                })
            }} bottomDivider>
                <Text>{item.volumeInfo.title}</Text>
            </TouchableHighlight>
        )
    }
    addRequest=async(bookName,reasonToRequest,author)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        var books = await BookSearch.searchbook(bookName,'AIzaSyBYts0TiMrRAUSvjY5KYtUyaKeBaJ6ImYw')
        db.collection('Requested_Books').add({
            "User_Id" : userId,
            "Book_Name" : bookName,
            "Author_Name" : author,
            "Reason_To_Request" : reasonToRequest,
            "Request_Id" : randomRequestId,
            "Book_Status" : "requested",
            "Date" : firebase.firestore.FieldValue.serverTimestamp(),
            "Image_Link" : books.data[0].volumeInfo.imageLinks.smallThumbnail,
        });
        this.getBookRequest();
        db.collection("users").where("email_id","==",userId).get()
        .then().then((snapshot)=>{
            snapshot.forEach(doc=>{
                db.collection("users").doc(doc.id).update({
                    isBookRequestActive : true
                })
            })
        })
        this.setState({
            bookName : '',
            reasonToRequest : '',
            author : '',
            requestId : randomRequestId,
        })
        return Alert.alert("Book Requested successfully!")
    }
    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
    }
    render(){
        if(this.state.isBookRequestActive===true){
            return(
                <View style={{flex:1}}>
                    <View style={{flex:0.1}}>
                        <MyHeader title="Book Status" 
                        navigation={this.props.navigation}></MyHeader>
                    </View>
                    <View style={styles.ImageView}>
                        <Image source={{uri:this.state.requestedImageLink}}
                        style = {styles.imageStyle}></Image>
                    </View>
                    <View style={styles.bookStatus}>
                        <Text style={{fontSize:RFValue(20)}}>Book Name</Text>
                        <Text style={styles.requestedBookName}>{this.state.requestedBookName}</Text>
                        <Text style={styles.status}>Book Status</Text>
                        <Text style={styles.bookStatus}>{this.state.bookStatus}</Text>
                    </View>
                    <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}onPress={()=>{
                        this.sendNotification();
                        this.updateBookRequestStatus();
                    }}>
                        <Text style={styles.buttontxt}>I received the book!</Text>
                    </TouchableOpacity>
                </View>
                </View>
            )
        }else{
            return(
                <View style = {{flex:1}}>
                    <View style={{flex:1}}>
                    <MyHeader title="Request Books" navigation={this.props.navigation}></MyHeader>
                    </View>
                        <View style={{flex:0.9}}>
                            <Input style={styles.formatTextInput} label={"Book Name"}
                            placeholder="Book Name" containerStyle={{marginTop:RFValue(60)}}
                            onChangeText={(text)=>{
                                this.getBooksFromAPI(text);
                            }} 
                            onClear={(text)=>{
                                this.getBooksFromAPI('');
                            }} 
                            value={this.state.bookName}></Input>
                            {this.state.showFlatList?(
                                <FlatList data={this.state.dataSource} 
                                renderItem={this.renderItem} enableEmptySections={true}
                                style={{marginTop : RFVale(10)}} keyExtractor={(item,index)=>{
                                    index.toString();
                                }}></FlatList>
                            ):(
                                <View style={{alignItems:'center'}}>
                                    <Input style={styles.formatTextInput} placeholder="Enter book author" 
                                        onChangeText={(text)=>{
                                this.setState({
                                    author : text,
                                })
                                }} value={this.state.author}></Input>
                                <Input style = {[styles.formatTextInput, {height : 300}]} 
                                multiline numberOfLines = {10} 
                                placeholder = "Why do you need the book?"
                                onChangeText={(text)=>{
                                    this.setState({
                                        reasonToRequest : text,
                                    })
                                }} value={this.state.reasonToRequest}></Input>
                                <TouchableOpacity style={[styles.button,{marginTop:RFValue(30)}]}
                                onPress = {()=>{
                                    this.addRequest(this.state.bookName,this.state.reasonToRequest,this.state.author)
                                }}>
                                    <Text style={styles.requestbuttontxt}>Request</Text>
                                </TouchableOpacity>
                                </View>
                            )}
                    </View>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    keyBoardStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      formTextInput: {
        width: "75%",
        height: RFValue(35),
        borderWidth: 1,
        padding: 10,
      },
      ImageView:{
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginTop:RFValue(20),
      },
      imageStyle:{
        height: RFValue(150),
        width: RFValue(150),
        alignSelf: "center",
        borderWidth: 5,
        borderRadius: RFValue(10),
      },
      bookstatus:{
        flex: 0.4,
        alignItems: "center",
      },
      requestedbookName:{
        fontSize: RFValue(30),
        fontWeight: "500",
        padding: RFValue(10),
        fontWeight: "bold",
        alignItems:'center',
        marginLeft:RFValue(60)
      },
      status:{
        fontSize: RFValue(20),
        marginTop: RFValue(30),
      },
      bookStatus:{
        fontSize: RFValue(30),
        fontWeight: "bold",
        marginTop: RFValue(10),
      },
      buttonView:{
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
      },
      buttontxt:{
        fontSize: RFValue(18),
        fontWeight: "bold",
        color: "#fff",
      },
      touchableopacity:{
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width: "90%",
      },
      requestbuttontxt:{
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
      },
      button: {
        width: "75%",
        height: RFValue(60),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(50),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
      },
})