import Link from "next/link";
import UserImage from "../Video/UserImage";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { useSession, signIn } from "next-auth/react";
import { Button } from "../Buttons";

interface Comment {
  comment: {
    id: string;
    message: string;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
    handle: string | null;
  };
}

interface CommentProps {
  videoId: string;
  comments: Comment[];
  refetch: () => Promise<unknown>;
}

const Comments = ({ videoId, comments, refetch }: CommentProps) => {
  const [newComment, setNewComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user?.id ?? "";

  const addCommentMutation = api.comment.addComment.useMutation();
  const addComment = (input: {
    userId: string;
    videoId: string;
    message: string;
  }) => {
    addCommentMutation.mutate(input, {
      onSuccess: () => {
        setNewComment("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        void refetch();
      },
    });
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;

    const handleTextareeChange = (ele: HTMLTextAreaElement) => {
      ele.style.height = "auto";
      ele.style.height = `${ele.scrollHeight}px`;
    };

    textarea.addEventListener("input", () => handleTextareeChange(textarea));
    return () => {
      textarea.removeEventListener("input", () =>
        handleTextareeChange(textarea),
      );
    };
  }, []);

  return (
    <div className="my-8 flex flex-col rounded-xl border p-4">
      <div>
        {comments.length > 0
          ? `${comments.length} comments`
          : "Be the 1st to comment"}
      </div>
      <div className="my-4 ">
        {sessionData ? (
          <>
            <textarea
              className=" w-full resize-none rounded-lg border-none bg-gray-100 focus:ring-primary-700"
              value={newComment}
              rows={1}
              placeholder="Comment"
              onChange={(e) => setNewComment(e.target.value)}
              ref={textareaRef}
            />
            {newComment.length > 5 && (
              <Button
                className="mt-2 px-4"
                onClick={() =>
                  addComment({ userId: viewerId, videoId, message: newComment })
                }
              >
                Submit
              </Button>
            )}
          </>
        ) : (
          <Button className="px-8" onClick={void signIn}>
            Log in to Comment
          </Button>
        )}
      </div>
      {comments.map(({ comment, user }) => (
        <Comment user={user} comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default Comments;

const Comment = ({ user, comment }: Comment) => {
  return (
    <div className="mt-4 flex flex-row gap-4 border-t p-2 py-4 text-sm font-light">
      <Link href={`/${user.id}/ProfileVideos`}>
        <UserImage image={user?.image ?? ""} />
      </Link>
      <div>
        <div className="text-base font-semibold leading-6">
          <Link href={`/${user.id}/ProfileVideos`}>{user.handle}</Link>
          <div className="ml-4 inline font-light ">
            {moment(comment.createdAt).fromNow()}
          </div>
        </div>

        <div className="mt-2 whitespace-pre-line ">{comment.message}</div>
      </div>
    </div>
  );
};
