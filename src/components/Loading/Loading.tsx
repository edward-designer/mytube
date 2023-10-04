import ReactLoading from "react-loading";

const LoadingMessage = () => {
  return (
    <div className="max-w-screen relative -mt-16 flex max-h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <ReactLoading
        type={"spinningBubbles"}
        color={"#11999E"}
        height={200}
        width={200}
      />
      <h1 className="sr-only text-lg font-semibold text-gray-500">
        Loading...
      </h1>
    </div>
  );
};

export default LoadingMessage;
