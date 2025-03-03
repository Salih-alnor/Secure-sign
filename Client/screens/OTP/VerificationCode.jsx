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
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import resetCode from "../../assets/images/verification.png";
import back from "../../assets/icons/back.png";
import { useNavigation, useRoute } from "@react-navigation/native";
const { width } = Dimensions.get("screen");
import COLORS from "../../assets/colors";
import { verifyResetPassword } from "../../api/services/auth";

const VerificationCode = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsExpired(true); // عند انتهاء المؤقت
    }
  }, [timer]);

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  const handleChange = (index, value) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async (otp) => {
    // 1- get get verify code
    let verifyCode = "";
    for (let num in otp) {
      verifyCode += otp[num];
    }
    const email = route.params.email;
    // 2- send verifyCode to server to validate it

    try {
      setIsLoading(true)
      const response = await verifyResetPassword(email, verifyCode);
      if (response.Status === "Success") {
        setIsLoading(false);
        navigation.replace("reset-password", { email });
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(error.response.data.error);
    }
  };

  const ResendCode = async () => {
    // const email = route.params.email;

    setIsExpired(false);
    setTimer(60);
    await inputRefs[0].current.focus();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image style={styles.backIcon} resizeMode="contain" source={back} />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" source={resetCode} />
        </View>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the 4-digit code sent to you
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={(e) => handleKeyDown(index, e)}
              editable={!isExpired}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit(otp)}
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
              Confirm
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isExpired ? (
            <TouchableOpacity onPress={() => ResendCode()}>
              <Text
                style={{
                  color: COLORS.PRIMARY,
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Resend Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ marginTop: 10, color: COLORS.GRAY }}>
              You can resend code in{" "}
              <Text style={{ color: COLORS.PRIMARY, fontWeight: 500 }}>
                {timer}
              </Text>{" "}
              s
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VerificationCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
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
    marginTop: 50,
  },
  backIcon: {
    width: 25,
    height: 25,
    tintColor: COLORS.GRAY,
  },
  imageContainer: {
    width: width - 60,
    height: width - 60,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.DARK,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    color: COLORS.GRAY,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
});
