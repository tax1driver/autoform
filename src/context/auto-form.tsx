import { createContext, ReactNode } from "react";
import { ComponentSet } from "../types/component-set";
import { FieldMap } from "../types/field";

export interface AutoFormContext {
    resolver: (schema: any) => FieldMap,
    componentSet: ComponentSet
};

export const AutoFormContext = createContext<AutoFormContext>({} as any);

export function AutoFormProvider({ 
    resolver, 
    componentSet, 
    children
}: {
    resolver: (schema: any) => FieldMap,
    componentSet: ComponentSet,
    children: ReactNode
}) {
    return (
        <AutoFormContext.Provider value={{ resolver, componentSet }}>
            {children}
        </AutoFormContext.Provider>
    )
}