import { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { setLatestPhoto } from "../../scanStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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

    setLatestPhoto(photo.uri);
    router.push("/tabs/food");
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />

      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      />

      <View style={styles.bottomNavContainer}>
        <View style={styles.togglePill}>

          <View style={styles.toggleActive}>
            <Text style={styles.toggleTextActive}>Scan</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.toggleInactive} 
            onPress={() => router.push("/tabs/food")}
          >
            <Text style={styles.toggleTextInactive}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    bottom: 130, 
    alignSelf: "center",
    width: 75,
    height: 75,
    borderRadius: 37,
    backgroundColor: "#fff",
  },
  
  bottomNavContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    height: 64,
    borderRadius: 32,
    padding: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  toggleActive: {
    flex: 1,
    backgroundColor: '#EB9E64', 
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'InstrumentSerif',
  },
  toggleTextInactive: {
    color: '#EB9E64',
    fontSize: 24,
    fontFamily: 'InstrumentSerif',
  },
});