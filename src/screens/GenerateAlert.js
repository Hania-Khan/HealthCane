import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Vibration, StyleSheet } from 'react-native';
import { RNCamera as Camera } from 'react-native-camera'; // Correct import for react-native-camera

const GenerateAlert = () => {
  const [abnormalBehaviorDetected, setAbnormalBehaviorDetected] = useState(false);

  // Dummy function to simulate abnormal behavior detection
  const checkForAbnormalBehavior = () => {
    // Replace this condition with your actual abnormal behavior detection logic
    if (Math.random() < 0.1) {
      setAbnormalBehaviorDetected(true);
      Vibration.vibrate([200, 200, 200]); // Vibrate for 200ms, pause for 200ms, and repeat
    }
  };

  useEffect(() => {
    // Simulate checking for abnormal behavior every 5 seconds
    const interval = setInterval(() => {
      checkForAbnormalBehavior();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (abnormalBehaviorDetected) {
      showAlert();
    }
  }, [abnormalBehaviorDetected]);

  const showAlert = () => {
    Alert.alert(
      'Abnormal Behavior Detected',
      'Please review the video stream for unusual activity.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Video Stream */}
      <Camera style={styles.camera} />

      {/* Flag */}
      <View style={styles.flag}>
        <Text>Flag Component</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  flag: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
});

export default GenerateAlert;
