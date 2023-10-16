import moment from "moment";

export const VideoInfo = ({
  views,
  createdAt,
}: {
  createdAt: Date | string;
  views: number;
}) => {
  return (
    <div className="relative mt-1 flex max-h-6 items-start overflow-hidden text-sm">
      <p className=" text-gray-600">
        {views}
        <span> Views</span>
      </p>
      <span
        aria-hidden={true}
        className="mx-2 mt-2 inline-block h-1 w-1 rounded-full bg-gray-500"
      ></span>
      <p className=" text-gray-600">{moment(createdAt).fromNow()}</p>
    </div>
  );
};
