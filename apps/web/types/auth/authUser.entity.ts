import { Entity } from "@/core/types/entity";

export interface AuthUserEntity extends Entity {
  name: string;
  email: string;
  image: string | null;
}
