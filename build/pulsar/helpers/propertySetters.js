import { propertyDefaults } from "../core/defaults.js";
export function setupProperties(instance, prototype, options) {
    const propertySet = propertyDefaults[prototype];
    for (const key of Object.keys(propertySet)) {
        const propertyDefault = propertySet[key];
        const optionProvided = Object.keys(options).includes(key);
        const args = [instance, key, propertyDefault.type];
        if (propertyDefault.multi) {
            args.push(...(optionProvided ? (Array.isArray(options[key]) ? options[key] : [options[key]]) : propertyDefault.value));
        }
        else {
            args.push(optionProvided ? options[key] : propertyDefault.value);
        }
        if (propertyDefault.extra) {
            args.push(propertyDefault.extra);
        }
        propertySetters[propertyDefault.setter](...args);
    }
}
export const propertySetters = {
    setAxesProperty(instance, property, expectedType, ...values) {
        if (values.length === 1 && typeof values[0] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[0]
            };
        }
        else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[1]
            };
        }
        else {
            throw `Error setting axes property ${property}: Unexpected value ${values}.`;
        }
    },
    setSingleProperty(instance, property, expectedType, value) {
        if (typeof value === expectedType) {
            instance.properties[property] = value;
        }
        else {
            throw `Error setting single property ${property}: Unexpected type "${value}".`;
        }
    },
    setArrayProperty(instance, property, expectedType, values, length) {
        if (!Array.isArray(values)) {
            throw `Error setting array property ${property}: "${values}" is not an array.`;
        }
        else if (values.length !== length) {
            throw `Error setting array property ${property}: "${values}" is not of length ${length}`;
        }
        else {
            for (const value of values) {
                if (typeof value !== expectedType) {
                    throw `Error setting array property ${property}: "Unexpected type "${value}" in array.`;
                }
            }
            instance.properties[property] = values;
        }
    },
    setChoiceProperty(instance, property, expectedType, value, choices) {
        if (typeof value === expectedType) {
            let validChoice = false;
            for (const choice of choices) {
                if (value === choice) {
                    instance.properties[property] = value;
                    validChoice = true;
                }
            }
            if (!validChoice) {
                throw `Error setting choice property ${property}: Invalid choice "${value}".`;
            }
        }
        else {
            throw `Error setting choice property ${property}: Unexpected type "${value}".`;
        }
    }
};
