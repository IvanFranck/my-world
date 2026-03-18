import { InputHTMLAttributes, useState } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { Eye, EyeOff, LucideProps } from "lucide-react";
import { FormField, inputVariants } from "../FormField";
import { cn } from "@/src/core/lib/utils";
import { Input } from "../../ui/input";
import { VariantProps } from "class-variance-authority";

interface FormPasswordProps<
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
  inputClassName?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<TFieldValues, TName>;
}

export function FormPassword<
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
  inputClassName,
  isRequired,
  rules,
  variant,
  ...props
}: FormPasswordProps<TFieldValues, TName> &
  VariantProps<typeof inputVariants>) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    if (props.disabled) return;
    setShowPassword(!showPassword);
  };
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
                  className={cn("size-4 text-slate-400", beforeIconClassName)}
                />
              </div>
            )}
            <Input
              {...field}
              {...props}
              className={cn(
                inputVariants({ variant }),
                inputClassName,
                BeforeIcon && "pl-10",
              )}
              type={showPassword ? "text" : "password"}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-slate-400" />
              ) : (
                <Eye className="size-4 text-slate-400" />
              )}
            </div>
          </div>
        </div>
      )}
    </FormField>
  );
}
