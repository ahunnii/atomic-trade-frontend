"use client";

import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { cn } from "~/lib/utils";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { NumericInput } from "../ui/custom/numeric-input";

type Props = {
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputId?: string;
  inputClassName?: string;
  defaultValue?: number;
};

export const QuantityNumberInput = ({
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
}: Props) => {
  const [value, setValue] = useState(defaultValue ?? 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (!!onChange) {
      onChange(newValue);
    }
  };

  const handleMinus = () => {
    setValue(value - 1);
    if (!!onChange) {
      onChange(value - 1);
    }
  };

  const handlePlus = () => {
    setValue(value + 1);
    if (!!onChange) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center overflow-hidden rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={handleMinus}
        className="h-8 w-8 rounded-none border-r text-xs"
        disabled={value <= 0 || disabled}
      >
        <Minus size={16} />
      </Button>
      <NumericInput
        type="numeric"
        disabled={disabled}
        placeholder={placeholder ?? ""}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        id={inputId}
        value={value}
        maxDecimals={0}
        min={0}
        max={99}
        className={cn(
          inputClassName,
          "h-8 w-12 rounded-none border-none text-center text-xs focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={handlePlus}
        className="h-8 w-8 rounded-none border-l text-xs"
        disabled={value >= 99 || disabled}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
};
