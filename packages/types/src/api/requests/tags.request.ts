export interface CreateTagRequest {
  name: string;
  slug?: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}
