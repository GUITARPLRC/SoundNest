import React, { Dispatch, SetStateAction, useState } from "react"
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import LottieView from "lottie-react-native"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"
import { db } from "@/database"
import * as schema from "@/database/schema"
import { eq } from "drizzle-orm"
import { catalog } from "./catalog"

const CategoryCard = ({
	icon,
	title,
	backgroundColor,
	setCategory,
}: {
	icon: string
	title: string
	backgroundColor: string
	setCategory: Dispatch<SetStateAction<string>>
}) => (
	<TouchableOpacity
		style={[styles.categoryCard, { backgroundColor }]}
		onPress={() => setCategory(title)}
	>
		<Text style={styles.categoryIcon}>{icon}</Text>
		<Text style={styles.categoryTitle}>{title}</Text>
	</TouchableOpacity>
)

const SoundCard = ({
	title,
	image,
	index,
	miniWidth,
	miniHeight,
}: {
	title: string
	image: any
	index: number
	miniWidth: number
	miniHeight: number
}) => {
	const { data } = useLiveQuery(db.select().from(schema.user))
	const { name } = data[0] || {}
	return (
		<Link href={`/play?sound=${title}`} asChild>
			<TouchableOpacity
				style={styles.soundCard}
				onPress={async () => {
					await db.update(schema.user).set({ recent: index }).where(eq(schema.user.name, name))
				}}
			>
				<View style={[styles.soundImage, { backgroundColor: "black" }]}>
					<LottieView source={image} style={{ height: miniHeight, width: miniWidth }} autoPlay />
				</View>
				<Text style={styles.soundTitle}>{title}</Text>
				<View style={styles.playIcon}>
					<Ionicons name="play" size={15} color="white" />
				</View>
			</TouchableOpacity>
		</Link>
	)
}

export default function App() {
	const [category, setCategory] = useState("all")
	const { data } = useLiveQuery(db.select().from(schema.user))
	const { name, recent } = data[0] || {}

	const displayGreeting = () => {
		const myDate = new Date()
		const hrs = myDate.getHours()
		let greet = "Good Day"

		if (hrs < 12) greet = "Good Morning"
		else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon"
		else if (hrs >= 17 && hrs <= 24) greet = "Good Evening"
		return greet
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />
			<ScrollView style={styles.scrollView}>
				<View style={styles.header}>
					<View style={styles.headerTop}>
						<Text style={styles.greeting}>Hey, {name}</Text>
					</View>
					<Text style={styles.subGreeting}>{displayGreeting()}</Text>
				</View>

				{recent && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Recently Played</Text>
						<View style={styles.recentlyPlayed}>
							<SoundCard
								title={catalog[recent].title}
								image={catalog[recent].lottie}
								index={recent}
								{...catalog[recent].sizes}
							/>
						</View>
					</View>
				)}

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Categories</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 15 }}>
						<CategoryCard icon="🔈" title="All" backgroundColor="#fff" setCategory={setCategory} />
						<CategoryCard
							icon="🧘"
							title="Ambient"
							backgroundColor="#eef3e9"
							setCategory={setCategory}
						/>
						<CategoryCard
							icon="🌳"
							title="Forest"
							backgroundColor="#a8f3e9"
							setCategory={setCategory}
						/>
						<CategoryCard
							icon="🐚"
							title="Beach"
							backgroundColor="#ffe8e8"
							setCategory={setCategory}
						/>
						<CategoryCard
							icon="🌅"
							title="Sunset"
							backgroundColor="#eeff99"
							setCategory={setCategory}
						/>
					</ScrollView>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Catalog</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ paddingTop: 2, paddingLeft: 15 }}
					>
						{catalog.reduce((data: React.ReactNode[], item) => {
							if (category.toLowerCase() === "all" || item.category === category.toLowerCase()) {
								data.push(
									<SoundCard
										key={item.title}
										title={item.title}
										image={item.lottie}
										index={catalog.findIndex((catalogItem) => catalogItem.title === item.title)}
										{...item.sizes}
									/>,
								)
							}
							return data
						}, [])}
					</ScrollView>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#29214e",
	},
	scrollView: {
		flex: 1,
	},
	header: {
		padding: 20,
	},
	headerTop: {
		flexDirection: "row",
		alignItems: "center",
	},
	greeting: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	subGreeting: {
		fontSize: 16,
		color: "#999",
		marginTop: 5,
	},
	section: {
		marginVertical: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
		marginLeft: 20,
		marginBottom: 15,
	},
	recentlyPlayed: {
		flexDirection: "row",
		paddingLeft: 15,
	},
	soundCard: {
		width: 130,
		marginLeft: 10,
	},
	soundImage: {
		width: "100%",
		height: 150,
		borderRadius: 25,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
	},
	soundTitle: {
		color: "white",
		marginTop: 8,
		fontSize: 16,
		textAlign: "center",
	},
	categoryCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderRadius: 15,
		marginLeft: 10,
		minWidth: 120,
	},
	categoryIcon: {
		fontSize: 20,
		marginRight: 8,
	},
	categoryTitle: {
		fontSize: 16,
		color: "#1e1e2a",
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
	playButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#3d3d4e",
		justifyContent: "center",
		alignItems: "center",
	},
	timeText: {
		color: "white",
		fontSize: 16,
	},
})
