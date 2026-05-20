import { AbstractShapeBg } from "../src/color4bg/AbstractBackground/AbstractShapeBg.js"
import { AestheticFluidBg } from "../src/color4bg/AbstractBackground/AestheticFluidBg.js"
import { BigBlobBg } from "../src/color4bg/AbstractBackground/BigBlobBg.js"
import { BlurDotBg } from "../src/color4bg/AbstractBackground/BlurDotBg.js"
import { BlurGradientBg } from "../src/color4bg/AbstractBackground/BlurGradientBg.js"
import { ChaosWavesBg } from "../src/color4bg/AbstractBackground/ChaosWavesBg.js"
import { CurveGradientBg } from "../src/color4bg/AbstractBackground/CurveGradientBg.js"
import { AmbientLightBg } from "../src/color4bg/AbstractBackground/AmbientLightBg.js"
import { RandomCubesBg } from "../src/color4bg/AbstractBackground/RandomCubesBg.js"
import { TrianglesMosaicBg } from "../src/color4bg/AbstractBackground/TrianglesMosaicBg.js"
import { WavyWavesBg } from "../src/color4bg/AbstractBackground/WavyWavesBg.js"
import { GridArrayBg } from "../src/color4bg/AbstractBackground/GridArrayBg.js"
import { SwirlingCurvesBg } from "../src/color4bg/AbstractBackground/SwirlingCurvesBg.js"
import { StepGradientBg } from "../src/color4bg/AbstractBackground/StepGradientBg.js"

const ColorGroups = {
	Vivid: {
		vivid: ["#F00911", "#F3AA00", "#F6EE0B", "#39E90D", "#195ED2", "#F00911"],
		candy: ["#FF70A6", "#FF9770", "#FFD670", "#E9FF70", "#70D6FF", "#FF70A6"],
		citrus: ["#FF006E", "#FB5607", "#FFBE0B", "#80ED99", "#3A86FF", "#8338EC"],
		neon: ["#00F5D4", "#00BBF9", "#9B5DE5", "#F15BB5", "#FEE440", "#00F5D4"]
	},
	Pastel: {
		pastel: ["#D1ADFF", "#98D69B", "#FAE390", "#FFACD8", "#7DD5FF", "#D1ADFF"],
		pastelglossy: ["#FE8BFC", "#BD9FFB", "#8EDBFD", "#C4F5EF", "#E7F9FE", "#E9FFE0"],
		macaron: ["#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF", "#CDB4DB", "#FFC8DD"],
		mint: ["#E8F8F5", "#C7F9CC", "#B6E2D3", "#A0C4FF", "#FDFFB6", "#E8F8F5"]
	},
	"Black And White": {
		black: ["#000000", "#3F3F3F", "#7F7F7F", "#DADADA", "#EAEAEA", "#F3F3F3"],
		blackVivid: ["#000000", "#F00911", "#F3AA00", "#F6EE0B", "#39E90D", "#195ED2"],
		monochrome: ["#0A0A0A", "#252525", "#555555", "#909090", "#D0D0D0", "#FFFFFF"],
		inkWash: ["#0D0D0D", "#2B2B2B", "#696969", "#A5A5A5", "#E7E2D8", "#F8F6EF"]
	},
	Blue: {
		blue: ["#007FFE", "#3099FE", "#60B2FE", "#90CCFE", "#C0E5FE", "#F0FFFE"],
		ocean: ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6", "#EE9B00"],
		ice: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#FFFFFF"],
		twilight: ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE", "#C6FFFA", "#0B132B"]
	},
	Red: {
		red: ["#3A0710", "#8F1225", "#D9344E", "#FF6B7D", "#FFC2C9", "#FFF0F2"],
		rose: ["#590D22", "#800F2F", "#A4133C", "#C9184A", "#FF4D6D", "#FFCCD5"],
		coral: ["#6A040F", "#D00000", "#F48C06", "#FFBA08", "#FFE5D9", "#6A040F"],
		wine: ["#240046", "#5A189A", "#9D4EDD", "#C77DFF", "#E0AAFF", "#240046"]
	},
	Green: {
		green: ["#052E1B", "#0E6B3D", "#32A467", "#79D68F", "#C8F2CE", "#F1FFF0"],
		forest: ["#081C15", "#1B4332", "#2D6A4F", "#52B788", "#B7E4C7", "#D8F3DC"],
		lime: ["#004B23", "#38B000", "#70E000", "#CCFF33", "#F7FFE0", "#004B23"],
		sage: ["#344E41", "#588157", "#A3B18A", "#DAD7CD", "#F2F4E9", "#344E41"]
	},
	White: {
		white: ["#FFFFFF", "#F6F7FB", "#E7ECF5", "#D5DEEB", "#C5CEDC", "#FFFFFF"],
		pearl: ["#FFFFFF", "#F8F7F2", "#ECE7DC", "#D8D2C4", "#C9D6DF", "#FFFFFF"],
		cloud: ["#F8FAFC", "#E2E8F0", "#CBD5E1", "#BAE6FD", "#E0F2FE", "#FFFFFF"],
		snow: ["#FFFFFF", "#F1F5F9", "#E0F2FE", "#DBEAFE", "#EDE9FE", "#FFFFFF"]
	},
	Black: {
		blackSoft: ["#050505", "#121212", "#242424", "#4A4A4A", "#8A8A8A", "#EDEDED"],
		night: ["#020617", "#111827", "#1F2937", "#374151", "#9CA3AF", "#E5E7EB"],
		carbon: ["#000000", "#1C1C1C", "#2E2E2E", "#595959", "#BFBFBF", "#F2F2F2"],
		volcanic: ["#0B090A", "#161A1D", "#660708", "#A4161A", "#E5383B", "#F5F3F4"]
	},
	Cream: {
		cream: ["#FFF8E7", "#F6E8C8", "#E7CA8A", "#C99647", "#8E5E2D", "#FFF8E7"],
		latte: ["#FFF8E1", "#EED9C4", "#C9ADA7", "#9A8C98", "#4A4E69", "#FFF8E1"],
		sand: ["#FFF3B0", "#E09F3E", "#9E2A2B", "#540B0E", "#335C67", "#FFF3B0"],
		linen: ["#FAF3DD", "#EDE0D4", "#DDBEA9", "#B7B7A4", "#6B705C", "#FAF3DD"]
	}
}

const Colors = Object.fromEntries(Object.values(ColorGroups).flatMap((group) => Object.entries(group)))

const SpeedOption = {
	type: "range",
	name: "playbackSpeed",
	display: "Playback Speed",
	min: 0,
	max: 3,
	step: 0.05,
	value: 1
}

function withSpeed(options = []) {
	return [SpeedOption, ...options]
}

const Bgs = [
	{
		name: "abstract-shape",
		class: AbstractShapeBg,
		palette: "blue"
	},
	{
		name: "aesthetic-fluid",
		class: AestheticFluidBg,
		palette: "vivid"
	},
	{
		name: "ambient-light",
		class: AmbientLightBg,
		palette: "vivid"
	},
	{
		name: "big-blob",
		class: BigBlobBg,
		palette: "pastel"
	},
	{
		name: "blur-dot",
		class: BlurDotBg,
		palette: "pastelglossy"
	},
	{
		name: "blur-gradient",
		class: BlurGradientBg,
		palette: "pastelglossy"
	},
	{
		name: "chaos-waves",
		class: ChaosWavesBg,
		palette: "pastel"
	},
	{
		name: "curve-gradient",
		class: CurveGradientBg,
		palette: "pastelglossy"
	},
	{
		name: "grid-array",
		class: GridArrayBg,
		palette: "blue"
	},
	{
		name: "random-cubes",
		class: RandomCubesBg,
		palette: "pastelglossy"
	},
	{
		name: "swirling-curves",
		class: SwirlingCurvesBg,
		palette: "pastelglossy"
	},
	{
		name: "triangles-mosaic",
		class: TrianglesMosaicBg,
		palette: "pastel"
	},
	{
		name: "wavy-waves",
		class: WavyWavesBg,
		palette: "pastelglossy"
	}
]

const Options = {
	"abstract-shape": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "scale",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "wavy",
			display: "scale",
			min: 0,
			max: 20,
			step: 1,
			value: 10
		}
	]),
	"aesthetic-fluid": withSpeed([
		{
			type: "range",
			name: "scale",
			display: "Scale",
			min: 0.01,
			max: 0.3,
			step: 0.01,
			value: 0.15
		}
	]),
	"ambient-light": withSpeed([
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 1,
			max: 10,
			step: 1,
			value: 1
		},
		{
			type: "range",
			name: "pattern scale",
			display: "Scale",
			min: 0,
			max: 1,
			step: 0.05,
			value: 1
		},
		{
			type: "range",
			name: "edge blur",
			display: "Blur",
			min: 0,
			max: 1,
			step: 0.01,
			value: 0
		},
		{
			type: "range",
			name: "brightness",
			display: "Shape",
			min: 0,
			max: 1.2,
			step: 0.01,
			value: 0.2
		},
		{
			type: "range",
			name: "darkness",
			display: "Background",
			min: 0,
			max: 1,
			step: 0.01,
			value: 0
		}
	]),
	"big-blob": withSpeed([]),
	"blur-dot": withSpeed([]),
	"blur-gradient": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "Noise",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		}
	]),
	"chaos-waves": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "Noise",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 1,
			max: 20,
			step: 1,
			value: 1
		}
	]),
	"curve-gradient": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "Noise",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 1,
			max: 20,
			step: 1,
			value: 1
		},
		{
			type: "range",
			name: "scale",
			display: "Scale",
			min: 0.01,
			max: 4,
			step: 0.01,
			value: 1
		},
	]),
	"grid-array": withSpeed([
		{
			type: "range",
			name: "scale",
			display: "Scale",
			min: 1,
			max: 200,
			step: 1,
			value: 100
		},
		{
			type: "range",
			name: "u_w",
			display: "Width",
			min: 0.1,
			max: 0.99,
			step: 0.01,
			value: 0.8
		},
		{
			type: "range",
			name: "u_h",
			display: "Height",
			min: 0.1,
			max: 0.99,
			step: 0.01,
			value: 0.8
		},
		{
			type: "range",
			name: "amplitude",
			display: "Amplitude",
			min: 0.0,
			max: 5.0,
			step: 0.01,
			value: 0.5
		},
		{
			type: "range",
			name: "radius",
			display: "Radius",
			min: 0.0,
			max: 1,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "borderwidth",
			display: "BorderWidth",
			min: 0.01,
			max: 0.1,
			step: 0.01,
			value: 0.01
		},
		{
			type: "range",
			name: "rotateCanvas",
			display: "Rotate Canvas",
			min: 0,
			max: 360,
			step: 1,
			value: 0
		},
		{
			type: "range",
			name: "rotateUnit",
			display: "Rotate Unit",
			min: 0,
			max: 360,
			step: 1,
			value: 0
		},
		{
			type: "text",
			name: "seed",
			display: "Seed",
			value: 1000
		},
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 1,
			max: 10,
			step: 1,
			value: 5
		}
	]),
	"random-cubes": withSpeed([
		{ type: "range", name: "fogStart", display: "Fog Start", min: 0, max: 10000, step: 10, value: 7800 },
		{ type: "range", name: "fogEnd", display: "Fog End", min: 0, max: 10000, step: 10, value: 7000 }
	]),
	"step-gradient": withSpeed([
		{ type: "range", name: "spacing", display: "Spacing", min: 0, max: 200, step: 1, value: 50 },
		{ type: "range", name: "noise", display: "Noise", min: 0.0, max: 0.5, step: 0.01, value: 0.1 }
	]),
	"swirling-curves": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "Noise",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 0.1,
			max: 5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "density",
			display: "Density",
			min: 100,
			max: 2000,
			step: 100,
			value: 1500
		},
		{
			type: "range",
			name: "scale",
			display: "Scale",
			min: 0.1,
			max: 50,
			step: 0.1,
			value: 8.0
		}
	]),
	"triangles-mosaic": withSpeed([
		{
			type: "range",
			name: "noise",
			display: "Noise",
			min: 0.0,
			max: 0.5,
			step: 0.01,
			value: 0.1
		},
		{
			type: "range",
			name: "speed",
			display: "Speed",
			min: 1,
			max: 10,
			step: 1,
			value: 10
		}
	]),
	"wavy-waves": withSpeed([])
}

export { Colors, ColorGroups, Options, Bgs }
