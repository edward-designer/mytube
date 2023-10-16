import React, { type FormEvent, useState, useEffect, useRef } from "react";
import { api } from "@/utils/api";
import Edit from "@/components/Icons/Edit";
import { useParams } from "next/navigation";
import { assertString } from "@/utils/helpers";
import { useRouter } from "next/router";
import InputField from "@/components/Input/InputField";
import Image from "next/image";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import useImageUpload, { type VideoData } from "@/hook/useImageUpload";
import LikeButton from "@/components/Buttons/LikeButton";
import UserCard from "@/components/Video/UserCard";
import { VideoDescription } from "@/components/Video/VideoDescription";
import { VideoInfo } from "@/components/Video/VideoInfo";
import { VideoTitle } from "@/components/Video/VideoTitle";
import ReactPlayer from "react-player";
import PublishedButton from "@/components/Buttons/PublishedButton";

const EditPage = () => {
  const [saved, setSaved] = useState(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>();
  const router = useRouter();
  const params = useParams();
  const videoId = params?.videoId ?? "";
  assertString(videoId);

  const { data, isLoading, error, refetch } = api.video.getVideoById.useQuery({
    id: videoId,
  });
  const video = data?.video;
  const user = data?.user;

  const editVideoMutation = api.video.updateVideoById.useMutation();

  const handleVideoUpdateDebounced = (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      let data: VideoData = { id: videoId };
      const formData = new FormData(form) as unknown as Iterable<
        [keyof VideoData, FormDataEntryValue]
      >;

      for (const [key, value] of formData) {
        data = { ...data, [key]: value };
      }
      editVideoMutation.mutate(data, {
        onSuccess: () => {
          void refetch();
          setSaved(true);
        },
      });
    }, 500);
  };

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const [Thumbnail] = useImageUpload({
    name: "thumbnailUrl",
    id: videoId,
    refetch,
    initialFile: data?.video.thumbnailUrl ?? "",
    aspectRatio: 1280 / 720,
  });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="video" />
      </div>
    );

  return (
    <div className="flex h-full w-full flex-row flex-wrap overflow-visible">
      <div className="flex flex-1 basis-1/2 flex-col p-8">
        {Thumbnail && <Thumbnail.CropCard />}

        <div className="flex w-full content-center justify-between">
          <div className="flex flex-col justify-center">
            <h2 className="flex gap-2 text-2xl font-semibold leading-6 text-gray-900">
              <Edit className="h-6 w-6 stroke-primary-700" />
              Edit Video Details
            </h2>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {saved ? (
                  <span className="text-green-600">
                    All changes are automatically saved.
                  </span>
                ) : (
                  <span>Make changes to the video details below.</span>
                )}
              </p>
            </div>
          </div>
          <div className="my-5 sm:my-4">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>
        </div>
        <section className="flex flex-wrap content-start gap-8 lg:p-12">
          <div className="flex w-full flex-col">
            <div className="mb-3 mt-1 flex w-full flex-row flex-wrap items-center gap-4">
              <label
                className="basis-[120px] font-semibold"
                htmlFor="thumbnail"
              >
                Thumbnail:
              </label>
              <div className="relative">
                <Image
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  src={Thumbnail?.orgImage || "/background.jpg"}
                  alt="thumbnail image"
                  width={400}
                  height={500}
                  style={{ objectFit: "cover", aspectRatio: 1280 / 720 }}
                  id="thumbnail"
                />
                <p className="text-xs">
                  An image of at least 1200px * 800px is recommended.
                </p>
                {Thumbnail && <Thumbnail.UploadButton />}
              </div>
            </div>
            <div className="mb-3 mt-1 flex w-full flex-row flex-wrap items-center gap-4">
              <label className="basis-[120px] font-semibold">Published:</label>
              <div className="relative">
                <PublishedButton
                  videoId={video?.id ?? ""}
                  isPublished={video?.publish ?? false}
                  refetch={refetch}
                />
              </div>
            </div>
            <form
              className="flex flex-col"
              onChange={handleVideoUpdateDebounced}
            >
              <InputField name="title" initialValue={data?.video.title ?? ""} />
              <InputField
                name="description"
                initialValue={data?.video.description ?? ""}
                tag="textarea"
              />
            </form>
            <div className="mb-3 mt-1 flex w-full flex-row flex-wrap items-center gap-4">
              <label className="basis-[120px] font-semibold">
                Published at:
              </label>
              <div className="relative">
                {video?.createdAt?.toLocaleDateString() ?? ""}
              </div>
              <div className="mb-3 mt-1 flex w-full flex-row flex-wrap items-center gap-4">
                <label className="basis-[120px] font-semibold">
                  Updated at:
                </label>
                <div className="relative">
                  {video?.updatedAt?.toLocaleDateString() ?? ""}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="mb-8 flex-1 basis-1/2 rounded-xl p-4">
        <section className="flex w-full flex-wrap content-start gap-8 overflow-y-auto border-t p-6 md:border-l md:border-t-0 lg:p-12">
          <div className="flex-1 grow-[3] basis-[640px]">
            <ReactPlayer
              url={video?.videoUrl ?? ""}
              controls={true}
              playing={false}
              style={{ borderRadius: "1em", overflow: "hidden" }}
              width="100%"
              height="auto"
            />
            <div className="mt-4 flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="min-w-0 flex-1 space-y-3 ">
                <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
                  <div className="flex flex-col items-start justify-center gap-1 self-stretch ">
                    <VideoTitle
                      title={video?.title ?? ""}
                      limitHeight={false}
                      limitSize={false}
                    />
                    <VideoInfo
                      views={video?.views ?? 0}
                      createdAt={video?.createdAt ?? ""}
                    />
                  </div>
                  <div className="flex-inline flex items-end justify-start self-start">
                    <LikeButton
                      disabled={true}
                      videoId={video?.id ?? ""}
                      engagement={{
                        likes: video?.likes ?? 0,
                        dislikes: video?.dislikes ?? 0,
                      }}
                      viewer={{
                        hasLiked: false,
                        hasDisliked: false,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-row place-content-between items-center gap-x-4 ">
                  <UserCard
                    userId={video?.userId ?? ""}
                    userName={user?.name ?? ""}
                    userImage={user?.image ?? ""}
                    followers={user?.followers ?? 0}
                    userHandle={user?.handle ?? ""}
                    userEmail={user?.email ?? ""}
                  />
                </div>
                <VideoDescription description={video?.description ?? ""} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditPage;
