import { createContext, ReactNode } from "react";
import { ComponentSet } from "../types/component-set";
import { FieldMap } from "../types/field";

export interface AutoFormContext {
    componentSet: ComponentSet
};

export const AutoFormContext = createContext<AutoFormContext>({} as any);

export function AutoFormProvider({ 
    componentSet, 
    children
}: {
    componentSet: ComponentSet,
    children: ReactNode
}) {
    return (
        <AutoFormContext.Provider value={{ componentSet }}>
            {children}
        </AutoFormContext.Provider>
    )
}