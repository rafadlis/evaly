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
import { useParticipantProfile } from "@/query/participants/profile/use-participant-profile";
import { User } from "lucide-react";

const ParticipantAccount = () => {
  const { data } = useParticipantProfile();
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
              <AvatarImage src={image} alt="User" />
            ) : (
              <AvatarFallback>{email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hi {name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/profile`)}>
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("/logout");
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ParticipantAccount;
