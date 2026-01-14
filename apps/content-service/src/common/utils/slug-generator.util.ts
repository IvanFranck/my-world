import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugGenerator {
  /**
   * Générer un slug à partir d'un titre
   */
  generate(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Décomposer les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les non-alphanumériques par des tirets
      .replace(/(^-|-$)/g, ''); // Enlever les tirets en début/fin
  }

  /**
   * Générer un slug unique en ajoutant un suffixe si nécessaire
   */
  generateUnique(title: string, existingSlugs: string[]): string {
    let slug = this.generate(title);
    let counter = 1;

    while (existingSlugs.includes(slug)) {
      slug = `${this.generate(title)}-${counter}`;
      counter++;
    }

    return slug;
  }
}
