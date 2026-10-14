const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://admin-devtrend.vercel.app";

export function getImageUrl(imageUrl: string) {
  return new URL(imageUrl, IMAGE_BASE_URL).toString();
}
