# Class: Animation

## Table of contents

### Constructors

- [constructor](Animation.md#constructor)

### Properties

- [func](Animation.md#func)
- [parent](Animation.md#parent)
- [period](Animation.md#period)
- [repeat](Animation.md#repeat)
- [Defaults](Animation.md#defaults)

### Methods

- [animate](Animation.md#animate)
- [setPeriod](Animation.md#setperiod)
- [setRepeat](Animation.md#setrepeat)

## Constructors

### constructor

• **new Animation**(`parent`, `func`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | [`PulsarObject`](PulsarObject.md) |
| `func` | (`time`: `number`) => `void` |
| `options` | `Partial`<{ `period`: `number` ; `repeat`: `boolean`  }\> |

#### Defined in

[Animation.ts:21](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L21)

## Properties

### func

• **func**: (`time`: `number`) => `void`

#### Type declaration

▸ (`time`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `number` |

##### Returns

`void`

#### Defined in

[Animation.ts:12](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L12)

___

### parent

• **parent**: [`PulsarObject`](PulsarObject.md)

#### Defined in

[Animation.ts:11](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L11)

___

### period

• **period**: `number` = `Animation.Defaults.period`

#### Defined in

[Animation.ts:13](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L13)

___

### repeat

• **repeat**: `boolean` = `Animation.Defaults.repeat`

#### Defined in

[Animation.ts:14](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L14)

___

### Defaults

▪ `Static` **Defaults**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `period` | `number` |
| `repeat` | `boolean` |

#### Defined in

[Animation.ts:16](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L16)

## Methods

### animate

▸ **animate**(`time`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `number` |

#### Returns

`void`

#### Defined in

[Animation.ts:35](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L35)

___

### setPeriod

▸ **setPeriod**(`period`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `period` | `number` |

#### Returns

`void`

#### Defined in

[Animation.ts:42](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L42)

___

### setRepeat

▸ **setRepeat**(`repeat`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `repeat` | `boolean` |

#### Returns

`void`

#### Defined in

[Animation.ts:46](https://github.com/lachlandk/pulsar/blob/b9d63d0/src/core/Animation.ts#L46)
