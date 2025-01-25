import React, { useState, useEffect } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "expo-image"
import { Link, useGlobalSearchParams } from "expo-router"
import Slider from "@react-native-community/slider"
import LottieView from "lottie-react-native"

interface SoundFile {
	id: string
	label: string
	source: any // Use require('./path/to/sound.mp3')
	image: any // Use require('./path/to/image.jpg')
}

interface SoundMap {
	[key: string]: Audio.Sound
}

const Play = () => {
	const { sound } = useGlobalSearchParams()
	const [sounds, setSounds] = useState<SoundMap>({})
	const [isPlaying, setIsPlaying] = useState(true)
	const [volume, setVolume] = useState(0.5)

	const soundFiles: SoundFile[] = [
		{
			id: "drum1",
			label: "Waves",
			source: require("../assets/sounds/waves.mp3"),
			image: require("../assets/lottie/waves.json"),
		},
		{
			id: "drum2",
			label: "Rain",
			source: require("../assets/sounds/rain.mp3"),
			image: require("../assets/lottie/rain.json"),
		},
		{
			id: "drum3",
			label: "White",
			source: require("../assets/sounds/white.mp3"),
			image: require("../assets/lottie/white.json"),
		},
		{
			id: "drum4",
			label: "Blue",
			source: require("../assets/sounds/blue.mp3"),
			image: require("../assets/lottie/blue.json"),
		},
		{
			id: "drum5",
			label: "Brown",
			source: require("../assets/sounds/brown.mp3"),
			image: require("../assets/lottie/brown.json"),
		},
		{
			id: "drum6",
			label: "Pink",
			source: require("../assets/sounds/pink.mp3"),
			image: require("../assets/lottie/pink.json"),
		},
		{
			id: "drum7",
			label: "Fire",
			source: require("../assets/sounds/fire.mp3"),
			image: require("../assets/lottie/fire.json"),
		},
		{
			id: "drum8",
			label: "Crickets",
			source: require("../assets/sounds/crickets.mp3"),
			image: require("../assets/lottie/crickets.json"),
		},
		{
			id: "drum9",
			label: "Birds",
			source: require("../assets/sounds/birds.mp3"),
			image: require("../assets/lottie/birds.json"),
		},
	]

	useEffect(() => {
		setupAudio()
		return () => {
			unloadSounds()
		}
	}, [])

	const setupAudio = async () => {
		try {
			// Configure audio mode
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true,
				staysActiveInBackground: true,
				shouldDuckAndroid: true,
			})

			// Load all sounds
			await loadSounds()
		} catch (error) {
			console.error("Error setting up audio:", error)
		}
	}

	const loadSounds = async () => {
		const newSounds: SoundMap = {}

		try {
			const { sound } = await Audio.Sound.createAsync(soundObject!.source, {
				shouldPlay: false,
				volume: 1.0,
				isLooping: true,
			})
			newSounds[soundObject!.id] = sound
		} catch (error) {
			console.error(`Error loading sound ${soundObject!.id}:`, error)
		}

		setSounds(newSounds)
	}

	useEffect(() => {
		const object = sounds[soundObject!.id]
		if (object) {
			object.playAsync()
			object.setVolumeAsync(volume)
		}
	}, [sounds])

	const unloadSounds = async () => {
		for (const sound of Object.values(sounds)) {
			try {
				await sound.unloadAsync()
			} catch (error) {
				console.error("Error unloading sound:", error)
			}
		}
	}

	const playSound = async () => {
		loadSounds()
	}

	const stopSound = async () => {
		unloadSounds()
	}

	useEffect(() => {
		if (sounds[soundObject!.id]) {
			sounds[soundObject!.id].setVolumeAsync(volume)
		}
	}, [volume, sounds])

	const soundItem = sound === "Bonfire" ? "Fire" : sound
	const soundObject = soundFiles.find((item) => item.label === soundItem)

	return (
		<View style={styles.playerContainer}>
			<LinearGradient colors={["#29214e", "#29214f"]} style={styles.playerGradient}>
				<View style={styles.playerHeader}>
					<Link href="/home" asChild>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => {
								stopSound()
							}}
						>
							<Ionicons name="chevron-back" size={24} color="white" />
						</TouchableOpacity>
					</Link>
					<Text style={styles.playerTitle}>{soundObject?.label}</Text>
				</View>

				<View style={styles.playerImageContainer}>
					{soundObject?.image && (
						<LottieView
							source={soundObject.image}
							style={{ width: 1000, height: 1000 }}
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
								setIsPlaying(false)
								stopSound()
							}}
						>
							<Ionicons name={"pause"} size={24} color="white" />
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={styles.playButton}
							onPress={() => {
								setIsPlaying(true)
								playSound()
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
								setVolume(val)
							}}
						/>
						<Ionicons name="volume-high-outline" size={20} color="white" />
					</View>
					<TouchableOpacity>
						<Ionicons name="timer-outline" size={25} color="white" />
					</TouchableOpacity>
				</View>
			</LinearGradient>
		</View>
	)
}

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
})

export default Play
