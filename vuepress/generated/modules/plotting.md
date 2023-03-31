# Module: plotting

## Table of contents

### Type Aliases

- [PlotOptions](plotting.md#plotoptions)
- [AxisOptions](plotting.md#axisoptions)
- [TraceOptions](plotting.md#traceoptions)
- [FigureOptions](plotting.md#figureoptions)

### Classes

- [Plot](../classes/plotting.Plot.md)
- [Axis](../classes/plotting.Axis.md)
- [Trace](../classes/plotting.Trace.md)
- [Figure](../classes/plotting.Figure.md)

## Type Aliases

### PlotOptions

Ƭ **PlotOptions**: [`ContainerOptions`](core.md#containeroptions) & `Partial`<{ `background`: [`ResponsiveCanvasOptions`](core.md#responsivecanvasoptions) ; `foreground`: [`ResponsiveCanvasOptions`](core.md#responsivecanvasoptions) ; `axis`: [`AxisOptions`](plotting.md#axisoptions)  }\>

#### Defined in

[plotting/Plot.ts:8](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Plot.ts#L8)

___

### AxisOptions

Ƭ **AxisOptions**: `Partial`<{ `majorTicks`: [`boolean`, `boolean`] \| `boolean` ; `minorTicks`: [`boolean`, `boolean`] \| `boolean` ; `majorTickSize`: [`number`, `number`] \| `number` ; `minorTickSize`: [`number`, `number`] \| `number` ; `majorGridlines`: [`boolean`, `boolean`] \| `boolean` ; `minorGridlines`: [`boolean`, `boolean`] \| `boolean` ; `majorGridSize`: [`number`, `number`] \| `number` ; `minorGridSize`: [`number`, `number`] \| `number`  }\>

#### Defined in

[plotting/Axis.ts:5](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Axis.ts#L5)

___

### TraceOptions

Ƭ **TraceOptions**: `Partial`<{ `traceColour`: `string` ; `traceStyle`: ``"solid"`` \| ``"dotted"`` \| ``"dashed"`` \| ``"dashdot"`` \| ``"none"`` ; `traceWidth`: `number` ; `markerColour`: `string` ; `markerStyle`: ``"circle"`` \| ``"plus"`` \| ``"cross"`` \| ``"arrow"`` \| ``"none"`` ; `markerSize`: `number` ; `visibility`: `boolean`  }\>

#### Defined in

[plotting/Trace.ts:6](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Trace.ts#L6)

___

### FigureOptions

Ƭ **FigureOptions**: `Partial`<{ `plot`: [`PlotOptions`](plotting.md#plotoptions)  }\>

#### Defined in

[plotting/Figure.ts:4](https://github.com/lachlandk/pulsar/blob/1aa1d27/src/plotting/Figure.ts#L4)
