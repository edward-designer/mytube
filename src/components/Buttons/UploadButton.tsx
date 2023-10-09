import Upload from "@/components/Icons/Upload";
import Button from "./Button";

const UploadButton = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Button
        onClick={() => {
          console.log("");
        }}
        className="h-12 w-12 bg-white/70"
        variant="secondary-white"
      >
        <Upload />
        <span className="sr-only">Upload</span>
      </Button>
    </div>
  );
};

export default UploadButton;
