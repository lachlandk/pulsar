# Class: Axis

[plotting](../modules/plotting.md).Axis

Component representing the two axes of a cartesian plot.

## Hierarchy

- [`Component`](core.Component.md)

  ↳ **`Axis`**

## Table of contents

### Properties

- [Defaults](plotting.Axis.md#defaults)
- [majorTicks](plotting.Axis.md#majorticks)
- [minorTicks](plotting.Axis.md#minorticks)
- [majorTickSize](plotting.Axis.md#majorticksize)
- [minorTickSize](plotting.Axis.md#minorticksize)
- [majorGridlines](plotting.Axis.md#majorgridlines)
- [minorGridlines](plotting.Axis.md#minorgridlines)
- [majorGridSize](plotting.Axis.md#majorgridsize)
- [minorGridSize](plotting.Axis.md#minorgridsize)
- [canvas](plotting.Axis.md#canvas)
- [draw](plotting.Axis.md#draw)

### Constructors

- [constructor](plotting.Axis.md#constructor)

### Methods

- [setMajorTicks](plotting.Axis.md#setmajorticks)
- [setMinorTicks](plotting.Axis.md#setminorticks)
- [setMajorTickSize](plotting.Axis.md#setmajorticksize)
- [setMinorTickSize](plotting.Axis.md#setminorticksize)
- [setMajorGridlines](plotting.Axis.md#setmajorgridlines)
- [setMinorGridlines](plotting.Axis.md#setminorgridlines)
- [setMajorGridSize](plotting.Axis.md#setmajorgridsize)
- [setMinorGridSize](plotting.Axis.md#setminorgridsize)

## Properties

### Defaults

▪ `Static` **Defaults**: `Object`

Name | Default value
--- | ---
`majorTicks` | `{x: false, y: false}`
`minorTicks` | `{x: true, y: true}`
`majorTickSize` | `{x: 5, y: 5}`
`minorTickSize` | `{x: 1, y: 1}`
`majorGridlines` | `{x: true, y: true}`
`minorGridlines` | `{x: false, y: false}`
`majorGridSize` | `{x: 5, y: 5}`
`minorGridSize` | `{x: 1, y: 1}`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `majorTicks` | { `x`: `boolean` = false; `y`: `boolean` = false } |
| `majorTicks.x` | `boolean` |
| `majorTicks.y` | `boolean` |
| `minorTicks` | { `x`: `boolean` = true; `y`: `boolean` = true } |
| `minorTicks.x` | `boolean` |
| `minorTicks.y` | `boolean` |
| `majorTickSize` | { `x`: `number` = 5; `y`: `number` = 5 } |
| `majorTickSize.x` | `number` |
| `majorTickSize.y` | `number` |
| `minorTickSize` | { `x`: `number` = 1; `y`: `number` = 1 } |
| `minorTickSize.x` | `number` |
| `minorTickSize.y` | `number` |
| `majorGridlines` | { `x`: `boolean` = true; `y`: `boolean` = true } |
| `majorGridlines.x` | `boolean` |
| `majorGridlines.y` | `boolean` |
| `minorGridlines` | { `x`: `boolean` = false; `y`: `boolean` = false } |
| `minorGridlines.x` | `boolean` |
| `minorGridlines.y` | `boolean` |
| `majorGridSize` | { `x`: `number` = 5; `y`: `number` = 5 } |
| `majorGridSize.x` | `number` |
| `majorGridSize.y` | `number` |
| `minorGridSize` | { `x`: `number` = 1; `y`: `number` = 1 } |
| `minorGridSize.x` | `number` |
| `minorGridSize.y` | `number` |

#### Defined in

[plotting/Axis.ts:65](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L65)

___

### majorTicks

• **majorTicks**: `Object` = `Axis.Defaults.majorTicks`

Indicates whether major ticks will be displayed.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `boolean` |
| `y` | `boolean` |

#### Defined in

[plotting/Axis.ts:23](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L23)

___

### minorTicks

• **minorTicks**: `Object` = `Axis.Defaults.minorTicks`

Indicates whether minor ticks will be displayed.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `boolean` |
| `y` | `boolean` |

#### Defined in

[plotting/Axis.ts:27](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L27)

___

### majorTickSize

• **majorTickSize**: `Object` = `Axis.Defaults.majorTickSize`

Spacing between major ticks in plot units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[plotting/Axis.ts:31](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L31)

___

### minorTickSize

• **minorTickSize**: `Object` = `Axis.Defaults.minorTickSize`

Spacing between minor ticks in plot units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[plotting/Axis.ts:35](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L35)

___

### majorGridlines

• **majorGridlines**: `Object` = `Axis.Defaults.majorGridlines`

Indicates whether major gridlines will be displayed.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `boolean` |
| `y` | `boolean` |

#### Defined in

[plotting/Axis.ts:39](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L39)

___

### minorGridlines

• **minorGridlines**: `Object` = `Axis.Defaults.minorGridlines`

Indicates whether minor gridlines will be displayed.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `boolean` |
| `y` | `boolean` |

#### Defined in

[plotting/Axis.ts:43](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L43)

___

### majorGridSize

• **majorGridSize**: `Object` = `Axis.Defaults.majorGridSize`

Spacing between major gridlines in plot units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[plotting/Axis.ts:47](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L47)

___

### minorGridSize

• **minorGridSize**: `Object` = `Axis.Defaults.minorGridSize`

Spacing between minor gridlines in plot units.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[plotting/Axis.ts:51](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L51)

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

• **new Axis**(`canvas`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | [`ResponsiveCanvas`](core.ResponsiveCanvas.md) | The parent canvas. |
| `options` | `Partial`<{ `majorTicks`: `boolean` \| [`boolean`, `boolean`] ; `minorTicks`: `boolean` \| [`boolean`, `boolean`] ; `majorTickSize`: `number` \| [`number`, `number`] ; `minorTickSize`: `number` \| [`number`, `number`] ; `majorGridlines`: `boolean` \| [`boolean`, `boolean`] ; `minorGridlines`: `boolean` \| [`boolean`, `boolean`] ; `majorGridSize`: `number` \| [`number`, `number`] ; `minorGridSize`: `number` \| [`number`, `number`]  }\> | Options for the axis. |

#### Overrides

[Component](core.Component.md).[constructor](core.Component.md#constructor)

#### Defined in

[plotting/Axis.ts:80](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L80)

## Methods

### setMajorTicks

▸ **setMajorTicks**(`...choices`): `void`

Toggles the major ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...choices` | [`boolean`, `boolean`] \| [`boolean`] | Tick visibility. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:137](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L137)

___

### setMinorTicks

▸ **setMinorTicks**(`...choices`): `void`

Toggles the minor ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...choices` | [`boolean`, `boolean`] \| [`boolean`] | Tick visibility. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:146](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L146)

___

### setMajorTickSize

▸ **setMajorTickSize**(`...sizes`): `void`

Sets the spacing of the major ticks in plot units. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...sizes` | [`number`, `number`] \| [`number`] | Tick spacing. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:155](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L155)

___

### setMinorTickSize

▸ **setMinorTickSize**(`...sizes`): `void`

Sets the spacing of the minor ticks in plot units. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...sizes` | [`number`, `number`] \| [`number`] | Tick spacing. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:164](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L164)

___

### setMajorGridlines

▸ **setMajorGridlines**(`...choices`): `void`

Toggles the major gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...choices` | [`boolean`, `boolean`] \| [`boolean`] | Gridline visibility. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:173](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L173)

___

### setMinorGridlines

▸ **setMinorGridlines**(`...choices`): `void`

Toggles the minor gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...choices` | [`boolean`, `boolean`] \| [`boolean`] | Gridline visibility. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:182](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L182)

___

### setMajorGridSize

▸ **setMajorGridSize**(`...sizes`): `void`

Sets the spacing of the major gridlines in plot units. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...sizes` | [`number`, `number`] \| [`number`] | Gridline spacing. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:191](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L191)

___

### setMinorGridSize

▸ **setMinorGridSize**(`...sizes`): `void`

Sets the spacing of the minor gridlines in plot units. Two values may be passed for `x` then `y`, or just a single value for both axes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...sizes` | [`number`, `number`] \| [`number`] | Gridline spacing. |

#### Returns

`void`

#### Defined in

[plotting/Axis.ts:200](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L200)
