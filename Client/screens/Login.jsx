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
import loginImage from "../assets/images/login.png";
import email from "../assets/icons/email.png";
import lock from "../assets/icons/lock.png";
import showEye from "../assets/icons/show-eye.png";
import closeEye from "../assets/icons/close-eye.png";
import googleIcon from "../assets/icons/google-icon.png";
import instagramIcon from "../assets/icons/instagram-icon.png";
import xIcon from "../assets/icons/x-icon.png";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import COLORS from "../assets/colors";
import { login } from "../api/services/auth";

const Login = () => {
  const navigation = useNavigation();
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
          {placeholder === "Password" ? (
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
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .min(8, "Password too short...")
      .required("Password is required"),
  });

  const handleFormSubmit = async (values) => {
    const { email, password } = values;
   try {
    // console.log(values)
    const response = await login(email, password)
    if(response.Status === "Success") {
      navigation.navigate("home")
    }
    
   } catch (error) {
    Alert.alert(error.response.data.error)
   }
   
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            source={loginImage}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: COLORS.DARK,
          }}
        >
          Log In
        </Text>

        <View style={styles.formWrapper}>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => handleFormSubmit(values)}
            validationSchema={validationSchema}
          >
            {(formikProps) => {
              return (
                <React.Fragment>
                  <InputFilad
                    placeholder="Email"
                    keyboardType="email-address"
                    icon={email}
                    formikProps={formikProps}
                    formikKey="email"
                    value={formikProps.values["email"]}
                  />

                  <InputFilad
                    placeholder="Password"
                    keyboardType="default"
                    icon={lock}
                    formikProps={formikProps}
                    secureTextEntry={hidePassword}
                    formikKey="password"
                    value={formikProps.values["password"]}
                  />

                  <View style={styles.forgetPassword}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate("forgot-password")}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: Platform.OS == "ios" ? 600 : 500,
                          color: COLORS.GRAY,
                        }}
                      >
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>

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
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            }}
          </Formik>
          <View
            style={{
              width: width - 32,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.line}></View>
            <Text
              style={{
                color: COLORS.GRAY,
                fontWeight: "500",
              }}
            >
              or
            </Text>
            <View style={styles.line}></View>
          </View>
        </View>
        <View style={styles.otherAccounts}>
          <TouchableOpacity style={styles.account}>
            <Image style={styles.accountImage} source={googleIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.account, { marginHorizontal: 20 }]}>
            <Image style={styles.accountImage} source={xIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.account}>
            <Image style={styles.accountImage} source={instagramIcon} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: COLORS.GRAY,
            }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.PRIMARY,
              }}
            >
              {"  "}
              Sign Up!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

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
    width: 50,
    height: 50,
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
    width: "60%",
    height: "60%",
  },
});
