// import { View, Text } from 'react-native';
// import React, {useEffect, useState} from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import LoginScreen from "../../../../Projects/tmb-app/components/LoginScreen"
// export default function AccountScreen(){
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//
//     useEffect(() => {
//         AsyncStorage.getItem('token').then((token) => {
//             setIsLoggedIn(!!token);
//         });
//     }, []);
//
//     if (!isLoggedIn) return  <LoginScreen onSuccess={() => setIsLoggedIn(true)} />;
//
//     return (
//         <View><Text>Account</Text></View>
//     )
// }

import React from "react";
import { View, Text } from "react-native";

export function AccountScreen() {
    return (
        <View>
            <Text>Account</Text>
        </View>
    );
}
