import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { trpc } from "@/trpc/trpc.client";
import { Building2, Home, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

const AdminAccount = () => {
  const { data } =  trpc.organization.profile.useQuery()
  const router = useRouter();

  const name = data?.user?.name;
  const email = data?.user?.email;
  const image = data?.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
          <Avatar className="h-8 w-8">
            {image ? (
              <AvatarImage src={image} alt="User" asChild>
                <Image src={image} alt="User" width={32} height={32} className="rounded-full size-8" />
              </AvatarImage>
            ) : (
              <AvatarFallback>{email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hi {name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings?tab=profile")}
        >
          <User className="size-3.5 mr-1" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings?tab=organization")}
        >
          <Building2 className="size-3.5 mr-1" />
          Organization
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings?tab=general")}
        >
          <Settings className="size-3.5 mr-1" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/")}
        >
          <Home className="size-3.5 mr-1" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push("/logout");
          }}
        >
          <LogOut className="size-3.5 mr-1" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminAccount;
