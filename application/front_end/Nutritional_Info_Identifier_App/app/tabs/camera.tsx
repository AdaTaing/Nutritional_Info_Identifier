import { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <View />;
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.6,
    });

    console.log("Captured image:", photo.uri);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />

      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 75,
    height: 75,
    borderRadius: 37,
    backgroundColor: "#fff",
  },
});
