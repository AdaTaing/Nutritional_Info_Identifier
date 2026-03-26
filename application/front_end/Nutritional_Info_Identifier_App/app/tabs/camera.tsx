import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  ActivityIndicator
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { setLatestPhoto } from "../../scanStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const API_URL = "http://192.168.2.93:8000/analyze";

export default function CameraScreen() {

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

    try {

      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({

        quality: 0.6,

      });

      setLatestPhoto(photo.uri);

      const formData = new FormData();

      formData.append("image", {

        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",

      } as any);

      await fetch(API_URL, {

        method: "POST",
        body: formData,

      });

      router.push("/tabs/food");

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <View style={styles.container}>

      <CameraView

        ref={cameraRef}

        style={styles.camera}

      />

      {loading && (

        <View style={styles.loadingOverlay}>

          <ActivityIndicator size="large" color="white" />

          <Text style={styles.loadingText}>

            analyzing food...

          </Text>

        </View>

      )}

      <TouchableOpacity

        style={styles.captureButton}

        onPress={takePicture}

      />

      <View style={styles.bottomNavContainer}>

        <View style={styles.togglePill}>

          <View style={styles.toggleActive}>

            <Text style={styles.toggleTextActive}>

              Scan

            </Text>

          </View>

          <TouchableOpacity

            style={styles.toggleInactive}

            onPress={() => router.push("/tabs/food")}

          >

            <Text style={styles.toggleTextInactive}>

              Info

            </Text>

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

    bottom: 140,

    alignSelf: "center",

    width: 80,

    height: 80,

    borderRadius: 40,

    backgroundColor: "#fff",

  },

  loadingOverlay: {

    position: "absolute",

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "rgba(0,0,0,0.5)",

  },

  loadingText: {

    color: "white",

    marginTop: 12,

    fontSize: 18,

  },

  bottomNavContainer: {

    position: "absolute",

    bottom: 45,

    width: "100%",

    alignItems: "center",

  },

  togglePill: {

    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    width: width * 0.85,

    height: 64,

    borderRadius: 32,

    padding: 6,

  },

  toggleActive: {

    flex: 1,

    backgroundColor: "#EB9E64",

    borderRadius: 28,

    justifyContent: "center",

    alignItems: "center",

  },

  toggleInactive: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

  },

  toggleTextActive: {

    color: "#FFFFFF",

    fontSize: 24,

    fontFamily: "InstrumentSerif",

  },

  toggleTextInactive: {

    color: "#EB9E64",

    fontSize: 24,

    fontFamily: "InstrumentSerif",

  },

});
