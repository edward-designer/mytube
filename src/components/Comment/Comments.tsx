import { api } from "@/utils/api";
import { useSession, signIn } from "next-auth/react";
import { Button } from "../Buttons";

import CommentCard, { type Comment } from "./CommentCard";
import InputBox from "../Input/InputBox";

interface CommentProps {
  videoId: string;
  comments: Comment[];
  refetch: () => Promise<unknown>;
}

const Comments = ({ videoId, comments, refetch }: CommentProps) => {
  const { data: sessionData } = useSession();
  const viewerId = sessionData?.user?.id ?? "";

  const addCommentMutation = api.comment.addComment.useMutation();
  const addComment = ({
    message,
    successHandler,
  }: {
    message: string;
    successHandler: () => void;
  }) => {
    const input = {
      userId: viewerId,
      videoId,
      message,
    };
    addCommentMutation.mutate(input, {
      onSuccess: successHandler,
    });
  };

  return (
    <div className="my-8 flex flex-col rounded-xl border p-4">
      <div>
        {comments.length > 0
          ? `${comments.length} comments`
          : "Be the 1st to comment"}
      </div>
      <div className="my-4 ">
        {sessionData ? (
          <InputBox
            addHandler={addComment}
            refetch={refetch}
            placeholderText="Comment"
          />
        ) : (
          <Button className="px-8" onClick={void signIn}>
            Log in to Comment
          </Button>
        )}
      </div>
      {comments.map(({ comment, user }) => (
        <CommentCard user={user} comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default Comments;
