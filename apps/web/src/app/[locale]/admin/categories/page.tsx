import { Button } from "@/src/components/ui/button";
import { AuthProvider } from "@/src/core/providers/auth-provider/AuthProvider";
import { Plus } from "lucide-react";

const CategoriesPage = () => {
  return (
    <AuthProvider>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="heading-2">Catégories</h1>
            <p className="text-gray-600">
              Gérez vos articles de blog, brouillons et publications.
            </p>
          </div>

          <Button size="primary" variant="primary">
            <span>Nouvelle Catégorie</span>
            <Plus />
          </Button>
        </div>
      </div>
    </AuthProvider>
  );
};

export default CategoriesPage;
