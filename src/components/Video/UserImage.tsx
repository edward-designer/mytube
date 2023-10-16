import Image from "next/image";

export default function UserImage({
  image,
  className = "",
  priority = false,
}: {
  image: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative h-10 w-10 shrink-0 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt="Profile Picture"
        className="absolute h-full w-full rounded-full object-cover"
        width={40}
        height={40}
        priority={priority}
      />
    </div>
  );
}
