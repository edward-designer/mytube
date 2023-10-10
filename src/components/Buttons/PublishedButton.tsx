import { api } from "@/utils/api";
import React, { useId, useState } from "react";

const PublishedButton = ({
  videoId,
  isPublished,
  refetch,
}: {
  videoId: string;
  isPublished: boolean;
  refetch: () => Promise<unknown>;
}) => {
  const UUID = useId();
  const [hasPublished, setHasPublished] = useState(isPublished);
  const togglePublishedMutation = api.video.updateVideoById.useMutation();
  const handleChange = () =>
    togglePublishedMutation.mutate(
      { id: videoId, publish: !isPublished },
      {
        onSuccess: () => {
          void refetch();
          void setHasPublished(!hasPublished);
        },
      },
    );

  if (!videoId) return;
  return (
    <div className="justify-left relative flex scale-75 items-center ">
      <label htmlFor={UUID} className="sr-only">
        Has Published?
      </label>
      <input
        name={UUID}
        id={UUID}
        type="checkbox"
        checked={hasPublished}
        onChange={handleChange}
        className="h-8 w-14 rounded-full border-none"
      />
      <div
        aria-hidden={true}
        className="pointer-events-none absolute z-10 h-8 w-14 rounded-full border border-slate-300 bg-white"
      >
        <div
          className={`h-8 w-8 rounded-full border-white transition-all ${
            hasPublished
              ? "translate-x-6 bg-primary-700"
              : "translate-x-0 bg-slate-300"
          } `}
        />
      </div>
    </div>
  );
};

export default PublishedButton;
