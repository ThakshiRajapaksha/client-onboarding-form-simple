import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={cn(
              "w-4 h-4 text-blue-600 border-gray-300 rounded",
              "focus:ring-2 focus:ring-blue-500",
              "transition-colors duration-200",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            required={required}
            {...props}
          />
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
