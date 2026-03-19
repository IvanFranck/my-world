"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import LocaleLink from "@/src/components/ui/LocaleLink";
import TiptapEditor from "@/src/components/ui/tiptap-editor/TiptapEditor";
import { AuthProvider } from "@/src/core/providers/auth-provider/AuthProvider";
import { ArrowLeft, ChevronLeft, Eye, Plus, Save } from "lucide-react";
import { useState } from "react";

const CreatePostsPage = () => {
  const [content, setContent] = useState("");
  return (
    <AuthProvider>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <LocaleLink href="/admin/posts">
              <Button variant="link" className="">
                <ChevronLeft className="size-8 text-nest-red" />
              </Button>
            </LocaleLink>

            <div className="space-y-2">
              <h1 className="heading-2">Nouvel Article</h1>
              <p className="text-gray-600">
                Rédigez un nouvel article pour votre blog.
              </p>
            </div>
          </div>

          <div className="flex-center gap-2">
            <Button size="primary" variant="outline-primary">
              <span>Apercu</span>
              <Eye className="size-5" />
            </Button>
            <Button size="primary" variant="primary">
              <span>Publier</span>
              <Save className="size-5" />
            </Button>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-muted-foreground/20">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Input
                    id="title"
                    placeholder="Titre de l'article..."
                    className="text-2xl font-bold h-14 px-4 border-none bg-muted/30 focus-visible:ring-1"
                  />
                  {/* {errors.title && (
                    <span className="text-destructive text-sm px-2">
                      Le titre est requis
                    </span>
                  )} */}
                </div>

                <div className="space-y-2">
                  <TiptapEditor content={content} onChange={setContent} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default CreatePostsPage;
