import { Link } from "react-router-dom";

const PostCard = ({ post }: any) => {
  return (
    <div className="group col-span-1 relative w-full border border-indigo-500 hover:border-2 h-[400px] overflow-hidden rounded-lg ">
      <Link to={`../post/${post.postId}`}>
        <img
          src={post.cover}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
        <Link
          to={`../post/${post.postId}`}
          className="z-10 m-2 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none"
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
