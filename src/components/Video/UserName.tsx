export const UserName = ({ name }: { name: string }) => {
  return (
    <p className=" max-h-6 overflow-hidden text-left text-sm font-semibold leading-6 text-gray-900">
      {name}
    </p>
  );
};
