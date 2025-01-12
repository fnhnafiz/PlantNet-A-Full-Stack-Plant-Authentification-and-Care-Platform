import { Helmet } from "react-helmet-async";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import imageUpload from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

// import axios from "axios";

const AddPlant = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // image preview korar jonno za za korte hobe first a ekta state declare korte hobe;
  const [uploadImage, setUploadImage] = useState({
    image: { name: "Upload image" },
  });

  const [loading, setLoading] = useState(false);

  const handleAddPlant = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);

    const image = form.image.files[0];
    // console.log(image);

    const imageUrl = await imageUpload(image);
    // console.log(imageUrl);

    // seller information for justify and find that who is post the add plants;
    const sellerInfo = {
      email: user?.email,
      name: user?.displayName,
      image: user?.photoURL,
    };

    const addPlants = {
      name,
      description,
      category,
      price,
      quantity,
      image: imageUrl,
      sellerInfo,
    };
    // console.log(addPlants);
    // console.table(addPlants);
    try {
      await axiosSecure.post("/add-plants", addPlants);
      toast.success("Post Succuessfully!!");
      // console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // await axios.post(`${import.meta.env.VITE_API_URL}`, addPlants);
  };

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        loading={loading}
        uploadImage={uploadImage}
        setUploadImage={setUploadImage}
        handleAddPlant={handleAddPlant}
      />
    </div>
  );
};

export default AddPlant;
