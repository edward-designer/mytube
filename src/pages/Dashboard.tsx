import DeleteButton from "@/components/Buttons/DeleteButton";
import EditButton from "@/components/Buttons/EditButton";
import PublishedButton from "@/components/Buttons/PublishedButton";
import UploadVideoButton from "@/components/Buttons/UploadVideoButton";
import NotAvailable from "@/components/ErrorMessage/NotAvailable";
import {
  GreenEye,
  GreenUserCheck,
  GreenHeart,
  GreenPlay,
} from "@/components/Icons/GreenIcons";
import LoadingMessage from "@/components/Loading/Loading";
import { Thumbnail } from "@/components/Video/Thumbnail";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id ?? "";

  const { data, isLoading, error, refetch } =
    api.user.getDashboardData.useQuery(userId, { enabled: false });

  useEffect(() => {
    if (!userId) void refetch();
  }, [userId]);

  if (!userId)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="page" />
      </div>
    );
  if (isLoading) return <LoadingMessage />;
  if (!(!error && data))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <NotAvailable variant="page" />
      </div>
    );

  interface StatsItem {
    name: string;
    stat: string;
    icon: (className: string) => JSX.Element;
  }
  const stats: StatsItem[] = [
    {
      name: "Total Views",
      stat: data?.totalViews?.toString() || "0",
      icon: (className) => <GreenEye className={className} />,
    },
    {
      name: "Total Videos",
      stat: data?.videos.length?.toString() || "0",
      icon: (className) => <GreenPlay className={className} />,
    },
    {
      name: "Total followers",
      stat: data?.totalFollowers?.toString() || "0",
      icon: (className) => <GreenUserCheck className={className} />,
    },
    {
      name: "Total likes",
      stat: data?.totalLikes?.toString() || "0",
      icon: (className) => <GreenHeart className={className} />,
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex w-full p-8">
        <div className="flex w-full flex-col gap-8 bg-white pt-3 sm:rounded-lg">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="flex items-start space-x-5">
              <div className="pt-1.5">
                <h1 className="text-2xl font-bold text-gray-900">
                  <span>Welcome Back </span> {sessionData?.user.name}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Track and manage your channel and videos
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <UploadVideoButton refetch={refetch} />
            </div>
          </div>
          <div>
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200  shadow-sm   md:grid-cols-4 md:divide-x md:divide-y-0">
              {stats.map((item) => (
                <div key={item.name} className="px-4 py-5 sm:p-6">
                  {item.icon("w-16 h-16")}
                  <dt className="text-base font-normal text-gray-900">
                    {item.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-primary-600 md:block lg:flex">
                    {item.stat}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Published?
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Video
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rating
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Date Uploaded
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {data?.videos.map((video) => (
                        <tr key={video.id}>
                          <td>
                            <PublishedButton
                              videoId={video.id}
                              isPublished={video.publish}
                              refetch={refetch}
                            />
                          </td>
                          <td
                            className={`${
                              video.publish ? "opacity-100" : "opacity-50"
                            } whitespace-wrap py-5 pl-4 pr-3 text-sm sm:pl-0`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`
                              ${
                                video.publish ? "opacity-100" : "opacity-50"
                              } h-16 w-32 flex-shrink-0`}
                              >
                                <Thumbnail
                                  thumbnailUrl={video.thumbnailUrl ?? ""}
                                />
                              </div>
                              <div className="ml-4 font-medium text-gray-900">
                                {video.title}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="mb-2 rounded-full bg-success-100 px-2 py-1 text-xs font-medium text-success-700">
                              {video.likes} Likes
                            </div>
                            <div className="rounded-full  bg-error-100 px-2 py-1 text-xs font-medium text-error-700">
                              {video.dislikes} Dislikes
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-600">
                            {video.createdAt.toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-600">
                            <div className="flex flex-row gap-2">
                              <EditButton videoId={video?.id ?? ""} />
                              <DeleteButton
                                videoId={video.id}
                                refetch={refetch}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
