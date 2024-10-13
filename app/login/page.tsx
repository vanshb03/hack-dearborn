import { login, initiateGoogleLogin } from './actions'

export default function LoginPage() {
  return (
    <div>
      <form action={login}>
        <input name="email" type="email" required />
        <input name="password" type="password" required />
        <button type="submit">Log in</button>
      </form>
      
      <form action={initiateGoogleLogin}>
        <button type="submit">Sign in with Google</button>
      </form>
    </div>
  )
}