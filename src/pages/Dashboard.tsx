import { UserImage } from "@/components";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import LoadingMessage from "@/components/Loading/Loading";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

const Dashboard = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  const { data, isLoading, error, refetch } = api.user.getChannelById.useQuery({
    id: userId,
  });

  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="video" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="flex w-full flex-col">
        <Image
          className="h-32 w-full object-cover lg:h-64"
          src={data?.user.backgroundImage ?? "/background.jpg"}
          width={2000}
          height={2000}
          alt="error"
        />
        <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
          <div className="!-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <UserImage
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                image={data?.user.image ?? ""}
              />
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm: mt-6 min-w-0 flex-1 md:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {data?.user.name}
                </h1>
                <p className="text-regular text-gray-600">
                  {data?.user.handle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
