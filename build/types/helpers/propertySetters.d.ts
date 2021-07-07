import { propertyDefaultsType } from "../core/index.js";
declare type indexableObject = {
    [name: string]: any;
};
export declare function setupProperties(instance: indexableObject, prototype: keyof propertyDefaultsType, options: indexableObject): void;
export declare const propertySetters: {
    setAxesProperty(instance: indexableObject, property: string, expectedType: string, ...values: unknown[]): void;
    setSingleProperty(instance: indexableObject, property: string, expectedType: string, value: unknown): void;
    setArrayProperty(instance: indexableObject, property: string, expectedType: string, values: unknown, length?: number | undefined): void;
    setChoiceProperty(instance: indexableObject, property: string, expectedType: string, value: unknown, choices?: unknown[] | undefined): void;
    setPlotDataProperty(instance: indexableObject, trace: string, property: string, value: unknown): void;
};
export {};
