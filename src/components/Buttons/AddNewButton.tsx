import { cx } from "@/utils/helpers";
import Plus from "../Icons/Plus";
import Button from "./Button";

const AddNewVideoButton = ({ variant }: { variant: string }) => {
  let URL = "/";
  if (variant === "vidoe") URL = "/profile/edit";

  return (
    <Button
      variant="primary"
      size="xl"
      className="flex justify-center rounded-lg"
      href={URL}
    >
      <Plus className={cx([`mr-2 h-5 w-5 shrink-0`])} />
      New {`${variant.at(0)?.toUpperCase()}${variant.slice(1)}`}
    </Button>
  );
};

export default AddNewVideoButton;
