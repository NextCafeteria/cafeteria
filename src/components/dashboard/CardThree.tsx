import { useState } from "react";
const CardThree = () => {
  const style = `
    .underline {
      underline-position: under;
    }
    a.number-link {
      color:#155e75;
    }
    .text-timespan {
      white-space: nowrap;
    }
    
.view-detail-wrapper{
  position: absolute;
  bottom: 0;
  left: 0;
}

div.view-detail{
  position: relative;
  transition: background-color .35s, transform .35s;
}

div.view-detail:hover a{
  color: #1e3a8a;
  text-decoration: underline;
}

div.view-detail:after{
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #ccfbf1;
  transition: all .35s;
}


div.view-detail:hover:after{
  width: 100%;
}
  `;

  const [timespan, setTimespan] = useState("hôm nay"); // State for time span
  const timespans = ["tuần trước", "hôm qua", "hôm nay", "tuần này"];
  const [inventoryValue, setInventoryValue] = useState(5000000); // State for inventoryValue
  const inventoryValueList = [12_000_000, 4_000_000, 5_000_000, 15_000_000];

  // Function to handle previous time span
  const handlePrevTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index > 0) {
      setTimespan(timespans[index - 1]);
      setInventoryValue(inventoryValueList[index - 1]);
    }
  };

  // Function to handle next time span
  const handleNextTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index < timespans.length - 1) {
      setTimespan(timespans[index + 1]);
      setInventoryValue(inventoryValueList[index + 1]);
    }
  };

  return (
    <div className="relative pb-[3rem] rounded-sm  bg-white py-6 px-6 border border-stroke dark:border-strokedark dark:bg-gray-800 shadow-default">
      <style>{style}</style>
      <div className="main-stat">
        <div className="flex gap-1 items-center mb-[0.3rem]">
          <div className="flex items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.4856 1.12584C12.1836 0.958052 11.8164 0.958052 11.5144 1.12584L2.51436 6.12584L2.5073 6.13784L2.49287 6.13802C2.18749 6.3177 2 6.64568 2 7V16.9999C2 17.3631 2.19689 17.6977 2.51436 17.874L11.5022 22.8673C11.8059 23.0416 12.1791 23.0445 12.4856 22.8742L21.4856 17.8742C21.8031 17.6978 22 17.3632 22 17V7C22 6.64568 21.8125 6.31781 21.5071 6.13813C21.4996 6.13372 21.4921 6.12942 21.4845 6.12522L12.4856 1.12584ZM5.05923 6.99995L12.0001 10.856L14.4855 9.47519L7.74296 5.50898L5.05923 6.99995ZM16.5142 8.34816L18.9409 7L12 3.14396L9.77162 4.38195L16.5142 8.34816ZM4 16.4115V8.69951L11 12.5884V20.3004L4 16.4115ZM13 20.3005V12.5884L20 8.69951V16.4116L13 20.3005Z"
                className="fill-primary dark:fill-white"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0f766e] mt-[0.2rem] leading-none select-none">
            Giá trị hàng tồn kho
          </span>
        </div>
        <div className="flex">
          <span className="text-title-xl font-bold text-black dark:text-white">
            30,000,000đ
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-[0.2rem] items-start justify-between">
        <div className="flex flex-col w-[110px] text-center">
          <a
            className="clickable text underline font-bold text-black dark:text-white select-none"
            title="Click để xem các nguyên liệu sắp hết hạn"
          >
            Sắp hết hạn
          </a>
          <span className="text-md font-bold ms-1">5,000,000đ</span>
        </div>
        <div className="self-stretch w-[1px] bg-gray-200"></div>
        <div className="flex flex-col w-[90px] text-center">
          <span className="text font-bold text-black dark:text-white select-none">
            Bán chậm
          </span>
          <span className="text-md font-bold ms-1">19%</span>
        </div>
        <div className="self-stretch w-[1px] bg-gray-200"></div>
        <div className="flex flex-col w-[80px] text-center">
          <span className="text font-bold text-black dark:text-white select-none">
            Nhập về
          </span>
          <span className="text-md font-bold ms-1">9,500,000đ</span>
        </div>
      </div>
      <div className="view-detail-wrapper clickable card-head absolute bottom-0 left-0 w-full flex gap-1 justify-center items-center h-[2rem] border-t border-stroke  shadow-default dark:border-strokedark dark:bg-gray-800">
        <div className="view-detail w-full h-full flex">
          <a className="m-auto z-10 text-cyan-600 select-none hover:underline">
            Quản lý kho hàng
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardThree;
