import { z, ZodType } from "zod";
import { FieldMap, FieldMetadata, InputType } from "autoform";

declare module 'zod' {
    interface ZodType {
        getMeta(): Record<string, any>,
        meta(meta: Record<string, any>): this
    }
}

ZodType.prototype.getMeta = function () {
    return this._def.meta
}

ZodType.prototype.meta = function (meta: Record<string, any>) {
    const This = (this as any).constructor
    return new This({
        ...this._def,
        meta,
    });
}

function parseZodField(field: z.ZodType, name: string): any {
    const meta = (field.getMeta() || { name }) as FieldMetadata;
    let type: InputType = "none";
    let defaultValue: any = null;

    if (field instanceof z.ZodObject) {
        type = "object";
    } else if (field instanceof z.ZodBoolean) {
        type = "checkbox";
        defaultValue = false;
    } else if (field instanceof z.ZodString) {
        type = "text";
        defaultValue = "";
    } else if (field instanceof z.ZodUnion) {
        const options: any[] = field.options;
        const isStringUnion = options.findIndex((v) => typeof (v.value) !== "string") === -1;

        if (isStringUnion) {
            if (!meta.options) {
                meta.options = (options as z.ZodLiteral<string>[]).map((value) => {
                    return {
                        value: value.value,
                        label: value.value
                    }
                });
            }

            type = "select";
        }

        defaultValue = null;
    } else if (field instanceof z.ZodArray) {
        if (typeof (field.element) === "string") {
            type = "multiselect";
        } else {
            type = "array";
        }
    } else if (field instanceof z.ZodDate) {
        type = "date";
        defaultValue = "null";
    } else if (field instanceof z.ZodOptional) {
        return parseZodField(field.unwrap().meta(meta), name);
    } else if (field instanceof z.ZodNumber) {
        type = "number";
        defaultValue = 10;
    }

    if (meta.as) type = meta.as;

    return {
        type,
        meta: {
            name,
            defaultValue,
            ...meta
        }
    };
}

export function zodProvider(schema: any) {
    if (!(schema instanceof z.ZodObject)) throw new Error("schema is not a zod object");
    const fieldMap: FieldMap = new Map();

    for (const fieldName in schema.shape) {
        const field = schema.shape[fieldName];
        if (field instanceof z.ZodObject) {
            const childFieldMap = zodProvider(field);

            const parsedField = parseZodField(field, fieldName);
            fieldMap.set(fieldName, {
                ...parsedField,
                children: childFieldMap
            });
            continue;
        }

        const parsedField = parseZodField(field, fieldName);
        fieldMap.set(fieldName, parsedField);
    }

    return fieldMap;
}