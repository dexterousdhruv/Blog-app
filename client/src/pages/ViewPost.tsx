import useUserInfo from '@/hooks/use-user-info';
import { apiCall } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router-dom'

const ViewPost = () => {
  const { id } = useParams()
  const { userInfo } = useUserInfo();

  const getPost = (): Promise<any> => {
    return apiCall("GET", `/posts/${id}`, userInfo?.token); 
  };

  const { data } = useQuery({
    queryKey: ["post"],
    queryFn: getPost,
    refetchOnMount: "always",
    select: (data) => data?.data,
  });

  const post = data || null;
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen font-medium font-poppins'>
  
    <h1 className='text-3xl mt-10 p-3 text-center font-general-sans font-semibold tracking-wide max-w-3xl mx-auto md:text-4xl'
    >
      {post && post.title}
    </h1>
   
    <img
      src={post && post.cover}
      alt={post && `img_${post.id}`}
      className='mt-10 mx-5 w-full p-3 max-h-[400px] self-center max-w-2xl object-cover'
    />
    <div className=" flex justify-between p-3 border-b border-slate-300 dark:border-slate-500 mx-auto w-full  max-w-2xl text-xs ">
      <span>{post && new Date(post.createdAt).toLocaleDateString() }</span>
      <span className='italic'>{post && (post?.content?.length / 1000).toFixed(0)} mins read</span>
    </div>
    <div
      className="p-3 max-w-2xl mx-auto w-full post-content"
      dangerouslySetInnerHTML={{__html: post && post.content}}
    ></div>
    </main>
  )
}

export default ViewPost