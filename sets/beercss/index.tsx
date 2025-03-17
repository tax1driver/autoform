export const BeerCssComponentSet: ComponentSet = {
    field: ({ form, name, meta, render }) => (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <div className="flex flex-col gap-1">
                    <label htmlFor={name} className="font-semibold">{meta.name}</label>
                    {render({ form, meta, field })}
                    {meta.description && <span className="text-xs">{meta.description}</span>}
                </div>
            )}
        />
    ),
    form: ({ meta, children }) => (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{meta.name}</span>
                {meta.description && <span className="text-sm text-muted-foreground">{meta.description}</span>}
            </div>
            {children}
        </div>
    ),
    object: ({ meta, children }) => (
        <div className="flex flex-col gap-1">
            <span className="font-semibold">{meta.name}</span>
            {meta.description && <span className="text-sm text-muted-foreground">{meta.description}</span>}
            {children}
        </div>
    ),
    text: ({ field, meta }) => (
        <input
            type="text"
            id={field.name}
            placeholder={meta.placeholder ?? ""}
            className="border border-gray-300 rounded-md p-2"
            {...field}
        />
    ),
    password: ({ field, meta }) => (
        <input
            type="password"
            id={field.name}
            placeholder={meta.placeholder ?? ""}
            className="border border-gray-300 rounded-md p-2"
            {...field}
        />
    ),
    number: ({ field, meta }) => (
        <input
            type="number"
            id={field.name}
            placeholder={meta.placeholder ?? ""}
            className="border border-gray-300 rounded-md p-2"
            {...field}
        />
    ),
    select_field: ({ form, name, meta, render }) => {
        return (
            <div className="flex flex-col gap-1">
                <label htmlFor={name} className="font-semibold">{meta.name}</label>
                {render({ form, meta, field: form.control.get(name) })}
                {meta.description && <span className="text-sm text-muted-foreground">{meta.description}</span>}
            </div>
        );
    },

}
