import { ArticleStatus } from 'generated/prisma/enums';

/**
 * Article - Domain entity
 * Contains pure business logic
 */
export class ArticleEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public slug: string,
    public status: ArticleStatus,
    public authorId: string,
    public excerpt: string | null,
    public coverImage: string | null,
    public metaTitle: string | null,
    public metaDescription: string | null,
    public publishedAt: Date | null,
    public scheduledAt: Date | null,
    public views: number = 0,
    public readonly createdAt: Date | null,
    public readonly updatedAt: Date | null,
  ) {}

  /**
   * publish an article
   */
  publish(): void {
    if (this.status === ArticleStatus.PUBLISHED) {
      throw new Error('Article already published');
    }

    this.status = ArticleStatus.PUBLISHED;
    this.publishedAt = new Date();
    this.scheduledAt = null;
  }

  /**
   * schedule publication
   */
  schedule(date: Date): void {
    if (date <= new Date()) {
      throw new Error('Scheduled date must be in the future');
    }

    this.status = ArticleStatus.SCHEDULED;
    this.scheduledAt = date;
    this.publishedAt = null;
  }

  /**
   * Archive article
   */
  archive(): void {
    if (this.status !== ArticleStatus.PUBLISHED) {
      throw new Error('Only published articles can be archived');
    }

    this.status = ArticleStatus.ARCHIVED;
  }

  /**
   * Put in draft
   */
  unpublish(): void {
    this.status = ArticleStatus.DRAFT;
    this.publishedAt = null;
    this.scheduledAt = null;
  }

  /**
   * Check whether the article is published and visible
   */
  isPubliclyVisible(): boolean {
    if (this.status !== ArticleStatus.PUBLISHED) {
      return false;
    }

    if (!this.publishedAt) {
      return false;
    }

    return this.publishedAt <= new Date();
  }

  /**
   * Increase views
   */
  incrementViews(): void {
    this.views += 1;
  }

  /**
   * Generate the excerpt automatically if missing
   */
  generateExcerpt(maxLength: number = 200): void {
    if (this.excerpt) {
      return;
    }

    // remove markdown and HTML tags
    const plainText = this.content
      .replace(/[#*`>[\]]/g, '')
      .replace(/\n/g, ' ')
      .trim();

    this.excerpt =
      plainText.substring(0, maxLength) +
      (plainText.length > maxLength ? '...' : '');
  }
}
