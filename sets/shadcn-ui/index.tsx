import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ComponentSet } from "autoform";
import { ReactNode } from "react";
import { cn } from "./utils";
import { CalendarIcon, CheckIcon, ChevronDownSquare } from "lucide-react";
import { format } from "date-fns";

export const ShadcnComponentSet: ComponentSet = {
    field: ({ form, name, meta, render }) => (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{meta.name ?? ""}</FormLabel>
                        <FormControl>
                            {render({ form, meta, field })}
                        </FormControl>
                        {
                            meta.description && <FormDescription>{meta.description}</FormDescription>
                        }
                        <FormMessage />
                    </FormItem>
                )} />
        </>
    ),
    form: ({ meta, children }) => (
        <>
            <div className="flex flex-col gap-1">
                <span className="font-semibold">{meta.name}</span>
                {meta.description && <span className="text-sm text-muted-foreground">{meta.description}</span>}
            </div>
            {children}
        </>
    ),
    object: ({ meta, children }) => (
        <Card>
            <CardHeader>
                {meta.name && <CardTitle>{meta.name}</CardTitle>}
                {meta.description && <CardDescription>{meta.description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {children}
            </CardContent>
        </Card>
    ),
    text: ({ field, meta }) => (
        <Input placeholder={meta.placeholder ?? ""} {...field} />
    ),
    password: ({ field, meta }) => (
        <Input type="password" placeholder={meta.placeholder ?? ""} {...field} />
    ),
    number: ({ field, meta }) => (
        <Input
            placeholder={meta.placeholder ?? ""}
            type="number"
            {...field}
            onChange={(e) => field.onChange(+e?.target?.value)}
        />
    ),
    select_field: ({ form, name, meta, render }) => {
        return (
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{meta.name || name}</FormLabel>
                        {render({ form, meta, field })}
                        {
                            meta.description &&
                            <FormDescription>
                                {meta.description}
                            </FormDescription>
                        }
                        <FormMessage />
                    </FormItem>
                )} />
        );
    },
    select: ({ form, field, meta }) => {
        let options = meta.options as { value: string, label: string | ReactNode }[];

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value
                                ? options.find(
                                    (option) => option.value === field.value
                                )?.label
                                : (meta.placeholder || "Select an option")}
                            <ChevronDownSquare className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        value={option.value}
                                        key={option.value}
                                        onSelect={() => {
                                            form.setValue(field.name, option.value as any)
                                        }}
                                    >
                                        {option.label}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto size-4",
                                                option.value === field.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
    checkbox_field: ({ form, name, meta, render }) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                        {render({ form, meta, field })}
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            {meta.name}
                        </FormLabel>
                        <FormDescription>
                            {meta.description}
                        </FormDescription>
                    </div>
                </FormItem>
            )}
        />
    ),
    checkbox: ({ field, meta }) => (
        <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
        />
    ),
    date: ({ field, meta }) => {
        const datePickerProps = meta.datePickerProps || {};

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "flex min-w-[200px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value ? (
                                format(field.value, "P")
                            ) : (
                                <span>Select a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">

                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        {...datePickerProps}
                    />
                </PopoverContent>
            </Popover>
        )
    },
    textarea: ({ field, meta }) => (
        <Textarea
            placeholder={meta.placeholder || ""}
            className="resize-none"
            rows={meta.rows || undefined}
            cols={meta.cols || undefined}
            {...field}
        />
    )
}