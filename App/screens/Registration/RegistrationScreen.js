import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import * as yup from "yup";
import { validationSchema } from "./validation";

import DatePicker from '@react-native-community/datetimepicker'

import { styles } from "./styles";
import { saveUser } from "../../services/users/post";

const ErrorMessage = ({ errorValue }) => {
    return errorValue ? (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorValue}</Text>
        </View>
    ) : null;
};

export default function RegistrationScreen({ navigation }) {
    const [birthDate, setBirthDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);

    function onSubmitHandler(userData) {
        userData.birthDate = formatDate(birthDate)
        userData.username = userData.email
        delete userData.email
        delete userData.confirmPassword

        console.log(userData)
        saveUser(userData)

        console.log(navigation);
        navigation.navigate("HomeScreen");
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }

    return (
        <>
            <SafeAreaView style={styles.topSafeArea} />

            <StatusBar style="light" />

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.nav}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/images/logo.png')}
                        />
                        <TouchableOpacity style={styles.back} onPress={console.log("a")}>
                            <Image
                                style={styles.back}
                                source={require('../../assets/images/voltar.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* https://formik.org/docs/overview */}
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        enroll: Math.random().toString(36).substring(2, 7),
                        birthDate: birthDate
                    }}
                    onSubmit={(values) => {
                        onSubmitHandler(values);
                    }}
                    validationSchema={validationSchema}
                >
                    {({
                        handleChange,
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        handleBlur,
                    }) => (
                        // https://github.com/APSL/react-native-keyboard-aware-scroll-view
                        <KeyboardAwareScrollView
                            style={styles.content}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.formGroup}>
                                <TextInput
                                    style={styles.input}
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    placeholder="Nome"
                                />

                                <ErrorMessage
                                    errorValue={touched.name && errors.name}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <TextInput
                                    style={styles.input}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    autoCapitalize="none"
                                    placeholder="Email"
                                />

                                <ErrorMessage errorValue={touched.email && errors.email} />
                            </View>
                            <View style={styles.formGroup}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowDatePicker(true);
                                    }}
                                >
                                    <Text style={styles.input}>Data de nascimento
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DatePicker
                                        testID="datePicker"
                                        value={birthDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || birthDate;
                                            setShowDatePicker(false);
                                            setBirthDate(currentDate);
                                        }}
                                    />
                                )}
                                <ErrorMessage
                                    errorValue={touched.birthDate && errors.birthDate}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <TextInput
                                    style={styles.input}
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    autoCapitalize="none"
                                    secureTextEntry={true}
                                    placeholder="Senha"
                                />

                                <ErrorMessage
                                    errorValue={touched.password && errors.password}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <TextInput
                                    style={styles.input}
                                    value={values.confirmPassword}
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    autoCapitalize="none"
                                    secureTextEntry={true}
                                    placeholder="Confirmar senha"
                                />

                                <ErrorMessage
                                    errorValue={touched.confirmPassword && errors.confirmPassword}
                                />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>CRIAR CONTA</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
            </SafeAreaView >
        </>
    );
}
