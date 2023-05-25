import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native";

import { StatusBar } from "expo-status-bar";
import { styles } from "./styles";
import RegistrationForm from "./RegistrationForm";
import { AuthContext } from "../../store/auth-context"

export default function RegistrationScreen({ navigation }) {
    return (

        <>
            <SafeAreaView style={styles.topSafeArea} />

            <StatusBar style="light" />

            <SafeAreaView style={styles.container}>
                <RegistrationForm navigation={navigation} />
            </SafeAreaView>
        </>
    );
}
