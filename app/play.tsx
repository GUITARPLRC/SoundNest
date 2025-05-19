import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useGlobalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { catalog } from "./catalog";
import { TimerPickerModal } from "react-native-timer-picker";

interface SoundMap {
  [key: string]: Audio.Sound;
}

const Play = () => {
  const { sound } = useGlobalSearchParams();
  const [sounds, setSounds] = useState<SoundMap>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showPicker, setShowPicker] = useState(false);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    setupAudio();
    return () => {
      unloadSounds();
    };
  }, []);

  const setupAudio = async () => {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load all sounds
      await loadSounds();
    } catch (error) {
      console.error("Error setting up audio:", error);
    }
  };

  const loadSounds = async () => {
    const newSounds: SoundMap = {};

    try {
      const { sound } = await Audio.Sound.createAsync(soundObject!.sound, {
        shouldPlay: false,
        volume: 1.0,
        isLooping: true,
      });
      newSounds[soundObject!.title] = sound;
    } catch (error) {
      console.error(`Error loading sound ${soundObject!.title}:`, error);
    }

    setSounds(newSounds);
  };

  useEffect(() => {
    const object = sounds[soundObject!.title];
    if (object) {
      object.playAsync();
      object.setVolumeAsync(volume);
    }
  }, [sounds]);

  const unloadSounds = async () => {
    for (const sound of Object.values(sounds)) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error unloading sound:", error);
      }
    }
  };

  const playSound = async () => {
    loadSounds();
  };

  const stopSound = async () => {
    unloadSounds();
  };

  useEffect(() => {
    if (sounds[soundObject!.title]) {
      sounds[soundObject!.title].setVolumeAsync(volume);
    }
  }, [volume, sounds]);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        stopSound();
        setIsPlaying(false);
      }, timer * 1000);
    }
  }, [timer]);

  const soundItem = sound === "Bonfire" ? "Fire" : sound;
  const soundObject = catalog.find((item) => item.title === soundItem);

  return (
    <View style={styles.playerContainer}>
      <LinearGradient
        colors={["#29214e", "#29214f"]}
        style={styles.playerGradient}
      >
        <View style={styles.playerHeader}>
          <Link href="/home" asChild>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                stopSound();
              }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </Link>
          <Text style={styles.playerTitle}>{soundObject?.title}</Text>
        </View>

        <View style={styles.playerImageContainer}>
          {soundObject?.lottie && (
            <LottieView
              source={soundObject.lottie}
              style={soundObject.sizes}
              autoPlay
              loop
            />
          )}
        </View>

        <View style={styles.playerControls}>
          {isPlaying ? (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                setIsPlaying(false);
                stopSound();
              }}
            >
              <Ionicons name={"pause"} size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                setIsPlaying(true);
                playSound();
              }}
            >
              <Ionicons name={"play"} size={24} color="white" />
            </TouchableOpacity>
          )}
          <View style={styles.sliderContainer}>
            <Ionicons name="volume-off-outline" size={20} color="white" />
            <Slider
              style={{ width: 200, height: 200 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              value={volume}
              onValueChange={(val) => {
                setVolume(val);
              }}
            />
            <Ionicons name="volume-high-outline" size={20} color="white" />
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Ionicons name="timer-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          console.log({ pickedDuration });
          // convert {"hours": 1, "minutes": 1, "seconds": 1} to a time
          const time =
            pickedDuration.hours * 3600 +
            pickedDuration.minutes * 60 +
            pickedDuration.seconds;
          setTimer(time);
          setShowPicker(false);
        }}
        modalTitle="Set Timer"
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        styles={{
          theme: "dark",
        }}
        modalProps={{
          overlayOpacity: 0.4,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    left: 0,
    top: 50,
    zIndex: 5000,
  },
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  soundButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  playerContainer: {
    flex: 1,
  },
  playerGradient: {
    flex: 1,
    padding: 20,
  },
  playerHeader: {
    paddingTop: 50,
  },
  playIcon: {
    position: "absolute",
    bottom: 35,
    left: 10,
    backgroundColor: "#33333377",
    borderRadius: 10,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    zIndex: 1000,
  },
  playerImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  playerImage: {
    width: "100%",
    height: "60%",
    borderRadius: 20,
    boxShadow: "5px 5px 10px 5px",
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#3d3d4e",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 16,
  },
});

export default Play;
