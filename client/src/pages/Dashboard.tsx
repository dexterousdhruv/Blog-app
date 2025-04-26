import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, User } from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "@/components/PostCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiCall } from "@/lib/api";
import useUserInfo from "@/hooks/use-user-info";
import { IoMdMenu } from "react-icons/io";
import { FiSidebar } from "react-icons/fi";
import Loader from "@/components/loader";
import { Post } from "@/lib/types";


const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfo();

  // API call to fetch all posts
  const getAllPosts = (): Promise<any> => {
    return apiCall("GET", "/posts", userInfo?.token); // Adjusted for posts
  };

  const { data, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    refetchOnMount: "always",
    select: (data) => data?.data,
  });

  const posts: Post[] = data || [];

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setUserInfo("");
      toast.success("User logged out!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen px-4 py-2 font-poppins">
      {/* Header */}
      <header className="flex justify-between items-center h-16 gap-2 border-sidebar-border  border shadow rounded-sm p-2 px-4 ">
        <h1 className="md:text-xl font-semibold p-2 rounded-md hover:bg-gray-100 acitve:bg-gray-100">
          <FiSidebar />
        </h1>

        <Popover>
          <PopoverTrigger>
            <IoMdMenu size={25} />
          </PopoverTrigger>
          <PopoverContent asChild className="p-0 mr-4  font-poppins  max-w-32">
            <div className="flex flex-col w-full">
              <div className="px-2 py-1.5 flex items-center gap-2  text-gray-500 hover:bg-gray-50 font-normal">
                <User className="" size={20} />@{userInfo?.username}
              </div>
              <Button
                className="px-4 w-full text-[#00212C] rounded-none font-normal"
                variant={"ghost"}
                onClick={() => navigate("../create-post")}
              >
                <PlusCircle className="text-blue-500" />
                <span className="block">Create Post</span>
              </Button>
              <Button
                className="w-full justify-start text-[#00212C] font-normal rounded-none"
                variant={"ghost"}
                onClick={handleLogout}
              >
                <LogOut className="text-red-500" />
                <span className="block">Log out</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </header>

      {isPending ? (
        <div className="grid place-content-center h-[calc(100dvh_-_100px)]  text-gray-500 text-lg">
          <Loader />
        </div>
      ) : posts.length > 0 ? (
        <section className="max-sm:max-w-[420px] py-5 sm:p-5 mx-auto grid gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </section>
      ) : (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No posts found. Try creating one!
        </div>
      )}
    </div>
  );
};

export default Dashboard;
