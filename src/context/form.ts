import { createContext } from "react";
import { FormContextType } from "../types/form";

export const FormContext = createContext<FormContextType>({} as any);