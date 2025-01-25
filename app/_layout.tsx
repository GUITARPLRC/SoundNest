import { Stack } from "expo-router"

export default function HomeLayout() {
	return (
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
	)
}
