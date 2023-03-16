import { Pulsar } from "./Controller.js";
import { CanvasContainer } from "./CanvasContainer.js";

export class PulsarObject extends HTMLElement {
    containers: CanvasContainer[] = []

    constructor() {
        super();
        this.style.display = "grid";

        Pulsar.activeObjects.push(this);
    }

    show() {
        this.style.display = "grid";
    }

    hide() {
        this.style.display = "none";
    }
}

window.customElements.define("pulsar-object", PulsarObject); // put this in a static method
