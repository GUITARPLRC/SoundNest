type Category = "ambient" | "beach" | "sunset" | "forest"

export const catalog: {
	title: string
	category: Category
	sound: any // Use require('./path/to/sound.mp3')
	lottie: any // Use require('./path/to/image.jpg')
	sizes: {
		width: number
		height: number
		miniWidth: number
		miniHeight: number
	}
}[] = [
	{
		title: "Blue",
		category: "ambient",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 125,
			miniHeight: 125,
		},
		sound: require("../assets/sounds/blue.mp3"),
		lottie: require("../assets/lottie/blue.json"),
	},
	{
		title: "Brown",
		category: "ambient",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 125,
			miniHeight: 125,
		},
		sound: require("../assets/sounds/brown.mp3"),
		lottie: require("../assets/lottie/brown.json"),
	},
	{
		title: "Pink",
		category: "ambient",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 125,
			miniHeight: 125,
		},
		sound: require("../assets/sounds/pink.mp3"),
		lottie: require("../assets/lottie/pink.json"),
	},
	{
		title: "White",
		category: "ambient",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 125,
			miniHeight: 125,
		},
		sound: require("../assets/sounds/white.mp3"),
		lottie: require("../assets/lottie/white.json"),
	},
	{
		title: "Waves",
		category: "beach",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 150,
			miniHeight: 150,
		},
		sound: require("../assets/sounds/waves.mp3"),
		lottie: require("../assets/lottie/waves.json"),
	},
	{
		title: "Crickets",
		category: "sunset",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 150,
			miniHeight: 150,
		},
		sound: require("../assets/sounds/crickets.mp3"),
		lottie: require("../assets/lottie/crickets.json"),
	},
	{
		title: "Fire",
		category: "sunset",
		sizes: {
			width: 600,
			height: 600,
			miniWidth: 150,
			miniHeight: 150,
		},
		sound: require("../assets/sounds/fire.mp3"),
		lottie: require("../assets/lottie/fire.json"),
	},
	{
		title: "Rain",
		category: "forest",
		sizes: {
			width: 400,
			height: 400,
			miniWidth: 100,
			miniHeight: 100,
		},
		sound: require("../assets/sounds/rain.mp3"),
		lottie: require("../assets/lottie/rain.json"),
	},
	{
		title: "Birds",
		category: "forest",
		sizes: {
			width: 1200,
			height: 1200,
			miniWidth: 500,
			miniHeight: 500,
		},
		sound: require("../assets/sounds/birds.mp3"),
		lottie: require("../assets/lottie/birds.json"),
	},
]
