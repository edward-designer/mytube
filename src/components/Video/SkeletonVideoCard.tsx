export const SkeletonVideoCard = () => (
  <div className="flex flex-1 flex-col items-start lg:basis-1/4">
    <div className="relative w-full">
      <div className="w-full">
        <div className="relative inset-0 h-0 w-full animate-pulse rounded-xl  bg-slate-200 pb-[50%]"></div>
      </div>
      <div className="-mt-3 max-w-xl lg:mt-0">
        <div className="items-top  relative mt-4 flex gap-x-4">
          <div className="relative aspect-square h-10 w-10 animate-pulse rounded-full  bg-slate-200"></div>
          <div className="w-full">
            <h1 className="line-clamp-2 max-h-12 w-full  max-w-md animate-pulse overflow-hidden bg-slate-200 text-base font-semibold leading-4 text-gray-900 group-hover:text-gray-600 lg:leading-6">
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
