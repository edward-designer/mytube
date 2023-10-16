import Image from "next/image";

export function Thumbnail({
  thumbnailUrl,
  description = "thumbnail image",
  priority = false,
}: {
  thumbnailUrl: string;
  description?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative inset-0 h-0 w-full pb-[50%]">
      <Image
        src={thumbnailUrl || "/background.jpg"}
        alt={description}
        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 40vw, (max-width: 1035px) 30vw, 23vw"
        fill
        className="absolute inset-0 left-0 top-0 h-full w-full rounded-2xl object-cover"
        priority={priority}
      />
    </div>
  );
}
