export class MediaEntity {
  constructor(
    public readonly id: string,
    public filename: string,
    public originalName: string,
    public mimeType: string,
    public size: number,
    public url: string,
    public uploadedBy: string,
    public bucket: string | null,
    public key: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Vérifier si c'est une image
   */
  isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  /**
   * Obtenir l'extension du fichier
   */
  getExtension(): string {
    return this.filename.split('.').pop() || '';
  }

  /**
   * Formater la taille en KB, MB, etc.
   */
  getFormattedSize(): string {
    if (this.size < 1024) {
      return `${this.size} B`;
    } else if (this.size < 1024 * 1024) {
      return `${(this.size / 1024).toFixed(2)} KB`;
    } else {
      return `${(this.size / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
}
