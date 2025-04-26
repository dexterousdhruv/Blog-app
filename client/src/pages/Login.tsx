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
import useUserInfo from "@/hooks/use-user-info";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function Login() {
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfo();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = (userData: any) => {
    return apiCall("POST", `/auth/login`, null, null, userData);
  };

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      toast.success("Login successful!");
      setUserInfo({...res?.data, loginAt: Date.now()});
      form.reset();
      navigate("/");
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    loginUser(data);
  }

  return (
    <div className="relative w-full min-h-dvh grid place-content-center font-poppins">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:6rem_6rem]" />

      <h1 className="text-3xl font-semibold mb-8 text-center">Login</h1>

      <div className="min-w-md p-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
          >
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
              Login
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-xs text-gray-500  font-rubik">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-700 underline">
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
