const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function getImageUrl(imageUrl: string) {
  return new URL(imageUrl, IMAGE_BASE_URL).toString();
}
