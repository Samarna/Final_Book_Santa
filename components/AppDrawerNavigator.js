import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Icon} from "react-native-elements";
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
        screen:AppTabNavigator,
        navigationOptions : {drawerIcon :
            <Icon name="home" type="fontawesome5"></Icon>
        }
    },
    MyDonations : {
        screen:MyDonationsScreen,
        navigationOptions : {drawerIcon : 
            <Icon name="gift" type="font-awesome"></Icon>,
            drawerLabel : "My Donations"
        }
    },
    Settings : {
        screen:SettingsScreen,
        navigationOptions : {drawerIcon :
            <Icon name="settings" type="fontawesome5"></Icon>,
        }
    },
    Notifications : {screen:NotificationsScreen,
        navigationOptions : {drawerIcon :
            <Icon name="bell" type="font-awesome"></Icon>,
                }
    },
    MyReceivedBooks : {
        screen:MyReceivedBooksScreen,
        navigationOptions : {drawerIcon :
            <Icon name="gift" type="font-awesome"></Icon>,
            drawerLabel : "My Received Books"
        }
    },
},{
    contentComponent : CustomSideBarMenu
},{
    initialRouteName : 'Home'
}) 