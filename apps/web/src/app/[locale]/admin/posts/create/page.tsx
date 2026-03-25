"use client";

import { CreatePostParamsBloc } from "@/src/components/app/posts/create-post/CreatePostParamsBloc";
import { FormInput } from "@/src/components/form/ui/FormInput";
import { FormSelect } from "@/src/components/form/ui/FormSelect";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Form } from "@/src/components/ui/form";
import LocaleLink from "@/src/components/ui/LocaleLink";
import TiptapEditor from "@/src/components/ui/tiptap-editor/TiptapEditor";
import { AuthProvider } from "@/src/core/providers/auth-provider/AuthProvider";
import { useCreatePost } from "@/src/hooks/layout/posts/useCreatePost";
import { ChevronLeft, Eye, Save, Settings } from "lucide-react";

const CreatePostsPage = () => {
  const { form, onSubmit } = useCreatePost();

  const { watch, setValue, handleSubmit, control } = form;

  const content = watch("content");
  const onContentChange = (value: string) => {
    setValue("content", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <AuthProvider>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container mx-auto py-8 space-y-6"
        >
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
              <Button type="button" size="primary" variant="outline-primary">
                <span>Apercu</span>
                <Eye className="size-5" />
              </Button>
              <Button type="submit" size="primary" variant="primary">
                <span>Publier</span>
                <Save className="size-5" />
              </Button>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-muted-foreground/20">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <FormInput
                      control={control}
                      name="title"
                      placeholder="Titre de l'article..."
                      inputClassName="text-2xl! font-bold h-14 px-4 border-none bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary-50"
                    />
                    {/* {errors.title && (
                    <span className="text-destructive text-sm px-2">
                      Le titre est requis
                    </span>
                  )} */}
                  </div>

                  <div className="space-y-2">
                    <TiptapEditor
                      content={content}
                      onChange={onContentChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              <CreatePostParamsBloc />
            </div>
          </div>
        </form>
      </Form>
    </AuthProvider>
  );
};

export default CreatePostsPage;
