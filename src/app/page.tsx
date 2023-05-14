"use client";
import Image from "next/image";

export default function Home() {
  // Get Food options from /food_options.json
  const foodOptions = require("./food_options.json");

  return (
    <main className="flex justify-center p-2">
      <div className="max-w-[600px] mx-auto font-mono text-sm">
        <p className="block w-full justify-center border-b-2 border-gray-800 pb-3 pt-2 text-2xl px-2 mb-2">
          Cafeteria
        </p>
        <div className="flex flex-wrap justify-center w-full">
          {foodOptions.map((foodOption) => (
            <div className="flex flex-col items-center justify-center w-full p-4 border-[1px] border-gray-600 min-h-[200px] my-1 mx-1 rounded-md">
              <div className="flex flex-col items-begin justify-center w-full relative">
                <Image
                  src={foodOption.image}
                  alt={foodOption.name}
                  width={128}
                  height={128}
                  className="absolute right-0 top-0"
                />
                <p className="text-xl font-bold">{foodOption.name}</p>
                <p className="text-sm">{foodOption.description}</p>
                <p className="text-sm">${foodOption.price}</p>
                <button
                  className="px-2 py-1 mt-4 text-sm text-gray-800 bg-gray-300 rounded-md w-[140px]"
                  onClick={() => alert("Added to cart!")}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-[700px] fixed bottom-2 h-[50px] border-2 border-gray-600 p-2 bg-blue-100 rounded-md">
        <span className="text-2xl">Cart</span>
        <span className="text-sm"> • 0 item</span>
        <span className="text-2xl float-right">$0.00</span>
      </div>
    </main>
  );
}
