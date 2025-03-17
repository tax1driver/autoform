import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { FieldMetadataGeneric } from "./metadata";
import { ReactNode } from "react";
import { InputType } from "./input";

export interface InputBehavior {
    clearError?: boolean,
    clearValue?: boolean,
}

export type FieldMetadata = FieldMetadataGeneric & Record<string, any>;
export type FieldComponent = (props: { form: UseFormReturn<any>, name: string, meta: FieldMetadata, render: FieldRenderComponent }) => ReactNode;
export type FieldRenderComponent = (props: { form: UseFormReturn<any>, meta: FieldMetadata, field: ControllerRenderProps<any> }) => ReactNode;
export type FieldRenderParentComponent = (props: { form: UseFormReturn<any>, meta: FieldMetadata, children?: ReactNode }) => ReactNode;

export interface FieldType {
    type: InputType,
    meta: FieldMetadata,
    render?: {
        field?: FieldComponent,
        control?: FieldRenderComponent
    },
    children?: FieldMap
}

export type FieldMap = Map<string, FieldType>;

