# Class: ResponsiveCanvas

[core](../modules/core.md).ResponsiveCanvas

Base class for Pulsar canvas elements.
Instances will be contained in a [`CanvasContainer`](core.CanvasContainer.md), which they will fill on the page.

## Table of contents

### Properties

- [Defaults](core.ResponsiveCanvas.md#defaults)
- [canvas](core.ResponsiveCanvas.md#canvas)
- [container](core.ResponsiveCanvas.md#container)
- [context](core.ResponsiveCanvas.md#context)
- [components](core.ResponsiveCanvas.md#components)
- [background](core.ResponsiveCanvas.md#background)
- [updateFlag](core.ResponsiveCanvas.md#updateflag)

### Constructors

- [constructor](core.ResponsiveCanvas.md#constructor)

### Methods

- [update](core.ResponsiveCanvas.md#update)
- [setBackground](core.ResponsiveCanvas.md#setbackground)

## Properties

### Defaults

▪ `Static` **Defaults**: `Object`

Name | Default value
--- | ---
`background` | `""`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background` | `string` |

#### Defined in

[core/ResponsiveCanvas.ts:44](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L44)

___

### canvas

• **canvas**: `HTMLCanvasElement`

The canvas element which the instance is responsible for controlling.

#### Defined in

[core/ResponsiveCanvas.ts:17](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L17)

___

### container

• **container**: [`CanvasContainer`](core.CanvasContainer.md)

The parent [`CanvasContainer`](core.CanvasContainer.md) instance.

#### Defined in

[core/ResponsiveCanvas.ts:21](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L21)

___

### context

• **context**: `CanvasRenderingContext2D`

The [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) for the canvas.

#### Defined in

[core/ResponsiveCanvas.ts:25](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L25)

___

### components

• **components**: [`Component`](core.Component.md)[] = `[]`

List of the [`Component`](core.Component.md) instances attached to the canvas instance.

#### Defined in

[core/ResponsiveCanvas.ts:29](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L29)

___

### background

• **background**: `string` = `ResponsiveCanvas.Defaults.background`

The `background` style of the canvas.

#### Defined in

[core/ResponsiveCanvas.ts:33](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L33)

___

### updateFlag

• **updateFlag**: `boolean` = `true`

Indicates whether the canvas instance is to be redrawn on the next event loop pass (see [`Controller`](core.Controller.md)).

#### Defined in

[core/ResponsiveCanvas.ts:37](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L37)

## Constructors

### constructor

• **new ResponsiveCanvas**(`container`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | [`CanvasContainer`](core.CanvasContainer.md) | Parent [`CanvasContainer`](core.CanvasContainer.md) instance. |
| `options` | `Partial`<{ `background`: `string`  }\> | Options for the canvas. |

#### Defined in

[core/ResponsiveCanvas.ts:52](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L52)

## Methods

### update

▸ **update**(): `void`

Clears the canvas and redraws all attached [`Component`](core.Component.md) instances.

#### Returns

`void`

#### Defined in

[core/ResponsiveCanvas.ts:74](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L74)

___

### setBackground

▸ **setBackground**(`css`): `void`

Sets the `background` style of the background canvas.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `css` | `string` | A valid string for the [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) property. |

#### Returns

`void`

#### Defined in

[core/ResponsiveCanvas.ts:87](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/ResponsiveCanvas.ts#L87)
