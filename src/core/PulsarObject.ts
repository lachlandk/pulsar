import { Pulsar } from "./Controller.js";
import { CanvasContainer } from "./CanvasContainer.js";

/**
 * Base class for parent-level elements in Pulsar.
 * Instances will typically contain one or more {@link CanvasContainer | `CanvasContainer`} instances which themselves contain {@link ResponsiveCanvas | `ResponsiveCanvas`} instances.
 * Internally, it has a `display` style of `"grid"`.
 */
export class PulsarObject extends HTMLElement {
    /**
     * List of the child {@link CanvasContainer | `CanvasContainer`} instances of the object.
     */
    containers: CanvasContainer[] = []

    constructor() {
        super();
        this.style.display = "grid";

        Pulsar.activeObjects.push(this);
    }

    /**
     * Sets the instance's `display` style to `"grid"`.
     */
    show() {
        this.style.display = "grid";
    }

    /**
     * Sets the instance's `display` style to `"none"`.
     */
    hide() {
        this.style.display = "none";
    }
}

window.customElements.define("pulsar-object", PulsarObject); // put this in a static method
