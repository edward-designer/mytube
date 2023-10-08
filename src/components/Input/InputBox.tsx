import { useState, useRef, useEffect } from "react";
import { Button } from "../Buttons";

interface InputBoxProps {
  addHandler: ({
    message,
    successHandler,
  }: {
    message: string;
    successHandler: () => void;
  }) => void;
  refetch: () => Promise<unknown>;
  placeholderText?: string;
}

const InputBox = ({
  addHandler,
  refetch,
  placeholderText = "Input",
}: InputBoxProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const successHandler = () => {
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    void refetch();
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;

    const handleTextareeChange = (ele: HTMLTextAreaElement) => {
      ele.style.height = "auto";
      ele.style.height = `${ele.scrollHeight}px`;
    };

    textarea.addEventListener("input", () => handleTextareeChange(textarea));
    return () => {
      textarea.removeEventListener("input", () =>
        handleTextareeChange(textarea),
      );
    };
  }, []);
  return (
    <>
      <textarea
        className=" w-full resize-none rounded-lg border-none bg-gray-100 focus:ring-primary-700"
        value={value}
        rows={1}
        placeholder={placeholderText}
        onChange={(e) => setValue(e.target.value)}
        ref={textareaRef}
      />
      {value.length > 5 && (
        <Button
          className="mt-2 px-4"
          onClick={() => addHandler({ message: value, successHandler })}
        >
          Submit
        </Button>
      )}
    </>
  );
};

export default InputBox;
