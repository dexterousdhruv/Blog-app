import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiCall } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignupSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function Register() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const register = (userData: any) => {
    return apiCall("POST", `/auth/register`, null, null, userData);
  };

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onMutate: () => {},
    onSuccess: (res) => {
      console.log(res?.data?.message);
      toast.success("Signup successful!");
      navigate("/login");
      form.reset();
    },
    onError: () => {
      toast.error(" Request failed! Please try again. 😞");
    },
  });

  function onSubmit(data: z.infer<typeof SignupSchema>) {
    console.log(data);
    registerUser(data);
  }

  return (
    <div className="relative w-full min-h-dvh grid place-content-center font-poppins ">
      <div className="absolute inset-0 -z-10 h-full w-full  bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:6rem_6rem]"></div>

      <h1
        className="text-3xl font-semibold mb-8 
       text-center"
      >
        Register
      </h1>

      <div
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        className="min-w-md p-4 bg-white rounded-lg shadow"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="E.g. cjn38r43t"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-indigo-400 to-cyan-400"
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-xs text-gray-500  font-rubik">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-700 underline">
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
