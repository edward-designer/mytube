import Edit from "../Icons/Edit";
import Button from "./Button";

const EditButton = ({ videoId }: { videoId: string }) => {
  return (
    <>
      <Button
        href={`/video/${videoId}/edit`}
        variant="secondary-gray"
        className="h-8 w-8"
      >
        <Edit className=" stroke-primary-700" />
        <span className="sr-only">Edit Video</span>
      </Button>
    </>
  );
};

export default EditButton;
