import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiCall } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { app } from "@/lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import QuillEditor from "@/components/QuillEditor";
import { Progress } from "@/components/ui/progress";
import useUserInfo from "@/hooks/use-user-info";

const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  cover: z.string().url("Cover must be a valid image URL."),
  content: z.string().min(10, "Content must be at least 3 characters."),
});

export type PostFormData = z.infer<typeof PostSchema>;

const CreatePost = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo()
  const [imageUploadProgress, setImageUploadProgress] = useState<
    string | number | null
  >(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      cover: "",
      content: "",
    },
  });

  const createPost = (data: PostFormData) => {
    return apiCall("POST", "/posts", userInfo?.token, null, data);
  };

  const { mutate: submitPost, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to create post. Try again.");
    },
  });

  const onSubmit = (data: PostFormData) => {
    submitPost(data)
  };

  // handle image file upload and set cover field
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = !!e.target?.files?.length && e.target.files[0];

    if (!imageFile) {
      return toast.error("Please select an image");
    }

    const storage = getStorage(app);
    const filename = new Date().getTime() + "_" + imageFile.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        toast.error("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        toast.success("Image successfully uploaded!");
          form.setValue("cover", downloadURL);
          setImageUploadProgress("");
        });
      }
    );
  };

  return (
    <div className="relative w-full min-h-dvh grid place-content-center font-poppins">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:6rem_6rem]" />

      <h2 className="text-2xl md:text-3xl text-[#00212C] text-center font-semibold mb-8">
        Create New Post 
      </h2>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] rounded-lg font-inter">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image Upload */}
            <FormItem>
              <FormLabel>Cover Image Upload</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {imageUploadProgress && (
              <div className="w-full space-y-2">
                <Progress
                  value={imageUploadProgress as number}
                  className=" bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-cyan-400"
                />

                
                <div className="text-right text-sm font-medium text-indigo-400">
                  {imageUploadProgress}% uploaded
                </div>
              </div>
            )}


            
            {form.watch("cover") && (
              <div className="mt-2">
                <img
                  src={form.watch("cover")}
                  alt="Cover Preview"
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <QuillEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full text-white bg-gradient-to-r from-indigo-400 to-cyan-400"
            >
              {isPending ? "Posting..." : "Create Post"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
