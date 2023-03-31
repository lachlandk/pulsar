# Class: Trace

[plotting](../modules/plotting.md).Trace

Component representing the data trace on a plot.

## Hierarchy

- [`Component`](core.Component.md)

  ↳ **`Trace`**

## Table of contents

### Properties

- [Defaults](plotting.Trace.md#defaults)
- [xData](plotting.Trace.md#xdata)
- [yData](plotting.Trace.md#ydata)
- [traceColour](plotting.Trace.md#tracecolour)
- [traceStyle](plotting.Trace.md#tracestyle)
- [traceWidth](plotting.Trace.md#tracewidth)
- [markerColour](plotting.Trace.md#markercolour)
- [markerStyle](plotting.Trace.md#markerstyle)
- [markerSize](plotting.Trace.md#markersize)
- [visibility](plotting.Trace.md#visibility)
- [canvas](plotting.Trace.md#canvas)
- [draw](plotting.Trace.md#draw)

### Constructors

- [constructor](plotting.Trace.md#constructor)

### Methods

- [setData](plotting.Trace.md#setdata)
- [setTraceColour](plotting.Trace.md#settracecolour)
- [setTraceStyle](plotting.Trace.md#settracestyle)
- [setTraceWidth](plotting.Trace.md#settracewidth)
- [setMarkerColour](plotting.Trace.md#setmarkercolour)
- [setMarkerStyle](plotting.Trace.md#setmarkerstyle)
- [setMarkerSize](plotting.Trace.md#setmarkersize)
- [setVisibility](plotting.Trace.md#setvisibility)

## Properties

### Defaults

▪ `Static` **Defaults**: `Object`

Name | Default value
--- | ---
`traceColour` | `"blue"`
`traceStyle` | `"solid"`
`traceWidth` | `3`
`markerColour` | `"blue"`
`markerStyle` | `"none"`
`markerSize` | `1`
`visibility` | `true`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `traceColour` | `string` |
| `traceStyle` | ``"solid"`` |
| `traceWidth` | `number` |
| `markerColour` | `string` |
| `markerStyle` | ``"none"`` |
| `markerSize` | `number` |
| `visibility` | `boolean` |

#### Defined in

[plotting/Trace.ts:68](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L68)

___

### xData

• **xData**: `NDArray`

The x-axis data.

#### Defined in

[plotting/Trace.ts:23](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L23)

___

### yData

• **yData**: `NDArray`

The y-axis data.

#### Defined in

[plotting/Trace.ts:27](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L27)

___

### traceColour

• **traceColour**: `string` = `Trace.Defaults.traceColour`

Colour of the data trace.

#### Defined in

[plotting/Trace.ts:31](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L31)

___

### traceStyle

• **traceStyle**: ``"none"`` \| ``"solid"`` \| ``"dotted"`` \| ``"dashed"`` \| ``"dashdot"`` = `Trace.Defaults.traceStyle`

Line style of the data trace.

#### Defined in

[plotting/Trace.ts:35](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L35)

___

### traceWidth

• **traceWidth**: `number` = `Trace.Defaults.traceWidth`

Line thickness of the data trace in pixels.

#### Defined in

[plotting/Trace.ts:39](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L39)

___

### markerColour

• **markerColour**: `string` = `Trace.Defaults.markerColour`

Colour of the data markers.

#### Defined in

[plotting/Trace.ts:43](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L43)

___

### markerStyle

• **markerStyle**: ``"none"`` \| ``"circle"`` \| ``"plus"`` \| ``"cross"`` \| ``"arrow"`` = `Trace.Defaults.markerStyle`

Style of the data markers.

#### Defined in

[plotting/Trace.ts:47](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L47)

___

### markerSize

• **markerSize**: `number` = `Trace.Defaults.markerSize`

Size of the data markers in pixels.

#### Defined in

[plotting/Trace.ts:51](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L51)

___

### visibility

• **visibility**: `boolean` = `Trace.Defaults.visibility`

Visibility of the data trace.

#### Defined in

[plotting/Trace.ts:55](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L55)

___

### canvas

• **canvas**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)

The canvas which the component is attached to.

#### Inherited from

[Component](core.Component.md).[canvas](core.Component.md#canvas)

#### Defined in

[core/Component.ts:11](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Component.ts#L11)

___

### draw

• **draw**: (`context`: `CanvasRenderingContext2D`) => `void`

#### Type declaration

▸ (`context`): `void`

Function which draws the component on the canvas.

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `CanvasRenderingContext2D` |

##### Returns

`void`

#### Inherited from

[Component](core.Component.md).[draw](core.Component.md#draw)

#### Defined in

[core/Component.ts:15](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Component.ts#L15)

## Constructors

### constructor

• **new Trace**(`canvas`, `x`, `y`, `options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | [`ResponsiveCanvas`](core.ResponsiveCanvas.md) | The parent canvas. |
| `x` | `number`[] \| `NDArray` | Data for the x-axis (optional, see [`setData()`](plotting.Trace.md#setdata)). |
| `y` | `number`[] \| `NDArray` | Data for the y-axis |
| `options` | `Partial`<{ `traceColour`: `string` ; `traceStyle`: ``"none"`` \| ``"solid"`` \| ``"dotted"`` \| ``"dashed"`` \| ``"dashdot"`` ; `traceWidth`: `number` ; `markerColour`: `string` ; `markerStyle`: ``"none"`` \| ``"circle"`` \| ``"plus"`` \| ``"cross"`` \| ``"arrow"`` ; `markerSize`: `number` ; `visibility`: `boolean`  }\> | Options for the data trace. |

#### Overrides

[Component](core.Component.md).[constructor](core.Component.md#constructor)

#### Defined in

[plotting/Trace.ts:86](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L86)

## Methods

### setData

▸ **setData**(`x`, `y`): `void`

Set the plotting data for the data trace.
`x` argument is optional. If it is omitted, the x data becomes the indices of the y data array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number`[] \| `NDArray` | Data for the x-axis. |
| `y` | `number`[] \| `NDArray` | Data for the y-axis. |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:110](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L110)

___

### setTraceColour

▸ **setTraceColour**(`colour`): `void`

Sets the colour of the data trace.
Must be a browser-recognised colour name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `colour` | `string` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:223](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L223)

___

### setTraceStyle

▸ **setTraceStyle**(`style`): `void`

Sets the style of the data trace.

#### Parameters

| Name | Type |
| :------ | :------ |
| `style` | ``"none"`` \| ``"solid"`` \| ``"dotted"`` \| ``"dashed"`` \| ``"dashdot"`` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:232](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L232)

___

### setTraceWidth

▸ **setTraceWidth**(`width`): `void`

Sets the line width of the data trace in pixels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:241](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L241)

___

### setMarkerColour

▸ **setMarkerColour**(`colour`): `void`

Sets the colour of the data markers.
Must be a browser-recognised colour name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `colour` | `string` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:251](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L251)

___

### setMarkerStyle

▸ **setMarkerStyle**(`style`): `void`

Sets the style of the data markers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `style` | ``"none"`` \| ``"circle"`` \| ``"plus"`` \| ``"cross"`` \| ``"arrow"`` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:260](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L260)

___

### setMarkerSize

▸ **setMarkerSize**(`size`): `void`

Sets the size of the data markers in pixels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:269](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L269)

___

### setVisibility

▸ **setVisibility**(`value`): `void`

Toggles the visibility of the data trace.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[plotting/Trace.ts:278](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L278)
