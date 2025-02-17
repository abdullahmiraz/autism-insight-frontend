import { FC } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface SelectInputProps {
  label: string;
  name: string;
  index?: number;
  options: string[];
  register: UseFormRegister<FieldValues>;
  required?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  label,
  name,
  index,
  options,
  register,
  required,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">
        {" "}
        {(index ?? -1) >= 0 ? index! + 1 : "Q"}. {label}
      </h3>
      <div className="flex gap-8">
        {options.map((option, index) => (
          <label key={index} className="flex items-center">
            <input
              type="radio"
              {...register(name, { required: required })}
              value={option == "Yes" ? 1 : option == "No" ? 0 : option}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectInput;
