import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FormProvider, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form";
import { FieldMap, FieldRenderParentComponent, FieldType, FieldComponent, FieldRenderComponent } from "./types/field";
import { FieldContextType, FormContextValues } from "./types/form";
import { FormContext } from "./context/form";
import { AutoFormContext } from "./context/auto-form";

function useFormContext() {
    const context = useContext(FormContext);

    if (!context) throw new Error("FormContext does not exist");
    return context;
}

function ObjectFields({ form, fields, fieldName = null }: { form: UseFormReturn<any>, fields: FieldMap, fieldName?: string | null }) {
    const { componentSet } = useFormContext();
    const prefix = fieldName ? `${fieldName}.` : "";

    return (
        <>
            {Array.from(fields).map(([name, field], i) => {
                if (field.type === "object") {
                    if (!field.children) throw new Error(`invalid field object`);

                    const RenderFieldParentComponent = ((field.render && field.render.field) ? field.render.field : componentSet['object']) as FieldRenderParentComponent;

                    if (!RenderFieldParentComponent) throw new Error(`components not defined for ${prefix}${name}`);

                    return (
                        <RenderFieldParentComponent key={`${prefix}${name}`} form={form} meta={field.meta}>
                            <ObjectFields form={form} fields={field.children} fieldName={name} />
                        </RenderFieldParentComponent>
                    )
                } else if (field.type === "none") return <></>;

                const RenderFieldComponent = (field.render && field.render.field) ? field.render.field : (componentSet[`${field.type}_field`] ? componentSet[`${field.type}_field`] : componentSet.field);
                const RenderControlComponent = (field.render && field.render.control) ? field.render.control : componentSet[field.type];

                    if (!RenderFieldComponent || !RenderControlComponent) throw new Error(`components not defined for ${prefix}${name}`);

                return (
                    <RenderFieldComponent key={`${prefix}${name}`} form={form} name={`${prefix}${name}`} meta={field.meta} render={RenderControlComponent} />
                );
            })}
        </>
    )
}


export function AutoForm({ form, schema, className, children, onSubmit, onInvalid }: {
    form: UseFormReturn<any>,
    schema: any,
    className?: string,
    children?: ReactNode,
    onSubmit?: SubmitHandler<any>,
    onInvalid?: SubmitErrorHandler<any>
}) {
    const autoFormContext = useContext(AutoFormContext);
    if (!autoFormContext) throw new Error("AutoFormContext does not exist");

    const { resolver, componentSet } = autoFormContext;

    const [context, setContext] = useState<FormContextValues>({
        fields: resolver(schema),
        componentSet: componentSet
    });


    useEffect(() => {
        setContext({
            fields: resolver(schema),
            componentSet: componentSet
        });
    }, [schema, componentSet]);

    const setField = (name: string, field: FieldType) => {
        function modify(obj: any, newObj: any) {

            Object.keys(obj).forEach(function (key) {
                delete obj[key];
            });

            Object.keys(newObj).forEach(function (key) {
                obj[key] = newObj[key];
            });

        }

        const path = name.split(".");
        const newFields = new Map(context.fields);
        let currentChild: Partial<FieldType> = { children: newFields };

        while (true) {
            if (path.length === 0) {
                modify(currentChild, field);
                break;
            }

            if (!currentChild.children) throw new Error("setField: Invalid path");

            const f = currentChild.children.get(path[0]);
            if (!f) throw new Error("setField: Field was not found");

            currentChild = f;
            path.splice(0, 1);
        }

        setContext({
            ...context,
            fields: newFields
        });
    }

    const getField = (name: string) => {
        const path = name.split(".");
        const newFields = new Map(context.fields);
        let currentChild: Partial<FieldType> = { children: newFields };

        while (true) {
            if (path.length === 0) {
                return currentChild as FieldType;
            }

            if (!currentChild.children) throw new Error("setField: Invalid path");

            const f = currentChild.children.get(path[0]);
            if (!f) throw new Error("setField: Field was not found");

            currentChild = f;
            path.splice(0, 1);
        }
    }

    return (
        <FormContext.Provider value={{ ...context, setField, getField }}>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit ? onSubmit : () => { }, onInvalid)} className={className}>
                    {context.componentSet.form && (
                        <context.componentSet.form form={form} meta={{}}>
                            <ObjectFields form={form} fields={context.fields} />
                        </context.componentSet.form>
                    )}
                    {children}
                </form>
            </FormProvider>
        </FormContext.Provider>
    )
}

const FieldContext = createContext<FieldContextType>({} as any);

export function OverrideField({ name, children }: { name: string, children: ReactNode }) {
    return (
        <FieldContext.Provider value={{ name: name }}>
            {children}
        </FieldContext.Provider>
    )
}


export function Control({ render }: { render: FieldRenderComponent }) {
    const formContext = useFormContext();
    const { name } = useContext(FieldContext);

    useEffect(() => {
        if (render) {
            const field = formContext.getField(name);
            const renderers = field.render ? field.render : {};

            if (renderers.control === render) return;

            formContext.setField(name, {
                ...formContext.getField(name),
                render: {
                    ...renderers,
                    control: render
                }
            })
        }
    }, [render, name]);

    return null;
}

export function Field({ render }: { render: FieldComponent }) {
    const formContext = useFormContext();
    const { name } = useContext(FieldContext);

    useEffect(() => {
        if (render) {
            const field = formContext.getField(name);
            const renderers = field.render ? field.render : {};

            if (renderers.field === render) return;

            formContext.setField(name, {
                ...formContext.getField(name),
                render: {
                    ...renderers,
                    field: render
                }
            })
        }
    }, [render, name]);

    return null;
}


