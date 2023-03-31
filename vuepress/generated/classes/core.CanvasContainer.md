# Class: CanvasContainer

[core](../modules/core.md).CanvasContainer

Base class for Pulsar elements which contain [`ResponsiveCanvas`](core.ResponsiveCanvas.md) instances.
Instances will be a child element of a [`PulsarObject`](core.PulsarObject.md).
It has an internal coordinate system which is independent of the coordinates of the canvas drawing surface for ease of use.
It will also watch the parent object and resize all canvases accordingly whenever the parent is resized.

## Hierarchy

- `HTMLElement`

  ↳ **`CanvasContainer`**

  ↳↳ [`Plot`](plotting.Plot.md)

## Table of contents

### Properties

- [Defaults](core.CanvasContainer.md#defaults)
- [parent](core.CanvasContainer.md#parent)
- [canvases](core.CanvasContainer.md#canvases)
- [scale](core.CanvasContainer.md#scale)
- [resizeObserver](core.CanvasContainer.md#resizeobserver)
- [xLims](core.CanvasContainer.md#xlims)
- [yLims](core.CanvasContainer.md#ylims)
- [origin](core.CanvasContainer.md#origin)

### Constructors

- [constructor](core.CanvasContainer.md#constructor)

### Methods

- [setXLims](core.CanvasContainer.md#setxlims)
- [setYLims](core.CanvasContainer.md#setylims)
- [setOrigin](core.CanvasContainer.md#setorigin)

## Properties

### Defaults

▪ `Static` **Defaults**: `Object`

Name | Default value
--- | ---
`xLims` | `[0, 10]`
`yLims` | `[-10, 0]`
`origin` | `{x: 0, y: 0}`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `xLims` | [`number`, `number`] |
| `yLims` | [`number`, `number`] |
| `origin` | { `x`: `number` = 0; `y`: `number` = 0 } |
| `origin.x` | `number` |
| `origin.y` | `number` |

#### Defined in

[core/CanvasContainer.ts:63](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L63)

___

### parent

• **parent**: [`PulsarObject`](core.PulsarObject.md)

Parent instance of [`PulsarObject`](core.PulsarObject.md).

#### Defined in

[core/CanvasContainer.ts:21](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L21)

___

### canvases

• **canvases**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)[] = `[]`

List of the child [`ResponsiveCanvas`](core.ResponsiveCanvas.md) instances of the container.

#### Defined in

[core/CanvasContainer.ts:25](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L25)

___

### scale

• **scale**: `Object`

Scale of the internal coordinate system in canvas pixels to container units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/CanvasContainer.ts:29](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L29)

___

### resizeObserver

• **resizeObserver**: `ResizeObserver`

The [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance which will watch the parent object to detect a resize event.

#### Defined in

[core/CanvasContainer.ts:39](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L39)

___

### xLims

• **xLims**: [`number`, `number`] = `CanvasContainer.Defaults.xLims`

The horizontal limits of the internal coordinate system in container units.

#### Defined in

[core/CanvasContainer.ts:43](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L43)

___

### yLims

• **yLims**: [`number`, `number`] = `CanvasContainer.Defaults.yLims`

The vertical limits of the internal coordinate system in container units.

#### Defined in

[core/CanvasContainer.ts:47](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L47)

___

### origin

• **origin**: `Object` = `CanvasContainer.Defaults.origin`

The origin of the internal coordinate system in canvas units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/CanvasContainer.ts:51](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L51)

## Constructors

### constructor

• **new CanvasContainer**(`parent`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parent` | [`PulsarObject`](core.PulsarObject.md) | The parent [`PulsarObject`](core.PulsarObject.md) element. |
| `options` | `Partial`<{ `xLims`: [`number`, `number`] ; `yLims`: [`number`, `number`] ; `origin`: [`number`, `number`] \| ``"centre"``  }\> | Options for the container. |

#### Overrides

HTMLElement.constructor

#### Defined in

[core/CanvasContainer.ts:76](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L76)

## Methods

### setXLims

▸ **setXLims**(`min`, `max`): `void`

Sets the horizontal limits of the internal coordinate system in container units.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | The minimum horizontal value. |
| `max` | `number` | The maximum horizontal value. |

#### Returns

`void`

#### Defined in

[core/CanvasContainer.ts:112](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L112)

___

### setYLims

▸ **setYLims**(`min`, `max`): `void`

Sets the vertical limits of the internal coordinate system in container units.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | The minimum vertical value. |
| `max` | `number` | The maximum vertical value. |

#### Returns

`void`

#### Defined in

[core/CanvasContainer.ts:127](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L127)

___

### setOrigin

▸ **setOrigin**(`...point`): `void`

Sets the origin of the internal coordinate system in canvas pixels.
`x` and `y` values may be passed or the value `"centre"` may be passed to conveniently set the origin to the centre of the canvas.
Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards, while the y-axis points downwards.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...point` | [`number`, `number`] \| [``"centre"``] | The new origin in canvas pixels. |

#### Returns

`void`

#### Defined in

[core/CanvasContainer.ts:143](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L143)
