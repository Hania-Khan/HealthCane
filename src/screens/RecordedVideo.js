import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RecordedVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAlertIcon, setShowAlertIcon] = useState(false);
  const videoRef = useRef(null);
  let alertInterval;
  const alertMessageTimeoutRef = useRef(null);
  const alertIconTimeoutRef = useRef(null);

  const handlePress = (video) => {
    setSelectedVideo(video);
    setIsFullscreen(true);

    if (video === require("../../assets/Hammering.mp4")) {
      alertMessageTimeoutRef.current = setTimeout(() => {
        Alert.alert("⚠️ Alert", "Harmful Behaviour Detected!");
      }, 1000);

      alertIconTimeoutRef.current = setTimeout(() => {
        setShowAlertIcon(true);
      }, 1500);
    } else {
      setShowAlertIcon(false);
    }
  };

  const handleFullscreenExit = () => {
    setIsFullscreen(false);
    videoRef.current.pauseAsync();
    setShowAlertIcon(false);
    if (alertMessageTimeoutRef.current) {
      clearTimeout(alertMessageTimeoutRef.current);
    }
    if (alertIconTimeoutRef.current) {
      clearTimeout(alertIconTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (alertMessageTimeoutRef.current) {
        clearTimeout(alertMessageTimeoutRef.current);
      }
      if (alertIconTimeoutRef.current) {
        clearTimeout(alertIconTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isFullscreen && styles.fullscreenContainer,
      ]}
    >
      {!isFullscreen && (
        <>
          <TouchableOpacity
            onPress={() => handlePress(require("../../assets/Hammering.mp4"))}
          >
            <Text style={styles.text}>Hammering</Text>
            <Video
              ref={videoRef}
              source={require("../../assets/Hammering.mp4")}
              style={styles.video}
              controls={selectedVideo === require("../../assets/Hammering.mp4")}
              resizeMode="contain"
              useNativeControls
              isLooping
            />
            {showAlertIcon && (
              <Icon
                name="exclamation-triangle"
                size={60}
                color="#FF0000"
                style={styles.alertIcon}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress(require("../../assets/HullaHoop.mp4"))}
          >
            <Text style={styles.text}>Hulla Hoop</Text>
            <Video
              ref={videoRef}
              source={require("../../assets/HullaHoop.mp4")}
              style={styles.video}
              controls={selectedVideo === require("../../assets/HullaHoop.mp4")}
              resizeMode="contain"
              useNativeControls
              isLooping
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress(require("../../assets/Hammering1.mp4"))}
          >
            <Text style={styles.text}>Hammering 1</Text>
            <Video
              ref={videoRef}
              source={require("../../assets/Hammering1.mp4")}
              style={styles.video}
              controls={
                selectedVideo === require("../../assets/Hammering1.mp4")
              }
              resizeMode="contain"
              useNativeControls
              isLooping
            />
          </TouchableOpacity>
        </>
      )}

      {isFullscreen && (
        <TouchableOpacity onPress={handleFullscreenExit}>
          <Video
            ref={videoRef}
            source={selectedVideo}
            style={styles.videoFullscreen}
            resizeMode="contain"
            shouldPlay
            useNativeControls={false}
          />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    backgroundColor: "#fff", // Set background color to white
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 16,
  },
  videoFullscreen: {
    width: windowWidth,
    height: windowHeight,
  },
  text: {
    color: "#000", // Set text color to black
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  alertIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }], // Adjust these values to center the icon
  },
});

export default RecordedVideo;
