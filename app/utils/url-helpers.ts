/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -
  }
  
  /**
   * Creates a job URL with SEO-friendly slug
   */
  export function createJobUrl(jobId: string, jobTitle: string): string {
    const slug = slugify(jobTitle);
    return `/user/jobs/${jobId}/${slug}`;
  }
  
  /**
   * Creates a company URL with SEO-friendly slug
   */
  export function createCompanyUrl(companyId: string, companyName: string): string {
    const slug = slugify(companyName);
    return `/companies/${companyId}/${slug}`;
  }
  