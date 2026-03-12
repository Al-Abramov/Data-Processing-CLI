export const checkIsArgument = (arg) => {
    return arg.startsWith('--') && arg[2] !== '-';
}

export const argParser = (args) => {
    const result = {
        value: null,
        arg: {}
    };

    for (let i = 0; i < args.length; i++) {
        const value = args[i];
        const nextValue = args[i + 1];
        const isArgument = checkIsArgument(value);
        const isNextValueArgument = !!nextValue && checkIsArgument(nextValue);
        const name = value.slice(2);

        if (!i && !isArgument) {
            result.value = value;
            continue;
        }

        if (isArgument && (!isNextValueArgument && nextValue)) {
            result.arg[name] = nextValue;
            i++;
            continue;
        }

        if (isArgument && (isNextValueArgument || !nextValue)) {
            result.arg[name] = true;
            continue;
        }
    }

    return result;
}