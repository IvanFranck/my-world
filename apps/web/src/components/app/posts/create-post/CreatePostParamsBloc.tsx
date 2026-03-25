import { FormInput } from "@/src/components/form/ui/FormInput";
import {
  FormSelect,
  FormSelectOption,
} from "@/src/components/form/ui/FormSelect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CreatePostFormData } from "@/src/services/posts/schemas";
import { Settings } from "lucide-react";
import { useFormContext } from "react-hook-form";

const statusOptions: FormSelectOption<string>[] = [
  {
    value: "brouillon",
    label: "Brouillon",
  },
  {
    value: "Publié",
    label: "Publié",
  },
  {
    value: "Archivé",
    label: "Archivé",
  },
];

const categoriesOptions: FormSelectOption<string>[] = [
  {
    value: "nestjs",
    label: "NestJS",
  },
  {
    value: "aws",
    label: "AWS & Cloud",
  },
  {
    value: "react",
    label: "React",
  },
];

export const CreatePostParamsBloc = () => {
  const { control } = useFormContext<CreatePostFormData>();
  return (
    <Card className="shadow-sm border-muted-foreground/20">
      <CardHeader className="">
        <CardTitle className="heading-4 text-slate-400 flex items-center">
          <Settings className="size-4 mr-2" /> Paramètres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <FormSelect
          control={control}
          defaultValue="brouillon"
          name="status"
          triggerClassName="w-full"
          variant="default"
          label="Statut de publication"
          options={statusOptions}
        />
        <FormSelect
          control={control}
          defaultValue="aws"
          name="categoryIds"
          triggerClassName="w-full"
          variant="default"
          label="Categories"
          options={categoriesOptions}
        />
        <FormInput
          control={control}
          name="slug"
          label="Slug"
          inputClassName="text-slate-400"
          placeholder="titre-de-l-article"
          disabled
        />
      </CardContent>
    </Card>
  );
};
