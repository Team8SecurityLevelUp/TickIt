import { useAuth } from "./auth/useAuth"

export const App = () => {
  const user = useAuth();
  console.log(user);
  return <h1>Hello {user?.user?.username ?? 'User'} thank you using TickIt</h1>
}