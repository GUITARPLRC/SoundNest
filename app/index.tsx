import { router } from "expo-router"
import React, { useState, useRef, useLayoutEffect } from "react"
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "@/database"
import * as schema from "@/database/schema"
import * as SplashScreen from "expo-splash-screen"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 500,
	fade: true,
})

const App = () => {
	const [nameValue, setNameValue] = useState("")
	const inputRef = useRef<TextInput>(null)
	const { data } = useLiveQuery(db.select().from(schema.user))

	useLayoutEffect(() => {
		if (data.length > 0) {
			return router.replace("/home")
		}
	})

	const handleNext = async () => {
		if (nameValue.length === 0) {
			Alert.alert("Please enter your name to get started")
			inputRef.current && inputRef.current.focus()
			return
		}
		await db.insert(schema.user).values({ name: nameValue })
		router.replace("/home")
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Welcome to </Text>
			<Text style={styles.title}>SoundNest</Text>
			<Text style={styles.text}>Get Started by Entering Your Name</Text>
			<TextInput
				placeholder="Name"
				style={styles.input}
				value={nameValue}
				onChangeText={setNameValue}
				placeholderTextColor={"#fff"}
				ref={inputRef}
			/>
			<TouchableOpacity style={styles.button} onPress={() => handleNext()}>
				<Text style={styles.buttonText}>Start Listening</Text>
			</TouchableOpacity>
		</View>
	)
}

export default App

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#fff",
		width: "80%",
		borderRadius: 15,
		marginTop: 50,
	},
	buttonText: {
		textAlign: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#29214e",
		alignItems: "center",
		justifyContent: "center",
		padding: 50,
	},
	input: {
		height: 40,
		marginBottom: 20,
		borderWidth: 1,
		padding: 10,
		borderColor: "#fff",
		color: "#fff",
		borderRadius: 15,
		width: "100%",
	},
	text: {
		color: "white",
		textAlign: "center",
		marginBottom: 20,
	},
	title: {
		color: "white",
		textAlign: "center",
		marginBottom: 40,
		fontSize: 24,
	},
})
