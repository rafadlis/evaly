import LogIn from "@/components/shared/login";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen container">
      <Suspense>
        <LogIn />
      </Suspense>
    </div>
  );
};

export default LoginPage;
