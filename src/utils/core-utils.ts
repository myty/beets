import { BorderPropsOptions } from "interfaces/border-props-options";
import { BorderProps } from "interfaces/border-props";
import { RequiredOrUndefined } from "types/required-or-undefined";
import * as uuid from "uuid";
import { List } from "immutable";

const getBorderYProps = (options: BorderPropsOptions): BorderProps => {
    const { isFirst = false, isLast = false, borderRadius } = options;
    let borderProps: BorderProps = {};
    if (isFirst) {
        borderProps = {
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
        };
    }

    if (isLast && !isFirst) {
        borderProps = {
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
        };
    }

    return borderProps;
};

const getBorderXProps = (options: BorderPropsOptions): BorderProps => {
    const { isFirst = false, isLast = false, borderRadius } = options;
    let borderProps: BorderProps = {};
    if (isFirst) {
        borderProps = {
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        };
    }

    if (isLast) {
        borderProps = {
            ...borderProps,
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
        };
    }

    return borderProps;
};

const getTemporaryId = (): string => `temp-${uuid.v4()}`;

const isNilOrEmpty = <T = string | any[] | List<any>>(
    value: T | any[] | List<any> | null | undefined
): value is null | undefined => {
    if (typeof value === "string") {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (List.isList(value)) {
        return value.isEmpty();
    }

    return value == null;
};

const isTemporaryId = (value?: string): boolean =>
    !isNilOrEmpty(value) && value!.startsWith("temp-");

const makeDefaultValues = <T>(defaultValues: RequiredOrUndefined<T>): T =>
    defaultValues as T;

const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const unixTime = (date?: Date): number =>
    Math.floor((date?.getTime() ?? new Date().getTime()) / 1000);

export {
    getBorderYProps,
    getBorderXProps,
    getTemporaryId,
    isNilOrEmpty,
    isTemporaryId,
    makeDefaultValues,
    randomFloat,
    randomInt,
    unixTime,
};
