import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "@react-native-community/datetimepicker";
import EmailConfirmScreen from "../EmailConfirm/EmailConfirmScreen";
import { Formik } from "formik";
import { validationSchema } from "./validation";
import { styles } from "./styles";
import { Alert } from "react-native";
import { brFormatDate, formatDate } from "./../../utils/date";
import createUser from "./../../services/users/createUser";
import getUser from "../../services/users/getUser";
import { login } from "../../services/users/login";
import {
  handleAuthenticate,
  handleLogout,
} from "./../../store/redux/authentication";
import { useDispatch } from "react-redux";

export default function RegistrationForm({ navigation }) {
  const dispatch = useDispatch();
  const ErrorMessage = ({ errorValue }) => {
    return errorValue ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorValue}</Text>
      </View>
    ) : null;
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("Gender");

  const onSubmitHandler = async (userData) => {
    userData.birthDate = formatDate(birthDate);
    userData.gender = gender;

    try {
      var res = await createUser(userData);
      if (res.status == 201) {
        const { token, user_id } = await login(
          res.data.email,
          userData.password,
          navigation
        );

        res = await getUser(user_id, token);

        const user = res.data;

        if (user.emailCheck == false) {
          navigation.navigate("EmailConfirmScreen", {
            user: user,
            authToken: token,
          });
        } else {
          dispatch(handleAuthenticate({ token, user }));
        }
      }
    } catch (error) {
      Alert.alert(`erro: ${error}`);
      dispatch(handleLogout());
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        gender: "",
        birthDate: "",
        university: "",
        password: "",
        confirmPassword: "",
        phone: "",
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
        setFieldValue,
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

            <ErrorMessage errorValue={touched.name && errors.name} />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              autoCapitalize="none"
              placeholder="E-mail"
            />

            <ErrorMessage errorValue={touched.email && errors.email} />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input} // Use the same style as other inputs
              value={values.phone}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
              autoCapitalize="none"
              placeholder="12 992929999"
            />
            <ErrorMessage errorValue={touched.phone && errors.phone} />
          </View>
          <View style={styles.dualFormGroup}>
            <View style={styles.containerPicker}>
              <View style={styles.inputPicker}>
                <Picker
                  selectedValue={gender}
                  value={gender}
                  onBlur={handleBlur("gender")}
                  style={styles.picker}
                  onValueChange={(item, indexItem) => {
                    setGender(item);
                    setFieldValue("gender", item);
                  }}
                >
                  <Picker.Item
                    style={styles.pickerText}
                    key={0}
                    label="Gênero"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerSelect}
                    key={1}
                    label="Masculino"
                    value="male"
                  />
                  <Picker.Item
                    style={styles.pickerSelect}
                    key={2}
                    label="Feminino"
                    value="female"
                  />
                  <Picker.Item
                    style={styles.pickerSelect}
                    key={3}
                    label="Outro"
                    value="other"
                  />
                </Picker>
              </View>
              <ErrorMessage errorValue={touched.gender && errors.gender} />
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(true);
                }}
              >
                <View style={styles.input}>
                  <Text id="a" style={styles.inputText}>
                    {brFormatDate(birthDate)}
                  </Text>
                </View>
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
          </View>

          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              value={values.university}
              onChangeText={handleChange("university")}
              onBlur={handleBlur("university")}
              placeholder="Universidade"
            />

            <ErrorMessage
              errorValue={touched.university && errors.university}
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

            <ErrorMessage errorValue={touched.password && errors.password} />
          </View>

          <View style={styles.formGroup}>
            <TextInput
              class="confirmPassword"
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
  );
}
