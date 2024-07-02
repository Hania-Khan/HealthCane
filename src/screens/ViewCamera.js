import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import { StatusBar } from "expo-status-bar";

const ViewCamera = () => {
  const video = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // Control video playback
  const [showFallDetected, setShowFallDetected] = useState(false);
  const [showRedBoundary, setShowRedBoundary] = useState(false);

  useEffect(() => {
    if (video.current) {
      video.current.loadAsync(require("../../assets/FallVideo.mp4"));
      video.current.playAsync();
      setTimeout(() => {
        setShowFallDetected(true);
      }, 4050); // Show "Fall detected" after 4 seconds
      setTimeout(() => {
        setShowRedBoundary(true);
      }, 4050); // Show red boundary after 4 seconds
    }
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        useNativeControls
        resizeMode="contain" // Use "cover" to fill the whole screen horizontally
        isLooping
        onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
      />

      <StatusBar style="auto" />

      {showRedBoundary && <View style={styles.redBoundary} />}

      {showFallDetected && (
        <View style={styles.fallDetectedContainer}>
          <Text style={styles.fallDetectedText}>Fall detected</Text>
        </View>
      )}

      {/* Mic Icon for Talk */}
      <TouchableOpacity style={styles.micButton}>
        <Ionicons name="mic" size={36} color="white" />
        <Text style={styles.micText}>Speak</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
    height: "100%",
  },
  icon: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  iconText: {
    position: "absolute",
    top: 20,
    left: 70,
    color: "red",
  },
  micButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 20,
  },
  micText: {
    marginLeft: 5,
    color: "white",
  },
  fallDetectedContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 10,
  },
  fallDetectedText: {
    color: "white",
  },
  redBoundary: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 200, // Specify the width of the red box
    height: 200, // Specify the height of the red box
    marginLeft: -100, // Adjust based on half of the width
    marginTop: -100, // Adjust based on half of the height
    borderColor: "red", // Set the border color to red
    borderWidth: 4, // Set the border width
  },
});

export default ViewCamera;
