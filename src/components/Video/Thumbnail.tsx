import Image from "next/image";

export function Thumbnail({
  thumbnailUrl,
  priority = false,
}: {
  thumbnailUrl: string;
  priority?: boolean;
}) {
  return (
    <div className="relative inset-0 h-0 w-full pb-[50%]">
      <Image
        src={thumbnailUrl || "/background.jpg"}
        alt="Alternative"
        width="400"
        height="200"
        className="absolute inset-0 left-0 top-0 h-full w-full rounded-2xl object-cover"
        priority={priority}
      />
    </div>
  );
}
