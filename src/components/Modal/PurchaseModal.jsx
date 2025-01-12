/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Shared/Button/Button";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { name, price, quantity, category, _id } = plant;
  console.log(user?.email, user?.displayName);
  const axiosSecure = useAxiosSecure();
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);
  const [purchaseInfo, setPurchaseInfo] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    plantId: _id,
    price: totalPrice,
    quantity: totalQuantity,
    address: "",
    status: "Pending",
  });
  // Total Price Calculation

  const handleMaxQuantity = (value) => {
    if (value > quantity) {
      setTotalQuantity(quantity);
      return toast.error("Quantity exceeds available stock!!");
    }
    if (value < 0) {
      setTotalQuantity(1);
      return toast.error("Quantity can not be less than 1");
    }
    setTotalQuantity(value);
    setTotalPrice(value * price);
    setPurchaseInfo((prev) => {
      return { ...prev, quantity: value, price: value * price };
    });
  };

  // Purchase plant and order plant
  const handlePurchase = async () => {
    console.log(totalQuantity);
    console.log({ purchaseInfo });
    console.log(_id);
    // const updateTotalQuantity
    // post in databse when click the purchase the plant
    try {
      await axiosSecure.post("/order", purchaseInfo);

      // create and manage to patch method for change quantity property
      await axiosSecure.patch(`/plant/quantity/${_id}`, {
        updatedQuantity: totalQuantity,
        status: "decrease",
      });
      toast.success("order successfully!!");
      refetch();
      navigate("/dashboard/my-orders");
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeModal();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-center leading-6 text-gray-900"
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Plant: {name}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Category: {category}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Customer: {user?.displayName}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">Price: ${price}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Available Quantity:{quantity}
                  </p>
                </div>
                <div>
                  {/* Quantity */}
                  <div className="space-x-2 text-sm mt-2">
                    <label htmlFor="quantity" className=" text-gray-600">
                      Quantity:
                    </label>
                    <input
                      // min={1}
                      // max={quantity}
                      value={totalQuantity}
                      onChange={(e) =>
                        handleMaxQuantity(parseInt(e.target.value))
                      }
                      className=" p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                      name="quantity"
                      id="quantity"
                      type="number"
                      placeholder="Available quantity"
                      required
                    />
                  </div>
                  {/* Quantity */}
                  <div className="space-x-2 text-sm mt-2">
                    <label htmlFor="quantity" className=" text-gray-600">
                      Address:
                    </label>
                    <input
                      onChange={(e) =>
                        setPurchaseInfo((prev) => {
                          return { ...prev, address: e.target.value };
                        })
                      }
                      className=" p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                      name="address"
                      id="quantity"
                      type="text"
                      placeholder="Write your home address"
                      required
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    onClick={handlePurchase}
                    label={`Pay ${totalPrice}$`}
                  ></Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PurchaseModal;
