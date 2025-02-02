import React from "react"å
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import { SQLiteProvider } from "../providers/sqlite.provider"
import { expoDb } from "../database"

import { View } from "react-native"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	})

	const DrizzleStudio = () => {
		useDrizzleStudio(expoDb)
		return <View></View>
	}

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<>
			{__DEV__ && <DrizzleStudio />}
			<SQLiteProvider>
				<Stack
					screenOptions={{
						headerShown: false,
						gestureEnabled: false,
					}}
					initialRouteName="index"
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="home" />
					<Stack.Screen name="play" />
				</Stack>
			</SQLiteProvider>
		</>
	)
}
