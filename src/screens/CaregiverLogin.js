import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { FirebaseError } from "firebase/app";

const CaregiverLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          "-------------User signed in-----------------: ",
          userCredential.user
        );
        // You can navigate to the home page here if you want
        navigation.replace("CaregiverHome");
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/invalid-email":
              console.error("The email address is not valid.");
              break;
            case "auth/user-disabled":
              console.error(
                "The user corresponding to the given email has been disabled."
              );
              break;
            case "auth/user-not-found":
              console.error(
                "There is no user corresponding to the given email."
              );
              break;
            case "auth/wrong-password":
              console.error("The password is invalid for the given email.");
              break;
            default:
              console.error(error);
          }
        }
      });
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          padding: 10,
        }}
      >
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <Text style={{ marginRight: 10 }}>Loading</Text>
            <ActivityIndicator size="large" color={"red"} />
          </View>
        ) : (
          <KeyboardAvoidingView>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 100,
              }}
            >
              <Text
                style={{ fontSize: 30, color: "#662d91", fontWeight: "bold" }}
              >
                Caregiver Login
              </Text>

              <Text style={{ fontSize: 18, marginTop: 100, fontWeight: "600" }}>
                Login to your account
              </Text>
            </View>

            <View style={{ marginTop: 50 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="black"
                />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholderTextColor="black"
                  style={{
                    fontSize: email ? 18 : 18,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    marginLeft: 13,
                    width: 300,
                    marginVertical: 10,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="key-outline" size={24} color="black" />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="black"
                  style={{
                    fontSize: password ? 18 : 18,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    marginLeft: 13,
                    width: 300,
                    marginVertical: 20,
                  }}
                />
              </View>

              <Pressable
                onPress={login}
                style={{
                  width: 200,
                  backgroundColor: "#318CE7",
                  padding: 15,
                  borderRadius: 7,
                  marginTop: 50,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text
                  style={{ fontSize: 18, textAlign: "center", color: "white" }}
                >
                  Login
                </Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("CaregiverSignUp")}
                style={{ marginTop: 20 }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    color: "gray",
                    fontWeight: "500",
                  }}
                >
                  Don't have a account? Signup
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CaregiverLogin;

const styles = StyleSheet.create({});
