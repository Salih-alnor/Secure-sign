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
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import registerImage from "../assets/images/register.png";
import user from "../assets/icons/user.png";
import email from "../assets/icons/email.png";
import lock from "../assets/icons/lock.png";
import showEye from "../assets/icons/show-eye.png";
import closeEye from "../assets/icons/close-eye.png";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import COLORS from "../assets/colors";
import { register } from "../api/services/auth";

const Register = () => {
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
      color: COLORS.DARK_GRAY,
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
              placeholderTextColor={COLORS.GRAY}
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
    const { name, email, password } = values;
    try {
      setIsLoading(true);
      const response = await register(name, email, password);
      if (response.Status === "Success") {
        setIsLoading(false);
        navigation.replace("home");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(error.response.data.error);
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
            source={registerImage}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: COLORS.DARK,
          }}
        >
          Sign Up
        </Text>

        <View style={styles.formWrapper}>
          <Formik
            initialValues={{
              name: "",
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
                    placeholder="User Name"
                    keyboardType="default"
                    icon={user}
                    formikProps={formikProps}
                    formikKey="name"
                    value={formikProps.values["name"]}
                  />

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
                      marginBottom: 10,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={COLORS.LIGHT}
                        animating={isLoading}
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: COLORS.LIGHT,
                          fontWeight: 500,
                        }}
                      >
                        Sign up
                      </Text>
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              );
            }}
          </Formik>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: COLORS.GRAY,
            }}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.PRIMARY,
              }}
            >
              {"  "}
              Login!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;

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
