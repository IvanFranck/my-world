export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}
