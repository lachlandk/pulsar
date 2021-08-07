import { propertyDefaults } from "../core/defaults.js";
declare type indexableObject = {
    [name: string]: any;
};
export declare function setupProperties(instance: indexableObject, prototype: keyof typeof propertyDefaults, options: indexableObject): void;
export declare const propertySetters: {
    setAxesProperty(instance: indexableObject, property: string, expectedType: string, ...values: unknown[]): void;
    setSingleProperty(instance: indexableObject, property: string, expectedType: string, value: unknown): void;
    setArrayProperty(instance: indexableObject, property: string, expectedType: string, values: unknown, length?: number | undefined): void;
    setChoiceProperty(instance: indexableObject, property: string, expectedType: string, value: unknown, choices?: unknown[] | undefined): void;
};
export {};
