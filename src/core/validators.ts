type argTypes = "boolean" | "string" | "number"

export function validateAxesPropertyArgs<T>(values: T[], argType: argTypes, propName: string) {
    if (values.length === 1 && typeof values[0] === argType) {
        return {
            x: values[0],
            y: values[0]
        }
    } else if (values.length === 2 && typeof values[0] === argType && typeof values[1] === argType) {
        return {
            x: values[0],
            y: values[1]
        }
    } else {
        throw `Error settings axes property ${propName}: Unexpected value ${values}.`;
    }
}

export function validatePropertyArg<T>(value: T, argType: argTypes, propName: string) {
    if (typeof value === argType) {
        return value;
    } else {
        throw `Error setting property ${propName}: Unexpected type "${value}".`;
    }
}

export function validateArrayPropertyArgs<T>(values: T[], argType: argTypes, length: number, propName: string) {
    if (!Array.isArray(values)) {
        throw `Error setting array property ${propName}: "${values}" is not an array.`;
    } else if (values.length !== length) {
        throw `Error setting array property ${propName}: "${values}" is not of length ${length}`;
    } else {
        for (const value of values) {
            if (typeof value !== argType) {
                throw `Error setting array property ${propName}: "Unexpected type "${value}" in array.`;
            }
        }
        return values;
    }
}

export function validateChoicePropertyArg<T>(value: T, choices: T[], propName: string) {
    for (const choice of choices) {
        if (value === choice) {
            return value;
        }
    }
    throw `Error setting choice property ${propName}: Invalid choice "${value}".`;
}
