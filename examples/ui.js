import { ColorGroups, Colors } from "./data.js"

const PaletteStorageKey = "color4bg.currentPalette"
const CustomPaletteLabel = "photo import"

export class UI {
	constructor(Colors, Bgs, Options, colorbg, palette) {
		listColorBgs(Bgs)
		listPalettes(ColorGroups, colorbg, palette)
		listOptions(colorbg, Options)
		listAdvancedOptions(colorbg)
		initUIEvents(colorbg)
	}
}

function listPalettes(ColorGroups, colorbg, palette) {
	updateActivePaletteLabel(getStoredPaletteState().label)

	addPhotoPaletteImporter(colors_list, (colors) => {
		changePalette(colors, "photo import")
	})

	for (const groupName in ColorGroups) {
		let groupTitle = document.createElement("li")
		groupTitle.setAttribute("class", "mt-4 mb-1 px-2 text-xs font-bold uppercase tracking-wide text-gray-500")
		groupTitle.textContent = groupName
		colors_list.appendChild(groupTitle)

		for (const paletteKey in ColorGroups[groupName]) {
			let _colors = ColorGroups[groupName][paletteKey]

			let colorrow = document.createElement("li")
			colorrow.setAttribute("class", "color-row m-2 p-3 min-w-64 hover:bg-white/50 rounded-lg cursor-pointer")
			colorrow.setAttribute("title", `${groupName} / ${paletteKey}`)
			colorrow.addEventListener("click", () => [changePalette(_colors, paletteKey)])

			let title = document.createElement("DIV")
			title.setAttribute("class", "mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-gray-600")
			title.innerHTML = `<span>${paletteKey}</span><span class="text-xs font-normal text-gray-400">${groupName}</span>`

			let preview = document.createElement("DIV")
			preview.setAttribute("class", "flex justify-evenly gap-1")

			_colors.forEach((hex, i) => {
				let c = document.createElement("DIV")
				c.setAttribute("class", "color h-8 flex-1 rounded-lg border border-white/70 shadow-sm")
				c.setAttribute("style", "background:" + hex)
				preview.appendChild(c)
			})

			colorrow.appendChild(title)
			colorrow.appendChild(preview)
			colors_list.appendChild(colorrow)
		}
	}

	function changePalette(colors, paletteKey) {
		document.querySelector("#box_colors").classList.remove("show")
		palette = [...colors]
		savePaletteState(paletteKey, palette)
		colorbg.colors(palette)
		updateActivePaletteLabel(paletteKey)
	}
}

function getStoredPaletteState(defaultName = "pastelglossy") {
	try {
		const raw = sessionStorage.getItem(PaletteStorageKey)
		if (!raw) return { label: defaultName, colors: Colors[defaultName] }
		const stored = JSON.parse(raw)
		if (Array.isArray(stored.colors) && stored.colors.length > 0) {
			return {
				label: stored.label || CustomPaletteLabel,
				colors: stored.colors
			}
		}
		if (stored.name && Colors[stored.name]) {
			return {
				label: stored.name,
				colors: Colors[stored.name]
			}
		}
	} catch (error) {
		console.warn("Unable to read saved palette.", error)
	}
	return { label: defaultName, colors: Colors[defaultName] }
}

function savePaletteState(label, colors) {
	try {
		const isPreset = Boolean(Colors[label])
		sessionStorage.setItem(
			PaletteStorageKey,
			JSON.stringify({
				name: isPreset ? label : null,
				label,
				colors: [...colors]
			})
		)
	} catch (error) {
		console.warn("Unable to save palette.", error)
	}
}

function updateActivePaletteLabel(label) {
	const active = document.querySelector("#active_palette")
	if (active) active.textContent = label
}

export function getCurrentPalette(defaultName = "pastelglossy") {
	return getStoredPaletteState(defaultName)
}

function addPhotoPaletteImporter(container, applyColors) {
	const row = document.createElement("li")
	row.setAttribute("class", "m-2 p-3 min-w-64 rounded-lg border border-dashed border-gray-300 bg-white/70")

	const label = document.createElement("label")
	label.setAttribute("class", "block cursor-pointer rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-700")
	label.textContent = "导入照片提取配色"

	const input = document.createElement("input")
	input.type = "file"
	input.accept = "image/*"
	input.setAttribute("class", "hidden")

	const status = document.createElement("div")
	status.setAttribute("class", "mt-2 text-xs text-gray-500")
	status.textContent = "选择本地图片后自动生成 6 色方案。"

	const preview = document.createElement("div")
	preview.setAttribute("class", "mt-3 hidden justify-evenly gap-1")

	input.addEventListener("change", async () => {
		const file = input.files && input.files[0]
		if (!file) return
		status.textContent = "正在分析图片颜色..."
		try {
			const colors = await extractPaletteFromImage(file, 6)
			renderPalettePreview(preview, colors)
			applyColors(colors)
			status.textContent = `已从 ${file.name} 提取配色。`
		} catch (error) {
			console.error(error)
			status.textContent = "图片读取失败，请换一张常见格式图片。"
		} finally {
			input.value = ""
		}
	})

	label.appendChild(input)
	row.append(label, status, preview)
	container.appendChild(row)
}

async function extractPaletteFromImage(file, count = 6) {
	const image = await loadImage(file)
	const canvas = document.createElement("canvas")
	const maxSide = 180
	const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
	canvas.width = Math.max(1, Math.round(image.width * scale))
	canvas.height = Math.max(1, Math.round(image.height * scale))

	const context = canvas.getContext("2d", { willReadFrequently: true })
	context.drawImage(image, 0, 0, canvas.width, canvas.height)
	const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
	const buckets = new Map()
	const step = Math.max(4, Math.floor(pixels.length / 4 / 12000) * 4)

	for (let index = 0; index < pixels.length; index += step) {
		const alpha = pixels[index + 3]
		if (alpha < 180) continue
		const r = pixels[index]
		const g = pixels[index + 1]
		const b = pixels[index + 2]
		const key = `${r >> 4},${g >> 4},${b >> 4}`
		const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0 }
		bucket.r += r
		bucket.g += g
		bucket.b += b
		bucket.count += 1
		buckets.set(key, bucket)
	}

	const candidates = [...buckets.values()]
		.map((bucket) => {
			const r = Math.round(bucket.r / bucket.count)
			const g = Math.round(bucket.g / bucket.count)
			const b = Math.round(bucket.b / bucket.count)
			const [h, s, l] = rgbToHsl(r, g, b)
			return { r, g, b, h, s, l, count: bucket.count, score: bucket.count * (0.72 + s * 0.5) }
		})
		.sort((a, b) => b.score - a.score)

	const selected = []
	for (const threshold of [82, 64, 48, 32, 0]) {
		for (const color of candidates) {
			if (selected.length >= count) break
			if (selected.some((picked) => colorDistance(color, picked) < threshold)) continue
			selected.push(color)
		}
		if (selected.length >= count) break
	}

	while (selected.length < count) {
		selected.push(selected[selected.length - 1] || { r: 240, g: 240, b: 240 })
	}

	return selected.slice(0, count).map(({ r, g, b }) => rgbToHex(r, g, b))
}

function loadImage(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file)
		const image = new Image()
		image.onload = () => {
			URL.revokeObjectURL(url)
			resolve(image)
		}
		image.onerror = () => {
			URL.revokeObjectURL(url)
			reject(new Error("Unable to load image."))
		}
		image.src = url
	})
}

function renderPalettePreview(container, colors) {
	container.innerHTML = ""
	container.classList.remove("hidden")
	container.classList.add("flex")
	colors.forEach((hex) => {
		const swatch = document.createElement("div")
		swatch.setAttribute("class", "h-8 flex-1 rounded-lg border border-white/70 shadow-sm")
		swatch.style.background = hex
		container.appendChild(swatch)
	})
}

function rgbToHex(r, g, b) {
	return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`
}

function rgbToHsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2
	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			default:
				h = (r - g) / d + 4
		}
		h /= 6
	}
	return [h, s, l]
}

function colorDistance(a, b) {
	return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b)
}

function listOptions(bg, options) {
	let optionsbox = document.querySelector("#options_list")

	let optionsObj = options[bg.name]
	if (!optionsObj || optionsObj.length === 0) {
		let empty = document.createElement("div")
		empty.setAttribute("class", "p-3 text-sm text-gray-500")
		empty.textContent = "No basic options."
		optionsbox.appendChild(empty)
		return
	}

	optionsObj.forEach((obj) => {
		switch (obj.type) {
			case "range":
				let slider_label = document.createElement("div")
				slider_label.setAttribute("class", "slider-label my-1 mr-6 w-24 text-sm text-right")
				slider_label.innerText = obj.display

				let slider_num = document.createElement("div")
				slider_num.setAttribute("class", "slider-num ml-4")
				slider_num.setAttribute("id", obj.name + "_value")
				slider_num.innerText = obj.value

				let slider = document.createElement("input")
				slider.type = "range"
				slider.min = obj.min
				slider.max = obj.max
				slider.step = obj.step
				slider.value = obj.value
				slider.setAttribute("class", "slider-range w-40")
				slider.addEventListener("input", function () {
					if (obj.name === "playbackSpeed" && typeof bg.setPlaybackSpeed === "function") {
						bg.setPlaybackSpeed(this.value)
					} else if (typeof bg.update === "function") {
						bg.update(obj.name, this.value)
					}
					slider_num.innerText = this.value
				})

				let row = document.createElement("div")
				row.setAttribute("class", "flex")

				row.appendChild(slider_label)
				row.appendChild(slider)
				row.appendChild(slider_num)

				optionsbox.appendChild(row)
				break

			case "text":
				let textlabel = document.createElement("div")
				textlabel.setAttribute("class", "slider-label my-1 mr-6 w-24 text-sm text-right")
				textlabel.innerText = obj.display

				let textinput = document.createElement("input")
				textinput.type = "text"
				textinput.value = 1000
				textinput.addEventListener("input", function () {
					bg.reset(parseFloat(this.value))
					console.log(bg.seed)
				})

				let textrow = document.createElement("div")
				textrow.setAttribute("class", "flex")
				textrow.appendChild(textlabel)
				textrow.appendChild(textinput)

				optionsbox.appendChild(textrow)
				break
		}
	})
}

function listAdvancedOptions(bg) {
	const box = document.querySelector("#advanced_options_list")
	if (!box) return
	box.innerHTML = ""

	const groups = collectUniformControls(bg)
	if (groups.length === 0) {
		let empty = document.createElement("div")
		empty.setAttribute("class", "p-3 text-sm text-gray-500")
		empty.textContent = "No advanced uniforms found."
		box.appendChild(empty)
		return
	}

	groups.forEach((group) => {
		let title = document.createElement("div")
		title.setAttribute("class", "mt-3 mb-2 px-2 text-xs font-bold uppercase tracking-wide text-gray-500")
		title.textContent = group.label
		box.appendChild(title)

		group.controls.forEach((control) => {
			let label = document.createElement("div")
			label.setAttribute("class", "slider-label my-1 mr-6 w-36 text-xs text-right text-gray-600")
			label.innerText = control.label

			let value = document.createElement("div")
			value.setAttribute("class", "slider-num ml-4 w-14 text-xs")
			value.innerText = trimNumber(control.value)

			let slider = document.createElement("input")
			slider.type = "range"
			slider.min = control.min
			slider.max = control.max
			slider.step = control.step
			slider.value = control.value
			slider.setAttribute("class", "slider-range w-40")
			slider.addEventListener("input", function () {
				bg.setUniformValue(control.programKey, control.uniformName, this.value, control.componentIndex)
				value.innerText = trimNumber(this.value)
			})

			let row = document.createElement("div")
			row.setAttribute("class", "flex items-center")
			row.appendChild(label)
			row.appendChild(slider)
			row.appendChild(value)
			box.appendChild(row)
		})
	})
}

function collectUniformControls(bg) {
	const knownPrograms = [
		["_planeShader", "Plane"],
		["planeShader", "Plane"],
		["rttProgram", "Render Texture"],
		["_blobShader", "Blob"],
		["_cubeShader", "Cube"]
	]

	return knownPrograms
		.map(([programKey, label]) => {
			const program = bg[programKey]
			if (!program || !program.uniforms) return null
			const controls = Object.entries(program.uniforms).flatMap(([uniformName, uniform]) => makeUniformControls(programKey, uniformName, uniform))
			return controls.length ? { label, controls } : null
		})
		.filter(Boolean)
}

function makeUniformControls(programKey, uniformName, uniform) {
	if (!uniform || uniform.value === undefined) return []
	if (shouldHideUniform(uniformName, uniform.value)) return []

	if (typeof uniform.value === "number") {
		return [makeScalarControl(programKey, uniformName, uniformName, uniform.value)]
	}

	if (uniform.value && typeof uniform.value === "object" && typeof uniform.value.length === "number" && uniform.value.length <= 4) {
		return Array.from({ length: uniform.value.length }, (_, index) => {
			const axis = ["x", "y", "z", "w"][index] || index
			return makeScalarControl(programKey, uniformName, `${uniformName}.${axis}`, uniform.value[index], index)
		}).filter(Boolean)
	}

	return []
}

function makeScalarControl(programKey, uniformName, label, value, componentIndex = null) {
	if (!Number.isFinite(value)) return null
	const range = inferRange(uniformName, label, value)
	return {
		programKey,
		uniformName,
		componentIndex,
		label,
		value,
		...range
	}
}

function shouldHideUniform(name, value) {
	if (name.startsWith("u_color_")) return true
	if (name === "tMap") return true
	if (name === "u_resolution") return true
	if (name === "u_time" || name === "uTime") return true
	if (value && typeof value === "object" && value.texture) return true
	return false
}

function inferRange(name, label, value) {
	const key = `${name} ${label}`.toLowerCase()
	if (key.includes("rotate")) return { min: 0, max: 360, step: 1 }
	if (key.includes("brightness")) return { min: 0, max: 2, step: 0.01 }
	if (key.includes("darkness")) return { min: 0, max: 1, step: 0.01 }
	if (key.includes("radius")) return { min: 0, max: 1, step: 0.01 }
	if (key.includes("border")) return { min: 0, max: 0.3, step: 0.005 }
	if (key.includes("scale")) return { min: 0, max: Math.max(10, value * 3), step: 0.01 }
	if (key.includes("spacing")) return { min: 0, max: Math.max(200, value * 3), step: 1 }
	if (key.includes("fog")) return { min: 0, max: 10000, step: 10 }
	if (key.includes("num")) return { min: 1, max: 40, step: 1 }
	if (key.includes("random") || key.includes("rand") || key.includes("seed")) return { min: -500, max: 1000, step: 1 }
	if (value >= 0 && value <= 1) return { min: 0, max: 1, step: 0.01 }
	return { min: Math.min(-100, value * 2), max: Math.max(100, value * 2), step: 0.01 }
}

function trimNumber(value) {
	const num = parseFloat(value)
	if (!Number.isFinite(num)) return value
	return Math.round(num * 1000) / 1000
}

function listColorBgs(ColorBgs) {
	const $list = document.querySelector("#bg_list")

	ColorBgs.forEach((item, index) => {
		let imgnode = document.createElement("IMG")
		imgnode.src = `./assets/images/${item.name}.jpg`
		imgnode.setAttribute("class", "rounded-lg hover:opacity-85 cursor-pointer")

		let titlenode = document.createElement("DIV")
		titlenode.setAttribute("class", "mt-1 text-sm text-gray-500")
		titlenode.textContent = item.name

		let link = document.createElement("A")
		link.setAttribute("data-bg", item.name)
		link.setAttribute("class", "bg-item block mb-2")
		link.setAttribute("href", `./demo-module-js.html?bg=${item.name}`)
		link.appendChild(imgnode)
		link.appendChild(titlenode)

		$list.appendChild(link)
	})
}

function initUIEvents(colorbg) {
	document.querySelector("#btn_show_colors").addEventListener("mouseenter", () => {
		let colorsdom = document.querySelector(".colors-list-box")
		colorsdom.style.display = "block"
		setTimeout(() => {
			colorsdom.classList.add("show")
		}, 200)
	})

	document.querySelector("#box_colors").addEventListener("mouseleave", () => {
		let colorsdom = document.querySelector(".colors-list-box")
		colorsdom.style.display = "none"
		setTimeout(() => {
			colorsdom.classList.remove("show")
		}, 200)
	})

	document.querySelector("#btn_show_options").addEventListener("mouseenter", () => {
		let colorsdom = document.querySelector(".options-list-box")
		colorsdom.style.display = "block"
		setTimeout(() => {
			colorsdom.classList.add("show")
		}, 200)
	})

	document.querySelector("#box_options").addEventListener("mouseleave", () => {
		let colorsdom = document.querySelector(".options-list-box")
		colorsdom.style.display = "none"
		setTimeout(() => {
			colorsdom.classList.remove("show")
		}, 200)
	})

	document.querySelector("#btn_show_advanced_options").addEventListener("mouseenter", () => {
		let advanced = document.querySelector(".advanced-list-box")
		advanced.style.display = "block"
		setTimeout(() => {
			advanced.classList.add("show")
		}, 200)
	})

	document.querySelector("#box_advanced_options").addEventListener("mouseleave", () => {
		let advanced = document.querySelector(".advanced-list-box")
		advanced.style.display = "none"
		setTimeout(() => {
			advanced.classList.remove("show")
		}, 200)
	})

	document.querySelector("#btn_resetSeed").addEventListener("click", () => {
		let random = Math.floor( Math.random() * 100000 )
		colorbg.reset(random)		
	})
}

export function getBgTypeFromUrl(Bgs) {
	const queryParams = new URLSearchParams(window.location.search)
	for (const [key, value] of queryParams.entries()) {
		switch (key) {
			case "bg":
				let Bg = Bgs.find(function (item) {
					return item.name === value
				})
				if (!Bg) return false
				const paletteState = getStoredPaletteState(Bg.palette)

				const colorbg = new Bg.class({
					dom: "box", // DOM that you want to add color background
					colors: paletteState.colors, // 6 Hex colors
					seed: 1000, // Random seed
					loop: true // Whether the background would be loop animated
				})

				return colorbg
		}
	}

	return false
}
