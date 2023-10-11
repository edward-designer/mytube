import { GreenHorn, GreenPeople, GreenPlay } from "../Icons/GreenIcons";

interface ErrorMessageProps {
  children?: React.ReactNode;
  icon?: string;
  message?: string;
  description?: string;
}

const ErrorMessage = ({
  children,
  icon,
  message,
  description,
}: ErrorMessageProps) => {
  return (
    <div className="mt-16 relative flex h-full w-full flex-col items-center justify-center gap-2 text-center">
      <IconSelection className="center items-center" icon={icon} />
      <h1 className="text-2xl font-semibold text-gray-900">{message}</h1>
      <p className="max-w-xs text-gray-600">{description}</p>
      {children}
    </div>
  );
};

export default ErrorMessage;

const IconSelection = ({
  icon,
  className,
}: {
  icon?: string;
  className: string;
}) => {
  switch (icon) {
    case "GreenHorn":
      return <GreenHorn className={className} />;
    case "GreenPeople":
      return <GreenPeople className={className} />;
    default:
      return <GreenPlay className={className} />;
  }
};
