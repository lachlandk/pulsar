import { propertySetters } from "../helpers/propertySetters.js";
export declare const propertyDefaults: {
    [prototype: string]: {
        [property: string]: {
            value: unknown;
            type: "string" | "number" | "boolean";
            setter: keyof typeof propertySetters;
            multi?: boolean;
            extra?: unknown;
        };
    };
};
