import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const CaregiverSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const navigation = useNavigation();

  const register = async () => {
    if (
      email === "" ||
      password === "" ||
      phone === "" ||
      age === "" ||
      firstName === "" ||
      lastName === "" ||
      gender === "" ||
      uniqueId === "" ||
      confirmPassword === ""
    ) {
      Alert.alert(
        "Invalid Details",
        "Please fill all the details",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else if (password !== confirmPassword) {
      Alert.alert(
        "Invalid Details",
        "Passwords do not match",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("user credential", userCredential);
          const user = userCredential.user;
          const myUserUid = user.uid;

          // Wait for the user to be signed in before reading from Firestore
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const uniqueIdQuery = await getDocs(collection(db, "caregivers"));
              const uniqueIdExists = uniqueIdQuery.docs.some(
                (doc) => doc.data().uniqueId === uniqueId
              );

              if (uniqueIdExists) {
                Alert.alert(
                  "Invalid Details",
                  "Unique ID already exists",
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                  { cancelable: false }
                );
              } else {
                setDoc(doc(db, "caregivers", myUserUid), {
                  email: user.email,
                  phone: phone,
                  age: age,
                  firstName: firstName,
                  lastName: lastName,
                  gender: gender,
                  uniqueId: uniqueId,
                }).then(() => {
                  // After the user data has been set in Firestore, navigate to the Home page
                  navigation.navigate("CaregiverHome");
                });
              }
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
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
        <KeyboardAvoidingView>
          <ScrollView>
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
                Caregiver Signup
              </Text>

              <Text style={{ fontSize: 18, marginTop: 100, fontWeight: "600" }}>
                Create a new Account
              </Text>
            </View>

            <View style={{ marginTop: 50 }}>
              {/* First Name Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color="black"
                />
                <TextInput
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                  placeholder="First Name"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Last Name Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color="black"
                />
                <TextInput
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                  placeholder="Last Name"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Email Input */}
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
                  style={styles.input}
                />
              </View>
              {/* Unique ID Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="identifier"
                  size={24}
                  color="black"
                />
                <TextInput
                  value={uniqueId}
                  onChangeText={(text) => setUniqueId(text)}
                  placeholder="Unique ID"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Password Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="key-outline" size={24} color="black" />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Confirm Password Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="key-outline" size={24} color="black" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  secureTextEntry={true}
                  placeholder="Confirm Password"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Phone Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="phone" size={24} color="black" />
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholder="Phone No"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Age Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person-outline" size={24} color="black" />
                <TextInput
                  value={age}
                  onChangeText={(text) => setAge(text)}
                  placeholder="Age"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Gender Input */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={24}
                  color="black"
                />
                <TextInput
                  value={gender}
                  onChangeText={(text) => setGender(text)}
                  placeholder="Gender"
                  placeholderTextColor="black"
                  style={styles.input}
                />
              </View>

              {/* Signup Button */}
              <Pressable onPress={register} style={styles.button}>
                <Text style={styles.buttonText}>Signup</Text>
              </Pressable>

              {/* Navigation to Login */}
              <Pressable
                onPress={() => navigation.navigate("CaregiverLogin")}
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
                  Already have an account? Login
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CaregiverSignUp;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginLeft: 13,
    width: 300,
    marginVertical: 10,
  },
  button: {
    width: 200,
    backgroundColor: "#318CE7",
    padding: 15,
    borderRadius: 7,
    marginTop: 50,
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
});
