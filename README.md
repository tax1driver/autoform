# autoform
Automatically generate form interfaces using Zod schemas & React Hook Form. This package is modular and usage with any UI library is possible. 

## Disclaimer
This project is in early WIP stage.

## Installing
```
npm install @fajerone/autoform
```

## Usage
Firstly, provide a component set to use for form generation. and `shadcnComponentSet` are pre-defined and available in the repository. However, as we would like to not force you to install additional packages, those are not included in the main package.
```tsx
import { AutoFormProvider } from "@fajerone/autoform";
import { zodProvider } from "../lib/zod-provider";
import { shadcnFormComponentSet } from "../lib/form-components";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <AutoFormProvider componentSet={shadcnFormComponentSet}>
            {children}
        </AutoFormProvider>
    )
}
```

Then, define a schema such as (Zod method uses module augmentation, read more below):
```tsx
const schema = z.object({
  str: z.string().meta({
    name: "Input some data",
    description: "A description",
    placeholder: "hello",
  }),
  anObject: z.object({
    anotherStr: z.string().meta({
      name: "Another string",
      description: "Another description",
      placeholder: "world",
    }),
    check: z.boolean().meta({
      description: "Checkbox description"
    }),
    combo: z.union([z.literal("first"), z.literal("second")]).meta({
      description: "combobox!",
      options: [
        {
          value: "first",
          label: "Option 1"
        },
        {
          value: "second",
          label: "Option 2"
        }
      ]
    })
  }).meta({
    name: "An object",
    description: "A description"
  }),   
  objectWithoutMeta: z.object({
    checkMe: z.boolean(),
    aDate: z.coerce.date()
  }),
});

```

In your component, create a `react-hook-form` form:
```ts
const form = useForm({
    resolver: zodResolver(schema)
});
```

Finally, you can render the form by doing:
```tsx
<AutoForm form={form} schema={schema} onSubmit={console.log} onInvalid={console.log}>
    <Button type="submit">submit</Button>
</AutoForm>
```

```tsx
<AutoForm 
  form={form}
  schema={schema}
  onSubmit={console.log}
  onInvalid={console.log}
  onChange={console.log}
  
>

```

which produces the following result:

![result form](https://i.imgur.com/2562No8.png)


## Additional functionality
If necessary, any of the existing fields' rendering can be overriden as follows:
```tsx
<OverrideField name="str">
    <Field render={(props) => (
        <>
            <pre>field</pre>
            {render({ meta } as any)}
        </>
    )} />
    <Control render={(props) => (
        <pre>control</pre>
    )} />
</OverrideField>
```


## Support
### Schema validation
Only Zod resolver exists at this point. If you would like to see other libraries supported as well, please open a PR.
Please note that the Zod resolver uses Module Augmentation, which defines two additional methods on the `ZodType` class: `meta`, `getMeta`.


### UI
Only shadcn-ui component set is defined at this point. If you would like to see other predefined component sets, please open a PR.
