# Class: Component

[core](../modules/core.md).Component

Base class representing objects which have a visual representation on the canvas.
This is mostly analogous to the [Artist](https://matplotlib.org/stable/api/artist_api.html) class in matplotlib.

## Hierarchy

- **`Component`**

  ↳ [`Axis`](plotting.Axis.md)

  ↳ [`Trace`](plotting.Trace.md)

## Table of contents

### Constructors

- [constructor](core.Component.md#constructor)

### Properties

- [canvas](core.Component.md#canvas)
- [draw](core.Component.md#draw)

## Constructors

### constructor

• **new Component**(`canvas`, `draw?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `canvas` | [`ResponsiveCanvas`](core.ResponsiveCanvas.md) | [`ResponsiveCanvas`](core.ResponsiveCanvas.md) instance. |
| `draw` | (`context`: `CanvasRenderingContext2D`) => `void` | Draw function. |

#### Defined in

[core/Component.ts:21](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Component.ts#L21)

## Properties

### canvas

• **canvas**: [`ResponsiveCanvas`](core.ResponsiveCanvas.md)

The canvas which the component is attached to.

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

#### Defined in

[core/Component.ts:15](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Component.ts#L15)
