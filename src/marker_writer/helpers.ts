export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function extractLastParagraph(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return '';
  const paragraphs = trimmed.split(/\n\s*\n/);
  return (paragraphs[paragraphs.length - 1] || '').trim();
}

export function extractFirstParagraph(text: string): string {
  const trimmed = text.trimStart();
  if (!trimmed) return '';
  const paragraphs = trimmed.split(/\n\s*\n/);
  return (paragraphs[0] || '').trim();
}
