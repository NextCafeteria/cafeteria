import Image from "next/image";

export default function Home() {
  // Get Food options from /food_options.json
  const foodOptions = require("./food_options.json");

  return (
    <main className="flex min-h-screen justify-center">
      <div className="z-10 max-w-[800px] mx-auto font-mono text-sm overflow-hidden">
        <p className="block w-full justify-center border-b-2 border-gray-300 pb-6 pt-8 text-2xl">
          Cafeteria
        </p>

        {/* Display food options */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {foodOptions.map((foodOption: any) => (
            <div
              key={foodOption.name}
              className="flex flex-col justify-between p-4 border-2 border-gray-300 rounded-md"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xl">{foodOption.name}</p>
                <p className="text-gray-500">{foodOption.description}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">From ${foodOption.price}</p>
              </div>
              <div className="border-b-2 border-gray-300 mt-2 mb-2"></div>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-gray-200 rounded-md">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
