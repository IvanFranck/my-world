import { TextareaHTMLAttributes } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { FormField } from "../FormField";
import { cn } from "@/src/core/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Textarea } from "../../ui/textarea";

export const textareaVariants = cva(
  "py-5.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nest-red focus:border-transparent transition-all",
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

interface FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  rows?: number;
  inputClassName?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  rows,
  inputClassName,
  isRequired,
  rules,
  variant,
  ...props
}: FormTextAreaProps<TFieldValues, TName> &
  VariantProps<typeof textareaVariants>) {
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
      {(field) => (
        <div className="relative">
          <div className="flex flex-row">
            <Textarea
              {...field}
              {...props}
              className={cn(textareaVariants({ variant }), inputClassName)}
              rows={rows || 5}
            />
          </div>
        </div>
      )}
    </FormField>
  );
}
