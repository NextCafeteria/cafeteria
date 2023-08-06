import { useState } from "react";
const CardOne = ({ totalRevenue }: { totalRevenue: number }) => {
  const style = `
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
  const [revenue, setRevenue] = useState(5000000); // State for revenue
  const revenueList = [12_000_000, 4_000_000, 5_000_000, 15_000_000];

  // Function to handle previous time span
  const handlePrevTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index > 0) {
      setTimespan(timespans[index - 1]);
      setRevenue(revenueList[index - 1]);
    }
  };

  // Function to handle next time span
  const handleNextTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index < timespans.length - 1) {
      setTimespan(timespans[index + 1]);
      setRevenue(revenueList[index + 1]);
    }
  };

  return (
    <div className="relative pb-[3rem] rounded-sm  bg-white py-6 px-6 border border-stroke dark:border-strokedark dark:bg-gray-800 shadow-default">
      <style>{style}</style>
      <div className="main-stat">
        <div className="flex gap-1 items-center mb-[0.3rem]">
          <div className="flex items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="20"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.32 8a3 3 0 0 0-2-.7H5.63A1.59 1.59 0 0 1 4 5.69a2 2 0 0 1 0-.25 1.59 1.59 0 0 1 1.63-1.33h4.62a1.59 1.59 0 0 1 1.57 1.33h1.5a3.08 3.08 0 0 0-3.07-2.83H8.67V.31H7.42v2.3H5.63a3.08 3.08 0 0 0-3.07 2.83 2.09 2.09 0 0 0 0 .25 3.07 3.07 0 0 0 3.07 3.07h4.74A1.59 1.59 0 0 1 12 10.35a1.86 1.86 0 0 1 0 .34 1.59 1.59 0 0 1-1.55 1.24h-4.7a1.59 1.59 0 0 1-1.55-1.24H2.69a3.08 3.08 0 0 0 3.06 2.73h1.67v2.27h1.25v-2.27h1.7a3.08 3.08 0 0 0 3.06-2.73v-.34A3.06 3.06 0 0 0 12.32 8z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0f766e] mt-[0.2rem] leading-none select-none">
            Tổng doanh thu
          </span>
        </div>
        <div className="flex">
          <span className="text-title-xl font-bold text-black dark:text-white">
            {Math.round(totalRevenue).toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
      {/* <div className="mt-4 flex gap-[0.4rem] items-start justify-between">
        <div className="flex flex-col ms-1">
          <span className="text-md font-bold">
            +{revenue.toLocaleString("vi-VN")}đ
          </span>
          <div className="flex gap-1 items-center justify-center mt-1 ms-[-5px]">
            <div className="w-[20px] select-none">
              {timespans.indexOf(timespan) > 0 && (
                <div
                  className="clickable flex items-center h-5 bg-cyan-50 p-1 border border-stroke dark:border-strokedark dark:bg-gray-800"
                  onClick={handlePrevTimespan}
                >
                  <svg
                    fill="#000000"
                    height="full"
                    width="full"
                    version="1.1"
                    id="XMLID_287_"
                    viewBox="0 0 24 24"
                  >
                    <g id="next">
                      <g>
                        <polygon points="17.2,23.7 18.6,22.3 8.3,12 18.6,1.7 17.2,0.3 5.5,12 		" />
                      </g>
                    </g>
                  </svg>
                </div>
              )}
            </div>
            <span className="text-timespan text-xs select-none">
              {timespan}
            </span>
            <div className="w-[20px]  select-none">
              {timespans.indexOf(timespan) < timespans.length - 1 && (
                <div
                  className="clickable flex items-center h-5 bg-cyan-50 p-1 border border-stroke dark:border-strokedark dark:bg-gray-800"
                  onClick={handleNextTimespan}
                >
                  <svg
                    fill="#000000"
                    height="full"
                    width="full"
                    version="1.1"
                    id="XMLID_287_"
                    viewBox="0 0 24 24"
                  >
                    <g id="next">
                      <g>
                        <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12 		" />
                      </g>
                    </g>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="self-stretch w-[1px] bg-gray-200"></div>
        <div className="flex flex-col">
          <span className="text font-bold text-black dark:text-white select-none">
            Lợi nhuận ước tính:
          </span>
          <a
            className="number-link text-md font-bold underline ms-1 clickable"
            title="Click để xem bảng cân đối kế toán"
          >
            32,000,000đ
          </a>
        </div>
      </div>
      <div className="view-detail-wrapper clickable card-head absolute bottom-0 left-0 w-full flex gap-1 justify-center items-center h-[2rem] border-t border-stroke  shadow-default dark:border-strokedark dark:bg-gray-800">
        <div className="view-detail w-full h-full flex">
          <a className="m-auto z-10 text-cyan-600 select-none hover:underline">
            Xem chi tiết doanh thu
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default CardOne;
