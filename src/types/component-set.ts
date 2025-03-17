import { FieldRenderComponent, FieldComponent, FieldRenderParentComponent } from "./field";
import { InputType } from "./input";

export type ComponentSet = Partial<Record<Exclude<InputType, "object">, FieldRenderComponent>> & Partial<Record<`${InputType}_field`, FieldComponent>> &
{ form?: FieldRenderParentComponent, object?: FieldRenderParentComponent, field?: FieldComponent };