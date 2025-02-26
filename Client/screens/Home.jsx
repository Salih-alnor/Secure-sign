import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import COLORS from "../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../api/services/auth";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home page</Text>
      <TouchableOpacity
      onPress={ async() => {
        logout()
        navigation.replace('login')
      }}
      >
        <Text
          style={{
            color: COLORS.DANGER,
            fontWeight: "500",
            fontSize: 16,
            marginTop: 50,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
