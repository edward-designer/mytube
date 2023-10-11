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
            className="group flex aspect-square cursor-pointer flex-col rounded-full bg-white/60 p-4 shadow-md focus-within:outline-none focus-within:ring-4 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:bg-white hover:text-primary-600 "
          >
            <Upload
              className="h-8 group-hover:animate-bounce"
              aria-hidden={true}
            />
            <span className="text-md">Upload</span>
            <span className="sr-only"> {name}</span>
            <input
              type="file"
              className="sr-only"
              id={name}
              name={name}
              onChange={(e) => uploadHandler(e.target.files?.[0])}
              accept="image/*"
            />
          </label>
        </>
      )}
    </form>
  );
};

export default InputFile;
