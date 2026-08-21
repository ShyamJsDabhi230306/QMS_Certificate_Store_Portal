const AIRA_IMAGE_BASE_URL = "https://nexusapi.core1.in";

export const getAiraImageUrl = (imagePath) => {
    if (!imagePath) {
        return "/default-user.png";
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    return `${AIRA_IMAGE_BASE_URL}${
        imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
};