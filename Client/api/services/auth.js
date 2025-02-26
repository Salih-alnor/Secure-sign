import api from "../index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email_address, password) => {
  try {
    const response = await api.post("/auth/login", { email_address, password });
    await AsyncStorage.setItem("token", response.data.token);
    await AsyncStorage.setItem(
      "userInfo",
      JSON.stringify(response.data.userInfo)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (user_name, email_address, password) => {
  try {
    const response = await api.post("/auth/register", {
      user_name,
      email_address,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email_address) => {
  try {
    const response = await api.post("/auth/reset-password", { email_address });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyResetPassword = async (email_address, reset_code) => {
  try {
    const response = await api.post("/auth/verify-reset-password", {
      email_address,
      reset_code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (email_address, new_password) => {
  try {
    const response = await api.post("/auth/update-password", {
      email_address,
      new_password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const logout = async () => {
  // await CookieManager.clearAll();
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userInfo");
};
