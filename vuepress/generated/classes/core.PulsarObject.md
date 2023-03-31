# Class: PulsarObject

[core](../modules/core.md).PulsarObject

Base class for parent-level elements in Pulsar.
Instances will typically contain one or more [`CanvasContainer`](core.CanvasContainer.md) instances which themselves contain [`ResponsiveCanvas`](core.ResponsiveCanvas.md) instances.
Internally, it has a `display` style of `"grid"`.

## Hierarchy

- `HTMLElement`

  ↳ **`PulsarObject`**

  ↳↳ [`Figure`](plotting.Figure.md)

## Table of contents

### Constructors

- [constructor](core.PulsarObject.md#constructor)

### Properties

- [containers](core.PulsarObject.md#containers)

### Methods

- [show](core.PulsarObject.md#show)
- [hide](core.PulsarObject.md#hide)

## Constructors

### constructor

• **new PulsarObject**()

#### Overrides

HTMLElement.constructor

#### Defined in

[core/PulsarObject.ts:15](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L15)

## Properties

### containers

• **containers**: [`CanvasContainer`](core.CanvasContainer.md)[] = `[]`

List of the child [`CanvasContainer`](core.CanvasContainer.md) instances of the object.

#### Defined in

[core/PulsarObject.ts:13](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L13)

## Methods

### show

▸ **show**(): `void`

Sets the `display` style to `"grid"`.

#### Returns

`void`

#### Defined in

[core/PulsarObject.ts:25](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L25)

___

### hide

▸ **hide**(): `void`

Sets the `display` style to `"none"`.

#### Returns

`void`

#### Defined in

[core/PulsarObject.ts:32](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L32)
