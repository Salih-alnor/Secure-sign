import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import logo from "../assets/icons/splash.png";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("login");
    }, 2000);
  });
  return (
    <View style={styles.container}>
      <Image
        style={{
          height: 200,
          width: 200,
        }}
        resizeMode="contain"
        source={logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
});
