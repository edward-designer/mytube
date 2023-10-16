export const VideoTitle = ({
  title,
  limitHeight,
  limitSize,
}: {
  title: string;
  limitHeight?: boolean;
  limitSize?: boolean;
}) => {
  return (
    <h1
      className={`font-semibold leading-4 text-gray-900 group-hover:text-gray-600 lg:leading-6 ${
        limitSize ? "text-base" : "text-base lg:text-lg"
      } ${
        limitHeight
          ? "line-clamp-2 max-h-12 w-full max-w-md overflow-hidden"
          : ""
      }`}
    >
      {title}
    </h1>
  );
};
