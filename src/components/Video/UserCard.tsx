import Link from "next/link";
import UserImage from "./UserImage";
import { UserName } from "./UserName";

interface UserCardProps {
  userId: string;
  userImage: string;
  userName: string | null;
  userHandle?: string | null;
  userEmail?: string | null;
  followers: number;
}

const UserCard = ({
  userId,
  userImage,
  userName,
  userHandle,
  userEmail,
  followers,
}: UserCardProps) => {
  return (
    <Link href={`/${userId}/ProfileVideos`}>
      <div className="flex flex-row gap-2">
        <UserImage image={userImage} />
        <button className="flex flex-col">
          <UserName
            name={
              userName ??
              userHandle ??
              userEmail?.substring(0, userEmail.search("@")) ??
              ""
            }
          />
          <p className=" text-sm text-gray-600">
            {followers ?? 0}
            <span> Followers</span>
          </p>
        </button>
      </div>
    </Link>
  );
};

export default UserCard;
