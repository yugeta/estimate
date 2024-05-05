import {Element3D, element, html, attribute, Index} from 'lume'
import {signalify} from 'classy-solid'

async function fetchPhotos() {
	const json = await fetch('https://picsum.photos/v2/list?page=2&limit=14').then(r => r.json())

	// change the size to 100x100
	json.forEach(photo => {
		const parts = photo.download_url.split('/')
		parts.pop()
		parts.pop()
		parts.push(100)
		photo.download_url = parts.join('/')
	})

	console.log('photos:', json.map(photo => photo.download_url))
	return json.map(photo => photo.download_url)
}

const photos = await fetchPhotos()

element('my-photos')(class extends Element3D {
	template = () => html`
        <carousel-layout radius="200">
            ${photos.map((photo, i) => html`
				<lume-rounded-rectangle
					size="80 80"
					corner-radius="10"
					thickness="0.1"
					mount-point="0.5 0.5"
					has="projected-material"
					texture-projectors=${".projector"+i}
					cast-shadow="false"
					receive-shadow="false"
					roughness="0.5"
				>
					<lume-texture-projector
						class=${"projector"+i}
						src=${photo}
						fitment="contain"
						size-mode="p p"
						size="1.1 1.1"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
						position="0 0 150"
					></lume-texture-projector>
				</lume-rounded-rectangle>
            `)}
        </carousel-layout>
    `

})

element('carousel-layout')(class extends Element3D {
	static observedAttributes = {
		radius: attribute.string(),
	}
	
	radius = 200
	
	hasShadow = true
	childrenSignal = []
	
	constructor() {
		super()
		signalify(this, 'childrenSignal')
	}
	
	connectedCallback() {
		super.connectedCallback()
		
		this.createEffect(() => {
			console.log('children length: ', this.childrenSignal.length)
			let i = -1
			for (const child of this.childrenSignal) {
				i++
				child.slot = "slot" + i
			}
		})
	}
	
	#queued = false
	
	childConnectedCallback(...args) {
		super.childConnectedCallback(...args)
		
		if (this.#queued) return
		this.#queued = true
		// return
		requestAnimationFrame(() => {
			console.log('handle children', this.children)
			this.#queued = false
			this.childrenSignal = Array.from(this.children)
		})
	}

	template = () => html`
		<${Index} each=${() => this.childrenSignal}>
			${(_, index) => html`
				<lume-element3d rotation=${() => [0, (360 / this.childrenSignal.length) * index]}>
					<lume-element3d position=${() => [0, 0, this.radius]} mount-point="0.5 0.5">
						<slot name=${() => "slot" + index}></slot>
					</lume-element3d>
				</lume-element3d>
			`}
		</>
	`
})
