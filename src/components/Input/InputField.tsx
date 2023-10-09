import { useState } from "react";

interface InputFieldProps {
  name: string;
  initialValue?: string;
  placeholder?: string;
  validation?: "email";
  tag?: "textarea" | "input";
}

const InputField = ({
  initialValue = "",
  placeholder = "",
  name,
  validation,
  tag = "input",
}: InputFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const Tag = tag;
  return (
    <div className="mb-3 mt-1 flex w-full flex-row flex-wrap items-center gap-4">
      <label className="basis-[120px] font-semibold" htmlFor={name}>
        {`${name.at(0)?.toUpperCase()}${name.slice(1)}`}:
      </label>
      <Tag
        type={validation ? validation : "text"}
        className="min-w-[260px] flex-1 rounded-md border border-gray-300"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
      />
    </div>
  );
};

export default InputField;
