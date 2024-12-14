import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  return (
    <Link to="/">
      <Button variant="outline" size="icon" className="shrink-0">
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export default BackButton;