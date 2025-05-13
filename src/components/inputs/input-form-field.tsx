import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { cn } from "~/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

type Props<CurrentForm extends FieldValues> = {
  form: UseFormReturn<CurrentForm>;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputId?: string;
  inputClassName?: string;
  name: Path<CurrentForm>;
  defaultValue?: string;
};

export const InputFormField = <CurrentForm extends FieldValues>({
  form,
  name,
  label,
  description,
  className,
  disabled,
  placeholder,
  onChange,
  onKeyDown,
  inputId,
  inputClassName,
  defaultValue,
}: Props<CurrentForm>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("col-span-full", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              disabled={disabled}
              placeholder={placeholder ?? ""}
              {...field}
              {...(defaultValue && { value: defaultValue })}
              onChange={(e) => {
                if (!!onChange) {
                  onChange(e.target.value);
                }
                field.onChange(e.target.value);
              }}
              onKeyDown={onKeyDown}
              id={inputId}
              className={inputClassName}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
