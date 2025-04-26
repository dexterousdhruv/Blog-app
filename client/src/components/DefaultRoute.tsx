import useUserInfo from "@/hooks/use-user-info";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const DefaultRoute = ({ children }: Props) => {
  const { userInfo } = useUserInfo();
  const { loginAt } = userInfo;

  const isTokenExpired = (): boolean => {
    if (!loginAt) return true;
    const now = Date.now();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000; 
    return now - loginAt > twentyFourHoursInMs;
  };

  if (isTokenExpired()) {
    return children
  }
  
  return <Navigate to="/" />;
};

export default DefaultRoute;
