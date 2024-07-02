// VideoPlayer.js

import React from 'react';
import { View } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ route }) => {
  const { videoUri } = route.params || { videoUri: null };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Video
        source={{ uri: videoUri }}
        style={{ width: 300, height: 200 }}
        useNativeControls
        resizeMode="contain"
        isLooping
      />
    </View>
  );
};

export default VideoPlayer;
