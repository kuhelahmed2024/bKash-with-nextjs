"use client";
import Image from "next/image";
import LaptopImage from "@/public/laptop.jpg"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [paynetData, setPaynetData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const handlePayment = async () => {
    try {
      const { data } = await axios.post("/api/make-payment", paynetData);
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
  return (
    <div className="w-screen h-screen flex p-10">
      <div className="w-1/3 h-full flex justify-center items-center">
        <div className="w-full h-2/3">
          <Image src={LaptopImage} alt="Laptop" className="rounded-lg" />
        </div>
      </div>
      <div className="w-2/3 h-full flex flex-col justify-center items-center gap-5">
        <div className="w-2/3 h-auto flex flex-col gap-3">
          <h1 className="text-2xl font-bold">
            Late 2019 Apple MacBook Pro with 2.6GHz Intel Core i7 (16-Inch, 16GB RAM, 512GB Storage) - Silver (Renewed)
          </h1>
          <p className="text-sm">
            This pre-owned or refurbished product has been professionally inspected and tested to work and look like new. How a product becomes part of Amazon Renewed, your destination for pre-owned, refurbished products: A customer buys a new product and returns it or trades it in for a newer or different model. That product is inspected and tested to work and look like new by Amazon-qualified suppliers. Then, the product is sold as an Amazon Renewed product on Amazon. If not satisfied with the purchase, renewed products are eligible for replacement or refund under the Amazon Renewed Guarantee.
          </p>
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3">
          <div className="w-80 h-auto flex flex-col justify-center items-center gap-3">
            <input onChange={(d) => setPaynetData({ ...paynetData, name: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Name" />
            <input onChange={(d) => setPaynetData({ ...paynetData, email: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Email" />
            <input onChange={(d) => setPaynetData({ ...paynetData, phone: d.target.value })} type="text" className="w-full h-10 rounded-lg border-2 border-gray-300 p-2" placeholder="Phone Number" />
            <button onClick={() => handlePayment()} className="w-full h-10 rounded-lg bg-blue-500 text-white font-bold">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
