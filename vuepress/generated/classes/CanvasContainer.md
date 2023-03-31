# Class: CanvasContainer

## Hierarchy

- `HTMLElement`

  ↳ **`CanvasContainer`**

## Table of contents

### Constructors

- [constructor](CanvasContainer.md#constructor)

### Properties

- [canvases](CanvasContainer.md#canvases)
- [origin](CanvasContainer.md#origin)
- [parent](CanvasContainer.md#parent)
- [resizeObserver](CanvasContainer.md#resizeobserver)
- [scale](CanvasContainer.md#scale)
- [xLims](CanvasContainer.md#xlims)
- [yLims](CanvasContainer.md#ylims)
- [Defaults](CanvasContainer.md#defaults)

### Methods

- [setOrigin](CanvasContainer.md#setorigin)
- [setXLims](CanvasContainer.md#setxlims)
- [setYLims](CanvasContainer.md#setylims)

## Constructors

### constructor

• **new CanvasContainer**(`parent`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | [`PulsarObject`](PulsarObject.md) |
| `options` | `Partial`<{ `origin`: [`number`, `number`] \| ``"centre"`` ; `xLims`: [`number`, `number`] ; `yLims`: [`number`, `number`]  }\> |

#### Overrides

HTMLElement.constructor

#### Defined in

[CanvasContainer.ts:38](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L38)

## Properties

### canvases

• **canvases**: [`ResponsiveCanvas`](ResponsiveCanvas.md)[] = `[]`

#### Defined in

[CanvasContainer.ts:13](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L13)

___

### origin

• **origin**: `Object` = `CanvasContainer.Defaults.origin`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[CanvasContainer.ts:24](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L24)

___

### parent

• **parent**: [`PulsarObject`](PulsarObject.md)

#### Defined in

[CanvasContainer.ts:12](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L12)

___

### resizeObserver

• **resizeObserver**: `ResizeObserver`

#### Defined in

[CanvasContainer.ts:21](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L21)

___

### scale

• **scale**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[CanvasContainer.ts:14](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L14)

___

### xLims

• **xLims**: [`number`, `number`] = `CanvasContainer.Defaults.xLims`

#### Defined in

[CanvasContainer.ts:22](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L22)

___

### yLims

• **yLims**: [`number`, `number`] = `CanvasContainer.Defaults.yLims`

#### Defined in

[CanvasContainer.ts:23](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L23)

___

### Defaults

▪ `Static` **Defaults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `origin` | { `x`: `number` = 0; `y`: `number` = 0 } |
| `origin.x` | `number` |
| `origin.y` | `number` |
| `xLims` | [`number`, `number`] |
| `yLims` | [`number`, `number`] |

#### Defined in

[CanvasContainer.ts:29](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L29)

## Methods

### setOrigin

▸ **setOrigin**(`...point`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...point` | [`number`, `number`] \| [``"centre"``] |

#### Returns

`void`

#### Defined in

[CanvasContainer.ts:89](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L89)

___

### setXLims

▸ **setXLims**(`min`, `max`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `min` | `number` |
| `max` | `number` |

#### Returns

`void`

#### Defined in

[CanvasContainer.ts:69](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L69)

___

### setYLims

▸ **setYLims**(`min`, `max`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `min` | `number` |
| `max` | `number` |

#### Returns

`void`

#### Defined in

[CanvasContainer.ts:79](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/CanvasContainer.ts#L79)
