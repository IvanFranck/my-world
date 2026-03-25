import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { FormField } from "../FormField";
import { cn } from "@/src/core/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const selectVariants = cva(
  "h-primary w-full pr-3 py-5.5  border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all",
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

export type FormSelectOption<T> = {
  value: T;
  label: string;
  disable?: boolean;
};

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  defaultValue?: string;
  contentClassName?: string;
  options: FormSelectOption<string>[];
  size?: "sm" | "default" | "primary";
  triggerClassName?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
  onChange?: (value: string) => void;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  placeholder,
  defaultValue,
  size,
  options,
  triggerClassName,
  contentClassName,
  isRequired,
  isLoading,
  rules,
  variant,
  onChange,
  ...props
}: FormSelectProps<TFieldValues, TName> & VariantProps<typeof selectVariants>) {
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      className={className}
      labelClassName={labelClassName}
      isRequired={isRequired}
      rules={rules}
    >
      {(field) => {
        const validValue =
          options.find((option) => option.value === field.value)?.value ||
          "all";
        return (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            defaultValue={defaultValue}
            value={validValue}
          >
            <SelectTrigger
              size={size}
              className={cn(selectVariants({ variant }), triggerClassName)}
              value={defaultValue}
            >
              {isLoading ? (
                <SelectValue placeholder="chargement..." />
              ) : (
                <SelectValue placeholder={placeholder} />
              )}
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              {options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option.value}
                  disabled={option.disable}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormField>
  );
}
