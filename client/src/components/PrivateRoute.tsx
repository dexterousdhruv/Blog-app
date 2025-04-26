import useUserInfo from '@/hooks/use-user-info'
import { apiCall } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Navigate} from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const { userInfo } = useUserInfo()
  const { token = "" , loginAt} = userInfo


  const isTokenExpired = (): boolean => {
    if (!loginAt) return true
    const now = Date.now()
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000 
    return now - loginAt > twentyFourHoursInMs
  }

  
  if (!token || isTokenExpired()) {
    return <Navigate to="/login" />
  }

  return children 
}

export default PrivateRoute 