import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import {
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { cn } from "@/src/core/lib/utils";
import { cva } from "class-variance-authority";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  descriptionClassName?: string;
  descriptionPosition?: "top" | "bottom";
  className?: string;
  labelClassName?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  children: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
}

export const inputVariants = cva(
  "block w-full pl-10 pr-3 py-5.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all",
  {
    variants: {
      variant: {
        default: "rounded-lg !text-base",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  descriptionClassName,
  descriptionPosition = "top",
  className,
  labelClassName,
  isRequired,
  rules,
  children,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <ShadcnFormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && label.trim() !== "" && (
            <FormLabel className={cn(labelClassName)}>
              {label}
              {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          {description &&
            description.trim() !== "" &&
            descriptionPosition === "top" && (
              <FormDescription className={cn(descriptionClassName)}>
                {description}
              </FormDescription>
            )}
          <FormControl>{children(field)}</FormControl>
          {description &&
            description.trim() !== "" &&
            descriptionPosition === "bottom" && (
              <FormDescription className={cn(descriptionClassName)}>
                {description}
              </FormDescription>
            )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
