import moment from "moment";
import Link from "next/link";
import UserImage from "../Video/UserImage";
import LikeButton from "../Buttons/LikeButton";

export interface Announcement {
  announcement: {
    like: number;
    dislike: number;
    hasLiked: boolean;
    hasDisliked: boolean;
    id: string;
    message: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
    handle: string | null;
  };
}

const AnnouncementCard = ({ user, announcement }: Announcement) => {
  return (
    <div className="mt-4 flex flex-row gap-4 border-t p-2 py-4 text-sm font-light">
      <Link href={`/${user.id}/ProfileVideos`}>
        <UserImage image={user?.image ?? ""} />
      </Link>
      <div>
        <div className="text-base font-semibold leading-6">
          <Link href={`/${user.id}/ProfileVideos`}>{user.handle}</Link>
          <div className="ml-4 inline font-light ">
            {moment(announcement.createdAt).fromNow()}
          </div>
        </div>

        <div className="mt-2 whitespace-pre-line ">{announcement.message}</div>
        <div className="mt-4 flex">
          <LikeButton
            announcementId={announcement.id}
            engagement={{
              likes: announcement.like,
              dislikes: announcement.dislike,
            }}
            viewer={{
              hasDisliked: announcement.hasDisliked,
              hasLiked: announcement.hasLiked,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
