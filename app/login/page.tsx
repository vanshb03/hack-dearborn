import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 dark:bg-foreground dark:text-background">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground dark:text-card-foreground">
            Enter your email and password to access your account.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-card-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="dark:bg-card dark:text-card-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-card-foreground">
              Password
            </Label>
            <Input id="password" type="password" required className="dark:bg-card dark:text-card-foreground" />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            <ChromeIcon className="mr-2 h-4 w-4" />
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChromeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}