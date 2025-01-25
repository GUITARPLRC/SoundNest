import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "@/database"
import * as schema from "@/database/schema"

const App = () => {
	const [nameValue, setNameValue] = useState("")
	const { data } = useLiveQuery(db.select().from(schema.user)) as { data: schema.user[] }
	console.log(data)

	const handleNext = () => {
		if (nameValue.length === 0) {
			Alert.alert("Please enter your name to get started")
			return
		}
		db.insert(schema.user).values({ name: nameValue }).run()
		router.replace("/home")
	}

	useEffect(() => {
		if (data.length > 0) {
			return router.replace("/home")
		}
	})

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
			/>
			<TouchableOpacity style={styles.button} onPress={() => handleNext()}>
				<Text style={styles.buttonText}>Next</Text>
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
