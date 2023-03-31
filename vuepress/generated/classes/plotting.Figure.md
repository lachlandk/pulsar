# Class: Figure

[plotting](../modules/plotting.md).Figure

Top-level element for plotting. An instance of `Figure` typically contains one or more [`Plot`](plotting.Plot.md) instances which have data plotted on them.
This is analogous to the [Figure](https://matplotlib.org/stable/api/figure_api.html) class in matplotlib.
By default, a single plot is created on the new instance with the options passed through the `plot` property of the options object.

## Hierarchy

- [`PulsarObject`](core.PulsarObject.md)

  ↳ **`Figure`**

## Table of contents

### Constructors

- [constructor](plotting.Figure.md#constructor)

### Properties

- [containers](plotting.Figure.md#containers)

### Methods

- [show](plotting.Figure.md#show)
- [hide](plotting.Figure.md#hide)

## Constructors

### constructor

• **new Figure**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Partial`<{ `plot`: [`PlotOptions`](../modules/plotting.md#plotoptions)  }\> | Options for the figure. |

#### Overrides

[PulsarObject](core.PulsarObject.md).[constructor](core.PulsarObject.md#constructor)

#### Defined in

[plotting/Figure.ts:17](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Figure.ts#L17)

## Properties

### containers

• **containers**: [`CanvasContainer`](core.CanvasContainer.md)[] = `[]`

List of the child CanvasContainer | `CanvasContainer` instances of the object.

#### Inherited from

[PulsarObject](core.PulsarObject.md).[containers](core.PulsarObject.md#containers)

#### Defined in

[core/PulsarObject.ts:13](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L13)

## Methods

### show

▸ **show**(): `void`

Sets the `display` style to `"grid"`.

#### Returns

`void`

#### Inherited from

[PulsarObject](core.PulsarObject.md).[show](core.PulsarObject.md#show)

#### Defined in

[core/PulsarObject.ts:25](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L25)

___

### hide

▸ **hide**(): `void`

Sets the `display` style to `"none"`.

#### Returns

`void`

#### Inherited from

[PulsarObject](core.PulsarObject.md).[hide](core.PulsarObject.md#hide)

#### Defined in

[core/PulsarObject.ts:32](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/core/PulsarObject.ts#L32)
