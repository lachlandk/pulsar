import { propertyDefaults, propertyDefaultsType } from "../core/index.js";

type indexableObject = {[name: string]: any};

export function setupProperties(instance: indexableObject, prototype: keyof propertyDefaultsType, options: indexableObject) {
    const propertySet = propertyDefaults[prototype];
    for (const key of Object.keys(propertySet) as string[]) {
        const propertyDefault = propertySet[key];
        const optionProvided = Object.keys(options).includes(key);
        const args: [indexableObject, string, string, unknown] = [instance, key, propertyDefault.type, undefined];
        if (propertyDefault.multi) {
            args.push(...(optionProvided ? (Array.isArray(options[key]) ? options[key] : [options[key]]) : propertyDefault.value));
        } else {
            args.push(optionProvided ? options[key] : propertyDefault.value);
        }
        if (propertyDefault.extra) {
            args.push(propertyDefault.extra);
        }
        propertySetters[propertyDefault.setter](...args);
    }
}

export const propertySetters = {
    setAxesProperty(instance: indexableObject, property: string, expectedType: string, ...values: unknown[]) {
        if (values.length === 1 && typeof values[0] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[0]
            };
        } else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[1]
            };
        } else {
            throw `Error setting axes property ${property}: Unexpected value ${values}.`;
        }
    },
    setSingleProperty(instance: indexableObject, property: string, expectedType: string, value: unknown) {
        if (typeof value === expectedType) {
            instance.properties[property] = value;
        } else {
            throw `Error setting single property ${property}: Unexpected type "${value}".`;
        }
    },
    setArrayProperty(instance: indexableObject, property: string, expectedType: string, values: unknown, length?: number) {
        if (!Array.isArray(values)) {
            throw `Error setting array property ${property}: "${values}" is not an array.`;
        } else if (values.length !== length) {
            throw `Error setting array property ${property}: "${values}" is not of length ${length}`;
        } else {
            for (const value of values) {
                if (typeof value !== expectedType) {
                    throw `Error setting array property ${property}: "Unexpected type "${value}" in array.`;
                }
            }
            instance.properties[property] = values;
        }
    },
    setChoiceProperty(instance: indexableObject, property: string, expectedType: string, value: unknown, choices?: unknown[]) {
        if (typeof value === expectedType) {
            let validChoice = false;
            for (const choice of choices!) {
                if (value === choice) {
                    instance.properties[property] = value;
                    validChoice = true;
                }
            }
            if (!validChoice) {
                throw `Error setting choice property ${property}: Invalid choice "${value}".`;
            }
        } else {
            throw `Error setting choice property ${property}: Unexpected type "${value}".`;
        }
    },
    setPlotDataProperty(instance: indexableObject, trace: string, property: string, value: unknown) {
        const propertySet = propertyDefaults["ResponsivePlot2DTrace"];
        const propertyDefault = propertySet[property as keyof typeof propertySet];
        if (typeof instance.plotData[trace] !== "undefined") {
            const args: [indexableObject, string, string, unknown] = [instance.plotData[trace], property, propertyDefault.type, value];
            if (propertyDefault.extra) {
                args.push(propertyDefault.extra);
            }
            propertySetters[propertyDefault.setter](...args);
        } else {
            throw `Error setting plotData property ${property}: Invalid trace ID "${trace}"`;
        }
    }
}
