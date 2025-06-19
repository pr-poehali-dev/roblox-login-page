import LoginForm from "@/components/LoginForm";
import GamingBackground from "@/components/GamingBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <GamingBackground />
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
