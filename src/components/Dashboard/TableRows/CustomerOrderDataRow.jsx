import PropTypes from "prop-types";
import { useState } from "react";
import DeleteModal from "../../Modal/DeleteModal";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
const CustomerOrderDataRow = ({ order, refetch }) => {
  let [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const axiosSecure = useAxiosSecure();
  // console.log(order);

  const { image, name, category, price, quantity, _id, status, plantId } =
    order;

  const handleDeleteOrder = async () => {
    try {
      await axiosSecure.delete(`/my-orders/${_id}`);
      // console.log("Close modal id", _id);
      await axiosSecure.patch(`/plant/quantity/${plantId}`, {
        updatedQuantity: quantity,
        status: "increase",
      });
      toast.success("Order Cancelled.");
      refetch();
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      closeModal();
    }
  };

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="block relative">
              <img
                alt="profile"
                src={image}
                className="mx-auto object-cover rounded h-10 w-15 "
              />
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{name}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{category}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${price}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{status}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 leading-tight"
        >
          <span className="absolute cursor-pointer inset-0 bg-red-200 opacity-50 rounded-full"></span>
          <span className="relative cursor-pointer">Cancel</span>
        </button>

        <DeleteModal
          handleDeleteOrder={handleDeleteOrder}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      </td>
    </tr>
  );
};

CustomerOrderDataRow.propTypes = {
  order: PropTypes.object,
  refetch: PropTypes.func,
};

export default CustomerOrderDataRow;
