export function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
