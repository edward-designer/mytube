import { Fragment, useState } from "react";
import Lottie from "react-lottie-player";

import { signIn, useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";

import Save from "@/components/Icons/folder.json";

import { cx } from "@/utils/helpers";
import { api } from "@/utils/api";

import Button from "./Button";
import Close from "../Icons/Close";

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SaveButton = ({
  videoId,
  hasSaved,
}: {
  videoId: string;
  hasSaved: boolean;
}) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  const { data: playlistData, refetch: refetchPlaylists } =
    api.playlist.getPlaylists.useQuery(
      { userId, videoId },
      {
        enabled: false,
        onSuccess: (data) => {
          setCheckedList(data.playlistIdArray);
        },
      },
    );

  const playlists = playlistData?.playlists ?? [];
  const playlistIdArray = playlistData?.playlistIdArray ?? [];
  const [saved, setSaved] = useState(hasSaved);
  const [open, setOpen] = useState(false);
  const [checkedList, setCheckedList] = useState(playlistIdArray);

  const playlistcontrolProps = {
    videoId,
    userId,
    open,
    setOpen,
    saved,
    setSaved,
    playlists,
    checkedList,
    setCheckedList,
    refetchPlaylists,
  };

  return (
    <>
      <Button
        className={cx([
          "group ml-2 flex items-center rounded-lg border bg-white !py-0 !ring-0 hover:bg-white hover:text-primary-700",
          saved ? "text-primary-700" : "",
        ])}
        size="xl"
        variant="tertiary-gray"
        onClick={
          sessionData
            ? () => {
                void refetchPlaylists();
                setOpen(true);
              }
            : () => void signIn()
        }
      >
        <Lottie
          animationData={Save}
          play={saved}
          loop={false}
          className="h-8 w-8"
          goTo={saved ? 2 : 0}
        />
        {saved ? "Saved" : "Save"}
      </Button>
      <PlaylistControl {...playlistcontrolProps} />
    </>
  );
};

export default SaveButton;

const PlaylistControl = ({
  videoId,
  userId,
  open,
  setOpen,
  setSaved,
  playlists,
  checkedList,
  setCheckedList,
  refetchPlaylists,
}: {
  videoId: string;
  userId: string;
  open: boolean;
  setOpen: (state: boolean) => void;
  saved: boolean;
  setSaved: (state: boolean) => void;
  checkedList: string[];
  setCheckedList: (state: string[]) => void;
  playlists: Playlist[];
  refetchPlaylists: () => void;
}) => {
  const changeVideoInPlaylistMutation =
    api.playlist.updatePlaylists.useMutation();
  const changeVideoInPlaylist = (input: {
    deletePlaylistId: string;
    addPlaylistId: string;
    videoId: string;
  }) => {
    changeVideoInPlaylistMutation.mutate(input);
  };

  const createPlaylistMutation = api.playlist.createPlaylist.useMutation();

  const handleCreatePlaylist = () => {
    createPlaylistMutation.mutate(
      { newPlaylistName, userId, videoId },
      {
        onSuccess: () => {
          setNewPlaylistName("");
          setSaved(true);
          void refetchPlaylists();
        },
      },
    );
  };

  const handleVideosInPlaylist = (playlistId: string) => {
    if (checkedList.includes(playlistId)) {
      const nextCheckList = checkedList.filter((list) => list !== playlistId);
      setCheckedList(nextCheckList);
      setSaved(nextCheckList.length > 0);
      changeVideoInPlaylist({
        deletePlaylistId: playlistId,
        addPlaylistId: "",
        videoId,
      });
    } else {
      setCheckedList([...checkedList, playlistId]);
      setSaved(true);
      changeVideoInPlaylist({
        deletePlaylistId: "",
        addPlaylistId: playlistId,
        videoId,
      });
    }
  };

  const [newPlaylistName, setNewPlaylistName] = useState("");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" relative m-2 flex !max-w-xs transform flex-col items-start justify-start overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-center shadow-xl transition-all sm:my-8 sm:w-full  sm:p-6">
                <div className="absolute right-0 top-0  hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <Close className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mb-2 mt-5 text-center sm:mt-0">
                  <Dialog.Title
                    as="h3"
                    className=" text-base font-semibold leading-6 text-gray-900"
                  >
                    Save Video To Playlist
                  </Dialog.Title>
                </div>
                <fieldset className="w-full">
                  {playlists?.map((playlist) => (
                    <PlaylistCheckBox
                      key={playlist.id}
                      playlist={playlist}
                      handleVideosInPlaylist={handleVideosInPlaylist}
                      checkedList={checkedList}
                    />
                  ))}
                </fieldset>
                <div className="mt-5 flex w-full flex-col gap-2 border-t pt-4 text-left">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Save Video to New Playlist
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="text"
                        id="text"
                        value={newPlaylistName}
                        onChange={(event) => {
                          setNewPlaylistName(event.target.value);
                        }}
                        onKeyUp={(event) => {
                          if (event.key === "Enter") handleCreatePlaylist();
                        }}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="New Playlist Title"
                      />
                    </div>
                  </div>
                  {newPlaylistName.length > 0 && (
                    <Button
                      variant="primary"
                      onClick={handleCreatePlaylist}
                      className="p-2"
                      size="xl"
                    >
                      Add
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const PlaylistCheckBox = ({
  playlist,
  checkedList,
  handleVideosInPlaylist,
}: {
  playlist: Playlist;
  checkedList: string[];
  handleVideosInPlaylist: (playlistId: string) => void;
}) => {
  return (
    <div key={playlist.id} className=" space-y-5  py-1 ">
      <div className="relative flex items-start justify-start text-left">
        <div className="flex h-6 items-center">
          <input
            id={`list-${playlist.id}`}
            aria-describedby={`list-label-${playlist.id}`}
            name={`list-${playlist.id}`}
            type="checkbox"
            checked={checkedList.includes(playlist.id)}
            onChange={() => handleVideosInPlaylist(playlist.id)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label
            id={`list-label-${playlist.id}`}
            htmlFor={`list-${playlist.id}`}
            className="font-medium text-gray-900"
          >
            {playlist.title}
          </label>
        </div>
      </div>
    </div>
  );
};
