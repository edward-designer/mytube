import React, { Fragment, useRef, useState } from "react";
import Trash from "../Icons/Trash";
import Button from "./Button";
import { api } from "@/utils/api";
import { Transition, Dialog } from "@headlessui/react";
import { RedTrash } from "../Icons/RedTrash";

interface DeleteButtonProps {
  videoId: string;
  refetch: () => Promise<unknown>;
}

const DeleteButton = ({ videoId, refetch }: DeleteButtonProps) => {
  const cancelButtonRef = useRef(null);
  const [confirmScreen, setConfirmScreen] = useState(false);

  const deleteVidoeMutation = api.video.deleteVideoById.useMutation();
  const handleConfirm = () => setConfirmScreen(true);

  const handleDeleteVideo = () =>
    deleteVidoeMutation.mutate(
      { id: videoId },
      {
        onSuccess: () => {
          void setConfirmScreen(false);
          void refetch();
        },
      },
    );

  return (
    <>
      <Button
        onClick={handleConfirm}
        variant="secondary-gray"
        className="h-8 w-8"
      >
        <Trash />
        <span className="sr-only">Delete Video</span>
      </Button>
      <Transition.Root show={confirmScreen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setConfirmScreen}
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
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex !h-12 !w-12">
                      <RedTrash aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete Video
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this video? Once its
                          deleted, you will not be able to recover it.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDeleteVideo}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setConfirmScreen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
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

export default DeleteButton;
