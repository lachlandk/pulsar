# Class: Animation

[core](../modules/core.md).Animation

Class for an animation that happens on a [`ResponsiveCanvas`](core.ResponsiveCanvas.md).
Time evolution of animations may be controlled using the [`Controller`](core.Controller.md).

## Table of contents

### Properties

- [Defaults](core.Animation.md#defaults)
- [parent](core.Animation.md#parent)
- [func](core.Animation.md#func)
- [period](core.Animation.md#period)
- [repeat](core.Animation.md#repeat)

### Constructors

- [constructor](core.Animation.md#constructor)

### Methods

- [animate](core.Animation.md#animate)
- [setPeriod](core.Animation.md#setperiod)
- [setRepeat](core.Animation.md#setrepeat)

## Properties

### Defaults

▪ `Static` **Defaults**: `Object`

Name | Default value
--- | ---
`period` | `1000`
`repeat` | `true`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `period` | `number` |
| `repeat` | `boolean` |

#### Defined in

[core/Animation.ts:38](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L38)

___

### parent

• **parent**: [`PulsarObject`](core.PulsarObject.md)

The parent [`PulsarObject`](core.PulsarObject.md) instance.

#### Defined in

[core/Animation.ts:18](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L18)

___

### func

• **func**: (`time`: `number`) => `void`

#### Type declaration

▸ (`time`): `void`

Function which generates a frame of the animation given a timestamp.

##### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `number` |

##### Returns

`void`

#### Defined in

[core/Animation.ts:22](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L22)

___

### period

• **period**: `number` = `Animation.Defaults.period`

Period of the animation in milliseconds

#### Defined in

[core/Animation.ts:26](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L26)

___

### repeat

• **repeat**: `boolean` = `Animation.Defaults.repeat`

Indicates whether the animation repeats or not.

#### Defined in

[core/Animation.ts:30](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L30)

## Constructors

### constructor

• **new Animation**(`parent`, `func`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parent` | [`PulsarObject`](core.PulsarObject.md) | Parent [`PulsarObject`](core.PulsarObject.md) instance. |
| `func` | (`time`: `number`) => `void` | The animation function. |
| `options` | `Partial`<{ `period`: `number` ; `repeat`: `boolean`  }\> | Options for the animation. |

#### Defined in

[core/Animation.ts:48](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L48)

## Methods

### animate

▸ **animate**(`time`): `void`

Calls [func](core.Animation.md#func) with the current timestamp if the animation should be running.
Called as part of the event loop if [`animationsActive`](core.Controller.md#animationsactive) is set.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `time` | `number` | The current timestamp of the app. |

#### Returns

`void`

#### Defined in

[core/Animation.ts:67](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L67)

___

### setPeriod

▸ **setPeriod**(`period`): `void`

Sets the period.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `period` | `number` | Period in milliseconds. |

#### Returns

`void`

#### Defined in

[core/Animation.ts:78](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L78)

___

### setRepeat

▸ **setRepeat**(`repeat`): `void`

Sets the repeat flag.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `repeat` | `boolean` | Repeat flag. |

#### Returns

`void`

#### Defined in

[core/Animation.ts:86](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/Animation.ts#L86)
