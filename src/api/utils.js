import axios from "axios";

// Upload image and return image url
const imageUpload = async (imageData) => {
  const formData = new FormData();
  formData.append("image", imageData);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMgBB_URL_KEY}`,
    formData
  );
  return data.data.display_url;
};
export default imageUpload;

export const saveToUser = async (user) => {
  await axios.post(`${import.meta.env.VITE_API_URL}/users/${user?.email}`, {
    name: user?.displayName,
    email: user?.email,
    image: user?.photoURL,
  });
};
