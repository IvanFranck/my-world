import { InputHTMLAttributes } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { LucideProps } from "lucide-react";
import { FormField, inputVariants } from "../FormField";
import { cn } from "@/src/core/lib/utils";
import { Input } from "../../ui/input";
import { cva, VariantProps } from "class-variance-authority";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  BeforeIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  beforeIconClassName?: string;
  AfterIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  afterIconClassName?: string;
  inputClassName?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  BeforeIcon,
  beforeIconClassName,
  AfterIcon,
  afterIconClassName,
  inputClassName,
  isRequired,
  rules,
  variant,
  ...props
}: FormInputProps<TFieldValues, TName> & VariantProps<typeof inputVariants>) {
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
            {BeforeIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BeforeIcon
                  className={cn("size-5 text-slate-400", beforeIconClassName)}
                />
              </div>
            )}
            <Input
              {...field}
              {...props}
              className={cn(
                inputVariants({ variant }),
                BeforeIcon && "pl-10",
                AfterIcon && "pr-10",
                inputClassName,
              )}
            />
            {AfterIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <AfterIcon
                  className={cn("size-4 text-slate-400", afterIconClassName)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </FormField>
  );
}
