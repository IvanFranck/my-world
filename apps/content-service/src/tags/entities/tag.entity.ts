export class TagEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
