import { ColorGroups, Colors } from "./data.js"

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
		colorbg.colors(palette)
		const active = document.querySelector("#active_palette")
		if (active) {
			active.textContent = paletteKey
		}
	}
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

				const colorbg = new Bg.class({
					dom: "box", // DOM that you want to add color background
					colors: Colors[Bg.palette], // 6 Hex colors
					seed: 1000, // Random seed
					loop: true // Whether the background would be loop animated
				})

				return colorbg
		}
	}

	return false
}
