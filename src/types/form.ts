import { ComponentSet } from "./component-set";
import { FieldMap, FieldType } from "./field";

export interface FormContextValues {
    fields: FieldMap,
    componentSet: ComponentSet,
}

interface FormContextFunctions {
    setField: (name: string, field: FieldType) => void,
    getField: (name: string) => FieldType
}

export type FormContextType = FormContextValues & FormContextFunctions;
export type FieldContextType = {
    name: string
};