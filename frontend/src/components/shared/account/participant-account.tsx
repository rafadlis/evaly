import { ProfilePage } from "@/app/[locale]/(participant)/_components/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParticipantProfile } from "@/query/participants/profile/use-participant-profile";
import { Image } from "@/components/ui/image";

const ParticipantAccount = () => {
  const { data } = useParticipantProfile();

  const name = data?.user?.name;
  const email = data?.user?.email;
  const image = data?.user?.image;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full h-8 w-8 p-0">
          <Avatar className="h-8 w-8">
            {image ? (
              <AvatarImage src={image} alt="User" asChild>
                <Image
                  src={image}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full size-8"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>{email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hi {name}</DialogTitle>
          <DialogDescription>
            Manage your profile settings. You can update your profile
            information.
          </DialogDescription>
        </DialogHeader>
        <ProfilePage />
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantAccount;
