import Image from "next/image";

export default function UserImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`relative h-10 w-10 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt="Profile Picture"
        className="absolute rounded-full"
        fill
      />
    </div>
  );
}
