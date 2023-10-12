import React from "react";

const VideoLoadingPlaceholder = () => {
  return (
    <section className="flex w-full flex-wrap content-start gap-8 overflow-y-auto p-6 lg:p-12">
      <div className="flex-1 grow-[3] basis-[640px]">
        <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-slate-200"></div>
        <DetailsPlaceholder />
      </div>
      <aside className="flex-1 basis-96">
        <div className="flex h-full w-full place-content-center">
          <div className="flex w-full flex-wrap content-start gap-8 gap-y-4 [&>*]:flex-1 [&>*]:basis-[350px]">
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
            <AsidePlaceholder />
          </div>
        </div>
      </aside>
    </section>
  );
};

export default VideoLoadingPlaceholder;

const AsidePlaceholder = () => (
  <div className="flex flex-1 basis-1/2 flex-col items-start">
    <div className="flex w-full items-center gap-4">
      <div className=" basis-1/2">
        <div className="relative inset-0 h-0 w-full animate-pulse rounded-xl bg-slate-200 pb-[50%]"></div>
      </div>
      <div className="-mt-3 flex-shrink-0 basis-1/2 lg:mt-0">
        <div className="items-top relative flex gap-x-4">
          <div className="w-full">
            <h1 className="line-clamp-2 max-h-12 w-full max-w-md animate-pulse overflow-hidden bg-slate-200 text-base font-semibold leading-4 text-gray-900 group-hover:text-gray-600 lg:leading-6">
              &nbsp;
            </h1>
            <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
              <p className="animate-pulse  bg-slate-200 text-gray-600">
                &nbsp;<span> &nbsp;</span>
              </p>
              <li className="animate-pulse pl-2 text-sm text-slate-200"></li>
              <p className="w-full animate-pulse bg-slate-200 text-gray-600">
                &nbsp;
              </p>
            </div>
            <p className=" max-h-6 overflow-hidden text-left text-sm font-semibold leading-6 text-gray-900">
              &nbsp;
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DetailsPlaceholder = () => (
  <div className="mt-4 flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
    <div className="min-w-0 flex-1 space-y-3 ">
      <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
        <div className="flex basis-1/2 flex-col items-start justify-center gap-1 self-stretch">
          <h1 className="w-full animate-pulse bg-slate-200 text-base font-semibold leading-4  text-gray-900 lg:text-lg lg:leading-6">
            &nbsp;
          </h1>
          <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
            <p className="mb-2 w-[140px] animate-pulse  bg-slate-200 leading-4">
              &nbsp;
            </p>
            <li className="animate-pulse pl-2 text-sm text-slate-200 "></li>
            <p className="mb-2 w-[100px] animate-pulse  bg-slate-200 leading-4">
              &nbsp;
            </p>
          </div>
        </div>
        <div className="flex-inline flex items-end justify-start self-start">
          <button className="group flex  animate-pulse items-center rounded-full rounded-none rounded-l-lg border bg-gray-50 bg-slate-200 bg-white !py-0 px-3 py-2 text-sm text-gray-500 !ring-0 hover:bg-gray-100 hover:bg-white hover:text-gray-800 hover:text-primary-700 focus:bg-white">
            <div className="h-8 w-8"></div>
            <span aria-label="number of likes">&nbsp;</span>
          </button>
          <button className="group flex  animate-pulse items-center rounded-full rounded-none rounded-r-lg border border-l-0 bg-gray-50 bg-slate-200 bg-white !py-0 px-3 py-2 text-sm text-gray-500 !ring-0 hover:bg-gray-100 hover:bg-white hover:text-gray-800 hover:text-primary-700 focus:bg-white">
            <div className="h-8 w-8"></div>
            <span aria-label="number of dislikes">&nbsp;</span>
          </button>
          <button className="ml-2  flex animate-pulse items-center rounded-full rounded-lg border bg-gray-50 bg-slate-200 bg-white !py-0 px-3 py-2 text-sm text-gray-500 text-primary-700 !ring-0 hover:bg-gray-100 hover:bg-white hover:text-gray-800 hover:text-primary-700 focus:bg-white">
            <div className="h-8 w-8"></div>&nbsp;
          </button>
        </div>
      </div>
      <div className="flex flex-row place-content-between items-center gap-x-4 ">
        <div className="flex flex-row gap-2">
          <div className="relative h-10 w-10 shrink-0 animate-pulse rounded-full  bg-slate-200"></div>
          <button className="flex w-1/2 flex-col">
            <p className="mb-2 w-[100px] animate-pulse  bg-slate-200 leading-4">
              &nbsp;
            </p>
            <p className="mb-2 w-full animate-pulse  bg-slate-200 leading-4">
              &nbsp;
            </p>
          </button>
        </div>
        <button className="flex animate-pulse rounded-full rounded-lg  bg-slate-200 px-3 py-2 text-sm text-transparent shadow-sm hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary-100">
          Follow
        </button>
      </div>
      <div className=" relative mt-2">
        <p className="mb-2 w-full animate-pulse  bg-slate-200 leading-4">
          &nbsp;
        </p>
        <p className="mb-2 w-full animate-pulse  bg-slate-200 leading-4">
          &nbsp;
        </p>
        <p className="mb-2 w-full animate-pulse  bg-slate-200 leading-4">
          &nbsp;
        </p>
        <p className="mb-2 w-1/2 animate-pulse  bg-slate-200 leading-4">
          &nbsp;
        </p>
      </div>
    </div>
  </div>
);
