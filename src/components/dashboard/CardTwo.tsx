import { useState } from "react";
const CardTwo = ({ totalCustomer }: { totalCustomer: number }) => {
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
  const [customer, setCustomer] = useState(68); // State for customer
  const customerList = [361, 52, 68, 532];

  // Function to handle previous time span
  const handlePrevTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index > 0) {
      setTimespan(timespans[index - 1]);
      setCustomer(customerList[index - 1]);
    }
  };

  // Function to handle next time span
  const handleNextTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index < timespans.length - 1) {
      setTimespan(timespans[index + 1]);
      setCustomer(customerList[index + 1]);
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
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                fill=""
              />
              <path
                d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                fill=""
              />
              <path
                d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                fill=""
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0f766e] mt-[0.2rem] leading-none select-none">
            Khách hàng tới quán
          </span>
        </div>
        <div className="flex">
          <span className="text-title-xl font-bold text-black dark:text-white">
            {totalCustomer}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-[0.4rem] items-start justify-between">
        <div className="flex flex-col ms-1 w-[96px]">
          <span className="text-md font-bold text-center ms-[-1rem]">
            +{customer.toLocaleString("vi-VN")}
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
        <div
          className="flex flex-col w-[80px] text-center"
          title="Retention rate: Tỉ lệ khách hàng quay lại"
        >
          <span className="text font-bold text-black dark:text-white select-none">
            RR*
          </span>
          <span className="text-md font-bold ms-1">69%</span>
        </div>
        <div className="self-stretch w-[1px] bg-gray-200"></div>
        <div
          className="flex flex-col w-[80px] text-center"
          title="Average order value: Giá trị đơn hàng trung bình"
        >
          <span className="text font-bold text-black dark:text-white select-none">
            AOV*
          </span>
          <span className="text-md font-bold ms-1">142,000đ</span>
        </div>
      </div>
      <div className="view-detail-wrapper clickable card-head absolute bottom-0 left-0 w-full flex gap-1 justify-center items-center h-[2rem] border-t border-stroke  shadow-default dark:border-strokedark dark:bg-gray-800">
        <div className="view-detail w-full h-full flex">
          <a className="m-auto z-10 text-cyan-600 select-none hover:underline">
            Xem Khách hàng 360°
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
