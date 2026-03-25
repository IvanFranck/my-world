import { FormTextarea } from "@/src/components/form/ui/FormTextArea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CreatePostFormData } from "@/src/services/posts/schemas";
import { useFormContext } from "react-hook-form";

export const CreatePostMetaAndSeoBloc = () => {
  const { control } = useFormContext<CreatePostFormData>();

  return (
    <Card className="shadow-sm border-muted-foreground/20">
      <CardHeader className="">
        <CardTitle className="heading-4 text-slate-400 flex items-center">
          Méta & SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 w-full overflow-hidden relative">
        <FormTextarea
          control={control}
          name="metaDescription"
          placeholder="Bref résumé pour les cartes et le SEO..."
          label="Extrait"
          rows={10}
          inputClassName="text-wrap"
        />
      </CardContent>
    </Card>
  );
};
