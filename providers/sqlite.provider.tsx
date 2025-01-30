import { DATABASE_NAME, db } from "@/database"
import { SQLiteProvider as ExpoSQliteProvider } from "expo-sqlite"
import React, { ReactNode, Suspense } from "react"
import { ActivityIndicator } from "react-native"
import migrations from "@/drizzle/migrations"
import { Text, SafeAreaView } from "react-native"
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"

export const SQLiteProvider = ({ children }: { children: ReactNode }) => {
	const { success, error } = useMigrations(db, migrations)

	if (error) {
		return (
			<SafeAreaView>
				<Text>Migration error: {error.message}</Text>
			</SafeAreaView>
		)
	}

	if (!success) {
		return (
			<SafeAreaView>
				<Text>Migration is in progress...</Text>
			</SafeAreaView>
		)
	}

	return (
		// is suspense working?
		<Suspense fallback={<ActivityIndicator color={"#fff"} />}>
			<ExpoSQliteProvider databaseName={DATABASE_NAME} useSuspense>
				{children}
			</ExpoSQliteProvider>
		</Suspense>
	)
}
