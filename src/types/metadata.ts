import { ReactNode } from "react";
import { type InputType } from "./input";
import { InputBehavior } from "./field";

export interface FieldMetadataGeneric {
    name?: string | ReactNode,
    description?: string | ReactNode,
    placeholder?: string,
    defaultValue?: any,
    as?: InputType,
    submitBehavior?: InputBehavior,
    errorBehavior?: InputBehavior,
    classNames?: Record<string, string>,
    order?: number,
    hidden?: boolean | ((values: any) => Promise<boolean> | boolean),
    disabled?: boolean | ((values: any) => Promise<boolean> | boolean),
    tags?: string,
}