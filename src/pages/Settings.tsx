import { type FormEvent, useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import { Button, UserImage } from "@/components";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import InputField from "@/components/Input/InputField";
import LoadingMessage from "@/components/Loading/Loading";
import useImageUpload from "@/hook/useImageUpload";

import { type UserData } from "@/hook/useImageUpload";
import UserCheck from "@/components/Icons/UserCheck";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";

const Settings = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";
  const { data, isLoading, error, refetch } = api.user.getChannelById.useQuery({
    id: userId,
  });

  const [saved, setSaved] = useState(false);
  const [duplicatedEmail, setDuplicatedEmail] = useState(false);

  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userDataMutation = api.user.updateProfile.useMutation();
  const handleUserUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDuplicatedEmail(false);
    const form = e.currentTarget;
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(() => {
      const userData: UserData = { userId };
      const formData = new FormData(form) as unknown as Iterable<
        [keyof UserData, FormDataEntryValue]
      >;
      for (const [key, value] of formData) {
        userData[key] = String(value);
      }
      userDataMutation.mutate(userData, {
        onSuccess: () => {
          setSaved(true);
          void refetch();
        },
        onError: (e) => {
          if (e.message.indexOf("Unique")) setDuplicatedEmail(true);
        },
      });
    }, 500);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => setSaved(false), 1000);
    return () => clearTimeout(timeoutId);
  }, [saved]);

  const [profileImage] = useImageUpload({
    name: "image",
    id: userId,
    refetch,
    initialFile: data?.user?.image ?? "",
  });

  const [profileBackground] = useImageUpload({
    name: "backgroundImage",
    id: userId,
    refetch,
    initialFile: data?.user?.backgroundImage ?? "/background.jpg",
    aspectRatio: 2 / 1,
  });

  if (!userId)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="page" />
      </div>
    );
  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <ErrorMessage
        icon="GreenPlay"
        message="Error Getting Settings"
        description="Sorry the requested setting page cannot be found."
      />
    );

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      {profileImage && <profileImage.CropCard />}
      {profileBackground && <profileBackground.CropCard />}
      <div className="relative flex h-fit w-full flex-col">
        <div className="relative">
          <Image
            className="h-32 w-full object-cover lg:h-64"
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            src={profileBackground?.orgImage || "/background.jpg"}
            width={2000}
            height={2000}
            alt="profile background image"
          />
          {profileBackground && <profileBackground.UploadButton />}
        </div>
        <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
          <div className="items !-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="relative inline-block">
              <UserImage
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                image={profileImage?.orgImage ?? ""}
              />
              {profileImage && <profileImage.UploadButton />}
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm: mt-6 min-w-0 flex-1 md:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {data?.user.name}
                </h1>
                <p className="text-regular text-gray-600">
                  {data?.user.handle}
                </p>
                <div className="mt-1 flex items-start text-xs">
                  <p className="text-sm text-gray-600">&nbsp;</p>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>
              <div className=" mt-6 flex justify-stretch space-y-3 sm:space-x-4 sm:space-y-0">
                <Button
                  variant="primary"
                  size="2xl"
                  href={`/${userId}/ProfileVideos`}
                  className="!-5 ml-2 flex"
                >
                  <UserCheck className="mr-2 h-5 w-5 shrink-0 stroke-white" />
                  Finish
                </Button>
              </div>
            </div>
          </div>
          <form
            className="mt-8 flex w-full flex-wrap"
            onChange={handleUserUpdate}
          >
            <div className="shrink-[3] grow basis-[300px]">
              <div className="font-bold">Personal Info</div>
              <p className=" mb-4 text-sm">
                Update your photo and personal details.
              </p>
            </div>
            <div className="relative flex shrink grow-[3] basis-1/2 flex-col items-center rounded-lg border p-4">
              <InputField name="name" initialValue={data.user.name ?? ""} />
              <InputField
                name="email"
                initialValue={data.user.email ?? ""}
                validation="email"
              />
              <div
                className={`${
                  duplicatedEmail ? " max-h-6 opacity-100" : "max-h-0 opacity-0"
                } -translate-y-3 self-end font-bold text-red-600 transition-all`}
              >
                Email already exists!
              </div>
              <InputField name="handle" initialValue={data.user.handle ?? ""} />
              <InputField
                name="description"
                initialValue={data.user.description ?? ""}
                tag="textarea"
              />

              <div
                className={`${
                  saved ? "opacity-100" : "opacity-0"
                } font-bold text-green-600 transition-all`}
              >
                All Changes Saved!
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
