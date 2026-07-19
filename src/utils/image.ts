export const getImageUrl = (path?: string) => {
    if (!path) return "/images/no-image.png";

    if (path.startsWith("http")) return path;

    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};