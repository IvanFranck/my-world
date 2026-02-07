export class CategoryEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public description: string | null,
    public color: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Valider la couleur hexadécimale
   */
  isValidColor(): boolean {
    if (!this.color) return true;
    return /^#[0-9A-Fa-f]{6}$/.test(this.color);
  }
}
