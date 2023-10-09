import { Button } from "@/components";
import InputFile from "@/components/Input/InputFile";
import { api } from "@/utils/api";
import { useState, useRef, useEffect } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";

import "cropperjs/dist/cropper.css";

export interface UserData {
  userId: string;
  name?: string | undefined;
  email?: string | undefined;
  image?: string | undefined;
  backgroundImage?: string | undefined;
  handle?: string | undefined;
  description?: string | undefined;
}

const useImageUpload = ({
  name,
  userId,
  refetch,
  initialFile,
  aspectRatio = 1 / 1,
}: {
  name: "image" | "backgroundImage";
  userId: string;
  refetch: () => Promise<unknown>;
  initialFile: string;
  aspectRatio?: number;
}) => {
  const userDataMutation = api.user.updateProfile.useMutation();
  const handleImageUpdate = (url: string, cb: () => void) => {
    const userData: UserData = { userId, [name]: url };
    userDataMutation.mutate(userData, {
      onSuccess: () => {
        void refetch().then(void cb());
      },
    });
  };

  const [orgImage, setOrgImage] = useState<string>(initialFile);
  const [useCrop, setUseCrop] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | undefined>();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => setOrgImage(initialFile), [initialFile]);

  const onCrop = async () => {
    setIsUploading(true);
    setUseCrop(false);
    const cropper = cropperRef.current?.cropper;
    const data = cropper?.getCroppedCanvas().toDataURL("image/jpg") ?? "";
    setOrgImage("");
    const url = await uploadImage(data);
    handleImageUpdate(url, () => {
      setOrgImage(url);
      setIsUploading(false);
    });
  };

  const onCancel = () => {
    setUseCrop(false);
  };

  const uploadImage = async (image: string) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mytube");
    data.append("cloud_name", "deh6cggus");
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deh6cggus/image/upload",
        {
          method: "post",
          body: data,
        },
      );
      const json = (await response.json()) as { url: string };
      return json.url;
    } catch (err) {
      console.log(err);
    }
    return "";
  };

  const uploadHandler = (file: File | undefined) => {
    setUploadFile(file);
    setUseCrop(true);
  };

  const UploadButton = () => (
    <InputFile
      name={name}
      isUploading={isUploading}
      uploadHandler={uploadHandler}
    />
  );

  const CropCard = () =>
    useCrop && (
      <>
        <div className="fixed inset-0 z-40 h-full w-full bg-black/70 " />
        <div className="absolute z-50 ml-[50%] mt-6 -translate-x-[50%] bg-white/90 p-[3vw] shadow-lg">
          <Cropper
            src={
              uploadFile instanceof File
                ? URL.createObjectURL(uploadFile)
                : uploadFile
            }
            aspectRatio={aspectRatio}
            guides={true}
            ref={cropperRef}
            style={{ width: "70vw", height: "70vh" }}
          />
          <div className="mt-4 flex gap-2">
            <Button className="rounded-lg" onClick={() => void onCrop()}>
              Crop
            </Button>
            <Button
              className="rounded-lg"
              variant="secondary-gray"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </>
    );
  const image = { UploadButton, CropCard, orgImage, isUploading };
  return [image];
};

export default useImageUpload;
