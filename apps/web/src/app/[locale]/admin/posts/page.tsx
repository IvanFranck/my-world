"use client";

import { Button } from "@/src/components/ui/button";
import LocaleLink from "@/src/components/ui/LocaleLink";
import { AuthProvider } from "@/src/core/providers/auth-provider/AuthProvider";
import { Plus } from "lucide-react";

const PostsPage = () => {
  return (
    <AuthProvider>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="heading-2">Articles</h1>
            <p className="text-gray-600">
              Gérez vos articles de blog, brouillons et publications.
            </p>
          </div>

          <LocaleLink href="/admin/posts/create">
            <Button size="primary" variant="primary">
              <span>Nouvel Article</span>
              <Plus />
            </Button>
          </LocaleLink>
        </div>
      </div>
    </AuthProvider>
  );
};

export default PostsPage;
