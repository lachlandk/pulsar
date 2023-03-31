# Class: ResponsiveCanvas

## Table of contents

### Constructors

- [constructor](ResponsiveCanvas.md#constructor)

### Properties

- [background](ResponsiveCanvas.md#background)
- [canvas](ResponsiveCanvas.md#canvas)
- [components](ResponsiveCanvas.md#components)
- [container](ResponsiveCanvas.md#container)
- [context](ResponsiveCanvas.md#context)
- [updateFlag](ResponsiveCanvas.md#updateflag)
- [Defaults](ResponsiveCanvas.md#defaults)

### Methods

- [setBackground](ResponsiveCanvas.md#setbackground)
- [update](ResponsiveCanvas.md#update)

## Constructors

### constructor

• **new ResponsiveCanvas**(`container`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | [`CanvasContainer`](CanvasContainer.md) |
| `options` | `Partial`<{ `background`: `string`  }\> |

#### Defined in

[ResponsiveCanvas.ts:21](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L21)

## Properties

### background

• **background**: `string` = `ResponsiveCanvas.Defaults.background`

#### Defined in

[ResponsiveCanvas.ts:14](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L14)

___

### canvas

• **canvas**: `HTMLCanvasElement`

#### Defined in

[ResponsiveCanvas.ts:10](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L10)

___

### components

• **components**: [`Component`](Component.md)[] = `[]`

#### Defined in

[ResponsiveCanvas.ts:13](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L13)

___

### container

• **container**: [`CanvasContainer`](CanvasContainer.md)

#### Defined in

[ResponsiveCanvas.ts:11](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L11)

___

### context

• **context**: `CanvasRenderingContext2D`

#### Defined in

[ResponsiveCanvas.ts:12](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L12)

___

### updateFlag

• **updateFlag**: `boolean` = `true`

#### Defined in

[ResponsiveCanvas.ts:15](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L15)

___

### Defaults

▪ `Static` **Defaults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background` | `string` |

#### Defined in

[ResponsiveCanvas.ts:17](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L17)

## Methods

### setBackground

▸ **setBackground**(`css`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `css` | `string` |

#### Returns

`void`

#### Defined in

[ResponsiveCanvas.ts:49](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L49)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[ResponsiveCanvas.ts:40](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/ResponsiveCanvas.ts#L40)
