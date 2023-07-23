import { useState } from "react";
const CardFour = () => {
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
  const [reaction, setReaction] = useState(1260); // State for reaction
  const reactionList = [3830, 968, 1260, 3629];

  // Function to handle previous time span
  const handlePrevTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index > 0) {
      setTimespan(timespans[index - 1]);
      setReaction(reactionList[index - 1]);
    }
  };

  // Function to handle next time span
  const handleNextTimespan = () => {
    const index = timespans.indexOf(timespan);
    if (index < timespans.length - 1) {
      setTimespan(timespans[index + 1]);
      setReaction(reactionList[index + 1]);
    }
  };

  return (
    <div className="relative pb-[3rem] rounded-sm  bg-white py-6 px-6 border border-stroke dark:border-strokedark dark:bg-gray-800 shadow-default">
      <style>{style}</style>
      <div className="main-stat">
        <div className="flex gap-1 items-center mb-[0.3rem]">
          <div className="flex items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                className="fill-primary dark:fill-white stroke-primary dark:stroke-white"
                stroke-width="1.2"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0f766e] mt-[0.2rem] leading-none select-none">
            Lượt tương tác trên MXH
          </span>
        </div>
        <div className="flex">
          <span className="text-title-xl font-bold text-black dark:text-white">
            16.120
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-[0.4rem] items-start justify-between">
        <div className="flex flex-col ms-1 w-[110px]">
          <span className="text-md font-bold text-center ms-[-1rem]">
            +{reaction.toLocaleString("vi-VN")}
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
          className="flex flex-col w-[50px] text-center"
          title="Tỉ lệ khách hàng tương tác trên lượng view"
        >
          <span className="text font-bold text-black dark:text-white select-none">
            T.tác
          </span>
          <span className="text-md font-bold ms-1">69%</span>
        </div>
        <div className="self-stretch w-[1px] bg-gray-200"></div>
        <div
          className="flex flex-col w-[100px] text-center"
          title="Tỉ lệ khách hàng xem nội dung và mua hàng"
        >
          <span className="text font-bold text-black dark:text-white select-none">
            Chuyển đổi
          </span>
          <span className="text-md font-bold ms-1">3%</span>
        </div>
      </div>
      <div className="view-detail-wrapper clickable card-head absolute bottom-0 left-0 w-full flex gap-1 justify-center items-center h-[2rem] border-t border-stroke  shadow-default dark:border-strokedark dark:bg-gray-800">
        <div className="view-detail w-full h-full flex">
          <a className="m-auto z-10 text-cyan-600 select-none hover:underline">
            Quản lý ứng dụng
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardFour;
