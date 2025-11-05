import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <svg className="h-12 w-12 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Coke Admin Portal</h1>
        <p className="text-xl text-muted-foreground">Professional dashboard for administrators</p>
        <Button onClick={() => navigate("/auth")} size="lg" className="mt-4">
          Access Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
