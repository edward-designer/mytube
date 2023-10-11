import React, { type ChangeEvent, Fragment, useRef, useState } from "react";
import Button from "./Button";
import { api } from "@/utils/api";
import { Transition, Dialog } from "@headlessui/react";
import { Plus, Upload } from "../Icons/Icons";
import { type VideoData } from "@/hook/useImageUpload";
import LoadingMessage from "../Loading/Loading";
import { useRouter } from "next/router";

interface UploadVideoButtonProps {
  refetch: () => Promise<unknown>;
}

const UploadVideoButton = ({ refetch }: UploadVideoButtonProps) => {
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const [uploadScreen, setUploadScreen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const addVideoMutation = api.video.addVideo.useMutation();

  const handleUpload = () => setUploadScreen(true);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.item(0);
    if (e?.target?.files && e?.target?.files?.length > 0 && file)
      handleUploadVideo(file);
  };

  const handleUploadVideo = (file: File) => {
    setIsUploading(true);
    uploadVideo(file)
      .then((filename) => {
        if (filename) {
          const videoData: Partial<VideoData> = {
            videoUrl: filename,
          };
          addVideoMutation.mutate(videoData, {
            onSuccess: (data) => {
              const videoId = data.id;
              void router.push(`/video/${videoId}/edit`);
            },
          });
        }
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message);

        void refetch();
      });
  };

  const uploadVideo = async (video: File) => {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "mytube");
    data.append("cloud_name", "deh6cggus");
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deh6cggus/video/upload",
        {
          method: "post",
          body: data,
        },
      );
      const json = (await response.json()) as { url: string };
      return json.url;
    } catch (err) {
      throw err;
    }
    return "";
  };

  return (
    <>
      <Button
        onClick={handleUpload}
        variant="primary"
        className="flex h-10 items-center justify-center rounded-lg px-4 text-lg"
      >
        <Plus className=" h-6 stroke-white" />
        <span>Upload Video</span>
      </Button>
      <Transition.Root show={uploadScreen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setUploadScreen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="flex w-full">
                    <div className="mt-3 w-full flex-1 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        <Upload
                          className="mr-2 inline h-6 w-6"
                          aria-hidden="true"
                        />
                        Upload Video
                      </Dialog.Title>
                      {isUploading ? (
                        <div className="flex h-[200px] content-center justify-center">
                          <LoadingMessage height={100} width={100} />
                        </div>
                      ) : error ? (
                        <div className="flex h-[200px] content-center justify-center">
                          {error}
                        </div>
                      ) : (
                        <div
                          className={`${
                            dragOver ? "bg-primary-50" : "bg-white"
                          } mt-4 flex h-[200px] w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-300`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={(e) => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOver(false);
                            if (e?.dataTransfer?.files?.[0]) {
                              handleUploadVideo(e.dataTransfer.files[0]);
                            }
                          }}
                        >
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                            >
                              <span>Upload a Video</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="video/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    {!isUploading && !error && (
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setUploadScreen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UploadVideoButton;
