import { Link } from "@/components/shared/progress-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between px-8 py-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="h-7 w-7 text-lg bg-background text-foreground flex items-center justify-center font-bold mr-3 shadow-[2px_2px_0px_0px_var(--primary)] border-2 border-primary rounded-[8px]">
            E
          </div>
          <span className="text-2xl font-bold hidden sm:block">evaly</span>
        </Link>
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      // src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>FA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

      </div>
  )
}

export default Navbar