import { useNavigate, } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, MoveLeft } from "lucide-react";

type Error = {
  statusText?: string;
  message?: string;
};

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className=" grid place-content-center w-full h-full min-h-screen">
      <div className={`container mx-auto  flex flex-col gap-5 sm:flex-row  items-center justify-center w-fit`}>
        <div className="">
        <img src="/error.svg" alt="" className=" w-fit min-w-70 sm:min-w-80 " />
        </div>
        <div className="space-y-6 w-full max-w-sm lg:w-80 ">
          <h1 className="text-center text-zinc-800 text-5xl sm:text-6xl font-geist font-semibold max-w-[50ch]">
            Uh-oh!
          </h1>

          <p className="font-inter   text-zinc-500 text-center font-">
            Where we are, there's only air,
            <br />
            Not all paths lead where we care.
          </p>

          <div className="w-fit mx-auto flex gap-4">
            <Button
              size={"sm"}
              className=" font-inter rounded-sm"
              onClick={() => navigate(-1)}
            >
              <MoveLeft /> Go Back 
            </Button>

            <Button
              size={"sm"}
              className=" font-inter rounded-sm"
              onClick={() => navigate("/")}
            >
              <Home  /> Go to Home 
            </Button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Error;


 


 