import { useEffect, useRef } from "react";
<<<<<<< HEAD
import { StyleSheetimport { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { setLatestPhoto } from "../../scanStore";
import { useRouter } from "expo-router";
import { useState } from "react";

const { width } = Dimensions.get("window");

/*
IMPORTANT:
Change this to your computer IP address
Example:
http://192.168.2.93:8000/analyze
*/
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

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      globalThis.foodResult = data;

      router.push("/tabs/food");

    } catch (err) {

      console.log("UPLOAD ERROR:", err);

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
          <Text style={{ color: "white", marginTop: 10 }}>
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

    bottom: 130,

    alignSelf: "center",

    width: 75,

    height: 75,

    borderRadius: 37,

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

  bottomNavContainer: {

    position: "absolute",

    bottom: 40,

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

    elevation: 8,

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

});, TouchableOpacity, View, Text, Dimensions, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { setLatestPhoto } from "../../scanStore";
import { useRouter } from "expo-router";
import { useState } from "react";

const { width } = Dimensions.get("window");

/*
IMPORTANT:
Change this to your computer IP address
Example:
http://192.168.2.93:8000/analyze
*/
const API_URL = "http://192.168.2.93:8000/analyze";

export default function CameraScreen() {

=======
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { setLatestPhoto } from "../../scanStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export default function CameraScreen() {
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

=======
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <View />;
  }

  const takePicture = async () => {
<<<<<<< HEAD

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

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      globalThis.foodResult = data;

      router.push("/tabs/food");

    } catch (err) {

      console.log("UPLOAD ERROR:", err);

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
          <Text style={{ color: "white", marginTop: 10 }}>
            analyzing food...
          </Text>
        </View>
      )}
=======
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
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201

      <TouchableOpacity
        style={styles.captureButton}
        onPress={takePicture}
      />

      <View style={styles.bottomNavContainer}>
<<<<<<< HEAD

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

=======
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
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
<<<<<<< HEAD

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

  bottomNavContainer: {

    position: "absolute",

    bottom: 40,

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

    elevation: 8,

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

=======
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
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
});
