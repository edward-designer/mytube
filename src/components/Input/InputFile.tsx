import { Upload } from "../Icons/Icons";
import LoadingMessage from "../Loading/Loading";

interface InputFileProps {
  name: string;
  uploadHandler: (file: File | undefined) => void;
  isUploading: boolean;
}

const InputFile = ({ name, uploadHandler, isUploading }: InputFileProps) => {
  return (
    <form className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 ">
      {isUploading ? (
        <LoadingMessage height={60} width={60} />
      ) : (
        <>
          <label
            htmlFor={name}
            className="group block cursor-pointer rounded-full bg-white/60 p-4 shadow-md hover:bg-white"
          >
            <span className="sr-only">Upload {name}</span>
            <Upload className="h-12 w-12 group-hover:animate-bounce" />
          </label>
          <input
            type="file"
            className="hidden"
            id={name}
            name={name}
            onChange={(e) => uploadHandler(e.target.files?.[0])}
          />
        </>
      )}
    </form>
  );
};

export default InputFile;
