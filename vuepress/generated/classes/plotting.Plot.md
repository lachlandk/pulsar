# Class: Plot

[plotting](../modules/plotting.md).Plot

Represents the actual plotting surface of a figure.
This class is analogous to the [Axes](https://matplotlib.org/stable/api/axes_api.html) class in matplotlib.
Each instance contains two ResponsiveCanvas instances, one for the background of the plot (axes, gridlines, etc.) and one for the foreground (data).
An [`Axis`](plotting.Axis.md) attached to the plot is also created by default.
Options for all these objects can be passed through the `background`, `foreground` and `axis` properties respectively in the options object.
Plots contain their own coordinate system ("plot units") which are independent of the canvas coordinate system.
The origin of this coordinate system can be set using [`setOrigin()`](plotting.Plot.md#setorigin).

## Hierarchy

- [`CanvasContainer`](core.CanvasContainer.md)

  ↳ **`Plot`**

## Table of contents

### Properties

- [Defaults](plotting.Plot.md#defaults)
- [background](plotting.Plot.md#background)
- [foreground](plotting.Plot.md#foreground)
- [axis](plotting.Plot.md#axis)
- [data](plotting.Plot.md#data)
- [parent](plotting.Plot.md#parent)
- [canvases](plotting.Plot.md#canvases)
- [scale](plotting.Plot.md#scale)
- [resizeObserver](plotting.Plot.md#resizeobserver)
- [xLims](plotting.Plot.md#xlims)
- [yLims](plotting.Plot.md#ylims)
- [origin](plotting.Plot.md#origin)

### Constructors

- [constructor](plotting.Plot.md#constructor)

### Methods

- [plot](plotting.Plot.md#plot)
- [setXLims](plotting.Plot.md#setxlims)
- [setYLims](plotting.Plot.md#setylims)
- [setOrigin](plotting.Plot.md#setorigin)

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

#### Overrides

[CanvasContainer](core.CanvasContainer.md).[Defaults](core.CanvasContainer.md#defaults)

#### Defined in

[plotting/Plot.ts:41](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L41)

___

### background

• **background**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)

Background canvas which contains static plot elements like axes and gridlines.

#### Defined in

[plotting/Plot.ts:27](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L27)

___

### foreground

• **foreground**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)

Foreground canvas which contains dynamic plot elements like data traces.

#### Defined in

[plotting/Plot.ts:31](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L31)

___

### axis

• **axis**: [`Axis`](plotting.Axis.md)

Component which draws the axes.

#### Defined in

[plotting/Plot.ts:35](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L35)

___

### data

• **data**: [`Trace`](plotting.Trace.md)[] = `[]`

List of data traces present on the plot.

#### Defined in

[plotting/Plot.ts:39](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L39)

___

### parent

• **parent**: [`PulsarObject`](core.PulsarObject.md)

Parent instance of PulsarObject | `PulsarObject`.

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[parent](core.CanvasContainer.md#parent)

#### Defined in

[core/CanvasContainer.ts:21](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L21)

___

### canvases

• **canvases**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)[] = `[]`

List of the child ResponsiveCanvas | `ResponsiveCanvas` instances of the container.

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[canvases](core.CanvasContainer.md#canvases)

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

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[scale](core.CanvasContainer.md#scale)

#### Defined in

[core/CanvasContainer.ts:29](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L29)

___

### resizeObserver

• **resizeObserver**: `ResizeObserver`

The [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance which will watch the parent object to detect a resize event.

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[resizeObserver](core.CanvasContainer.md#resizeobserver)

#### Defined in

[core/CanvasContainer.ts:39](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L39)

___

### xLims

• **xLims**: [`number`, `number`] = `CanvasContainer.Defaults.xLims`

The horizontal limits of the internal coordinate system in container units.

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[xLims](core.CanvasContainer.md#xlims)

#### Defined in

[core/CanvasContainer.ts:43](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L43)

___

### yLims

• **yLims**: [`number`, `number`] = `CanvasContainer.Defaults.yLims`

The vertical limits of the internal coordinate system in container units.

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[yLims](core.CanvasContainer.md#ylims)

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

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[origin](core.CanvasContainer.md#origin)

#### Defined in

[core/CanvasContainer.ts:51](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L51)

## Constructors

### constructor

• **new Plot**(`figure`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `figure` | [`Figure`](plotting.Figure.md) | The parent figure element. |
| `options` | [`PlotOptions`](../modules/plotting.md#plotoptions) | Options for the plot. |

#### Overrides

[CanvasContainer](core.CanvasContainer.md).[constructor](core.CanvasContainer.md#constructor)

#### Defined in

[plotting/Plot.ts:49](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L49)

## Methods

### plot

▸ **plot**(`x`, `y`, `options`): `void`

Adds data to the plot.
`x` argument is optional. If it is omitted, the x data becomes the indices of the y data array.
See [plot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html) function from matplotlib.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number`[] \| `NDArray` | Data for the x-axis. |
| `y` | `number`[] \| `NDArray` | Data for the y-axis |
| `options` | `Partial`<{ `traceColour`: `string` ; `traceStyle`: ``"none"`` \| ``"solid"`` \| ``"dotted"`` \| ``"dashed"`` \| ``"dashdot"`` ; `traceWidth`: `number` ; `markerColour`: `string` ; `markerStyle`: ``"none"`` \| ``"circle"`` \| ``"plus"`` \| ``"cross"`` \| ``"arrow"`` ; `markerSize`: `number` ; `visibility`: `boolean`  }\> | Options for the data. |

#### Returns

`void`

The data trace object.

#### Defined in

[plotting/Plot.ts:76](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L76)

___

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

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[setXLims](core.CanvasContainer.md#setxlims)

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

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[setYLims](core.CanvasContainer.md#setylims)

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

#### Inherited from

[CanvasContainer](core.CanvasContainer.md).[setOrigin](core.CanvasContainer.md#setorigin)

#### Defined in

[core/CanvasContainer.ts:143](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/CanvasContainer.ts#L143)
