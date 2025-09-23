import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">404</h2>
        <h3 className="text-xl font-semibold text-foreground">Page Not Found</h3>
        <p className="text-muted-foreground max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}