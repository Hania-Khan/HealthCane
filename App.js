import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaregiverLogin from "./src/screens/CaregiverLogin";
import CaregiverSignUp from "./src/screens/CaregiverSignUp";
import CaregiverHome from "./src/screens/CaregiverHome";
import CaregiverProfile from "./src/screens/CaregiverProfile";
import PatientHome from "./src/screens/PatientHome";
import PatientSignUp from "./src/screens/PatientSignUp";
import PatientLogin from "./src/screens/PatientLogin";
import PatientProfile from "./src/screens/PatientProfile";
import Welcome from "./src/screens/Welcome";
import ViewCamera from "./src/screens/ViewCamera"
import GenerateAlert from "./src/screens/GenerateAlert";
import OpenMobCamera from "./src/screens/OpenMobCamera";
import RecordedVideo from "./src/screens/RecordedVideo";
import VideoPlayer from "./src/screens/VideoPlayer";
import MedicationReminders from "./src/screens/MedicationReminders";
// import Chat from "./src/screens/ChatScreen";
import MealTracking from "./src/screens/MealTracking";
import HealthInsights from "./src/screens/HealthInsights";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PatientLogin"
          component={PatientLogin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PatientProfile"
          component={PatientProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PatientHome"
          component={PatientHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PatientSignUp"
          component={PatientSignUp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CaregiverLogin"
          component={CaregiverLogin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CaregiverSignUp"
          component={CaregiverSignUp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CaregiverHome"
          component={CaregiverHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CaregiverProfile"
          component={CaregiverProfile}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="ViewCamera"
          component={ViewCamera}
          options={{
            headerShown: false,
          }}
        /> 
         <Stack.Screen
          name="GenerateAlert"
          component={GenerateAlert}
          options={{
            headerShown: false,
          }}
        /> 
        <Stack.Screen
          name="OpenMobCamera"
          component={OpenMobCamera}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="RecordedVideo"
          component={RecordedVideo}
          options={{
            headerShown: false,
          }}
        /> 
         <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayer}
          options={{
            headerShown: false,
          }}
        /> 

        <Stack.Screen
          name="MedicationReminders"
          component={MedicationReminders}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MealTracking"
          component={MealTracking}
          options={{
            headerShown: false,
          }}
        />
 <Stack.Screen
          name="HealthInsights"
          component={HealthInsights}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
