import ReactLoading from "react-loading";

const LoadingMessage = ({
  height = 100,
  width = 100,
}: {
  height?: number;
  width?: number;
}) => {
  return (
    <div className="max-w-screen relative flex min-h-full w-full flex-col items-center justify-center gap-4 text-center">
      <ReactLoading
        type={"spinningBubbles"}
        color={"#11999E"}
        height={height}
        width={width}
      />
      <h1 className="sr-only text-lg font-semibold text-gray-500">
        Loading...
      </h1>
    </div>
  );
};

export default LoadingMessage;
