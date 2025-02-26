import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import resetCode from "../../assets/images/reset-code.png";
import lock from "../../assets/icons/lock.png";
import back from "../../assets/icons/back.png";
import showEye from "../../assets/icons/show-eye.png";
import closeEye from "../../assets/icons/close-eye.png";

import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation, useRoute } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import COLORS from "../../assets/colors";
import { updatePassword } from "../../api/services/auth";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [hidePassword, setHidePassword] = useState(true);
  const InputFilad = ({
    placeholder,
    keyboardType,
    formikProps,
    formikKey,
    icon,
    ...rest
  }) => {
    const inputWrapper = {
      width: width - 40,
      borderColor: COLORS.LIGHT_GRAY,
      borderWidth: Platform.OS == "ios" ? 0.3 : 0.9,
      borderRadius: 5,
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      marginVertical: 10,
      marginBottom: 0,
      backgroundColor: COLORS.LIGHT_GRAY,
    };

    const inputAndIconWrapper = {
      flexDirection: "row",
      alignItems: "center",
    };

    const iconInput = {
      width: 20,
      height: 20,
    };

    const input = {
      paddingLeft: 8,
      width: width - 100,
      fontSize: 16,
      color: COLORS.secondaryColor,
    };

    if (formikProps.errors[formikKey] && formikProps.touched[formikKey]) {
      inputWrapper.borderColor = COLORS.DANGER;
    }

    return (
      <View>
        <View style={inputWrapper}>
          <View style={inputAndIconWrapper}>
            <View style={iconInput}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  tintColor: COLORS.GRAY,
                }}
                source={icon}
              />
            </View>
            <TextInput
              keyboardType={keyboardType}
              placeholder={placeholder}
              onBlur={formikProps.handleBlur(formikKey)}
              placeholderTextColor={COLORS.secondaryColor}
              onChangeText={formikProps.handleChange(formikKey)}
              style={input}
              {...rest}
            />
          </View>
          {placeholder === "New-password" ? (
            <TouchableOpacity
              style={iconInput}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  tintColor: COLORS.GRAY,
                }}
                source={hidePassword ? closeEye : showEye}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text
          style={{
            color: COLORS.DANGER,
          }}
        >
          {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
        </Text>
      </View>
    );
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password too short...")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "The passwords must match")
      .required("Confirm password is required"),
  });

  const handleFormSubmit = async (values) => {
    const { password } = values;
    const email = route.params.email;
    // console.log(password, confirm_password);
    try {
      const response = await updatePassword(email, password);
      if (response.Status === "Success") {
        navigation.navigate("login");
      }
    } catch (error) {
      Alert.alert(error.response.data.error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: "transparent",
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 5,
            width: 50,
            height: 50,
            borderColor: COLORS.LIGHT_GRAY,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: -70,
            marginTop: 50,
          }}
        >
          <Image
            style={{
              width: 25,
              height: 25,
              tintColor: COLORS.GRAY,
            }}
            resizeMode="contain"
            source={back}
          />
        </TouchableOpacity>
        <View
          style={{
            width: width - 60,
            height: width - 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 250,
            }}
            resizeMode="contain"
            source={resetCode}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.DARK,
          }}
        >
          Reset password
        </Text>

        <View style={styles.formWrapper}>
          <Formik
            initialValues={{
              password: "",
              confirm_password: "",
            }}
            onSubmit={(values) => handleFormSubmit(values)}
            validationSchema={validationSchema}
          >
            {(formikProps) => {
              return (
                <React.Fragment>
                  <InputFilad
                    placeholder="New-password"
                    keyboardType="default"
                    icon={lock}
                    formikProps={formikProps}
                    formikKey="password"
                    value={formikProps.values["password"]}
                    secureTextEntry={hidePassword}
                  />

                  <InputFilad
                    placeholder="Confirm-password"
                    keyboardType="default"
                    icon={lock}
                    formikProps={formikProps}
                    formikKey="confirm_password"
                    value={formikProps.values["confirm_password"]}
                    secureTextEntry={hidePassword}
                  />

                  <TouchableOpacity
                    onPress={formikProps.handleSubmit}
                    style={{
                      marginTop: 30,
                      width: width - 40,
                      backgroundColor: COLORS.PRIMARY,
                      height: 60,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: COLORS.LIGHT,
                        fontWeight: 500,
                      }}
                    >
                      Update password
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  formWrapper: {
    marginVertical: 20,
  },

  forgetPassword: {
    alignItems: "flex-end",
  },

  line: {
    width: "40%",
    height: 0.6,
    backgroundColor: "#ddd",
  },

  otherAccounts: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  account: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  accountLogo: {
    width: 30,
    height: 30,
    marginRight: 20,
  },

  accountImage: {
    width: "70%",
    height: "70%",
  },
});
