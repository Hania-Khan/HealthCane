import { ScrollView, View, Text, Pressable, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../constants/colors";
import Button from "../components/Button1";

const Welcome = ({ navigation }) => {
  return (
    <LinearGradient
      style={{
        flex: 1,
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View>
            <Image
              source={require("../../assets/hero1.jpg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
                position: "absolute",
                top: 10,
                transform: [
                  { translateX: 20 },
                  { translateY: 50 },
                  { rotate: "-15deg" },
                ],
              }}
            />

            <Image
              source={require("../../assets/hero3.jpg")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 20,
                position: "absolute",
                top: -30,
                left: 100,
                transform: [
                  { translateX: 50 },
                  { translateY: 50 },
                  { rotate: "-5deg" },
                ],
              }}
            />

            <Image
              source={require("../../assets/hero3.jpg")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                position: "absolute",
                top: 130,
                left: -50,
                transform: [
                  { translateX: 50 },
                  { translateY: 50 },
                  { rotate: "15deg" },
                ],
              }}
            />

            <Image
              source={require("../../assets/hero2.jpg")}
              style={{
                height: 200,
                width: 200,
                borderRadius: 20,
                position: "absolute",
                top: 110,
                left: 100,
                transform: [
                  { translateX: 50 },
                  { translateY: 50 },
                  { rotate: "-15deg" },
                ],
              }}
            />
          </View>

          {/* content  */}

          <View
            style={{
              paddingHorizontal: 22,
              // position: "absolute",
              // top: 400,
              paddingTop: 400, // Adjusted the top padding to maintain the original layout
              paddingBottom: 20, // Added some padding at the bottom
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 50,
                fontWeight: 800,
                color: COLORS.white,
              }}
            >
              Let's Get Started with
            </Text>
            <Text
              style={{
                fontSize: 46,
                fontWeight: 800,
                color: COLORS.white,
              }}
            >
              HealthCane
            </Text>

            <View style={{ marginVertical: 22 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  marginVertical: 4,
                }}
              >
                A One stop solution for all
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                }}
              >
                your Caretaker needs
              </Text>
            </View>

            {/* <Button
            title="Join Now"
            onPress={() => navigation.navigate("SignUp")}
            style={{
              marginTop: 22,
              width: "100%",
            }}
          /> */}
            <Button
              title="Signup as Patient"
              onPress={() => navigation.navigate("PatientSignUp")} // Ensure "PatientSignUp" is correctly defined in your navigation stack
              style={{
                marginTop: 22, // Adjust style as needed
                width: "100%", // Ensure your Button component supports these props
              }}
            />
            <Button
              title="Signup as Caregiver"
              onPress={() => navigation.navigate("CaregiverSignUp")} // Ensure "CaregiverSignUp" is correctly defined in your navigation stack
              style={{
                marginTop: 12, // Maintain consistent spacing
                width: "100%", // Ensure your Button component supports these props
              }}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                justifyContent: "center",
                flexWrap: "wrap", // Add this if your buttons might not fit in a single row
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  alignSelf: "center", // Ensure alignment if using flexWrap
                }}
              >
                Already have an account ?
              </Text>
              <Button
                title="Login as Patient"
                onPress={() => navigation.navigate("PatientLogin")} // Ensure "PatientSignUp" is correctly defined in your navigation stack
                style={{
                  marginTop: 22, // Adjust style as needed
                  width: "100%", // Ensure your Button component supports these props
                }}
              />
              <Button
                title="Login as Caregiver"
                onPress={() => navigation.navigate("CaregiverLogin")} // Ensure "PatientSignUp" is correctly defined in your navigation stack
                style={{
                  marginTop: 12, // Adjust style as needed
                  width: "100%", // Ensure your Button component supports these props
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "center",
                }}
              ></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Welcome;
