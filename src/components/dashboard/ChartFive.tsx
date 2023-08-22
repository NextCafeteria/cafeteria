import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";
import ReactApexChart from "@components/ApexChart";
import randomColor from "randomcolor";

const ChartFive = ({
  monthlyRevenueByStore,
  storeIds,
  totalRevenue,
}: {
  monthlyRevenueByStore: { [key: string]: { [key: string]: number } };
  storeIds: any;
  totalRevenue: number;
}) => {
  const colors = [];
  for (let i = 0; i < storeIds.length; i++) {
    colors.push(randomColor({ luminosity: "dark" }));
  }

  const allSeries = [] as any;
  for (let i = 0; i < storeIds.length; i++) {
    const storeId = storeIds[i];
    const storeName = "Chi nhánh " + (i + 1).toString();
    const storeData = [];
    for (let j = 0; j < 12; j++) {
      const month = j + 1;
      const year = 2023;
      const key = `${year}-${month}`;
      const value = +(
        (100 * (monthlyRevenueByStore[storeId][key] || 0)) /
        totalRevenue
      ).toFixed(0);
      storeData.push(value);
    }
    allSeries.push({
      name: storeName,
      data: storeData,
    });
  }
  // alert(
  //   JSON.stringify(allSeries) +
  //     " " +
  //     JSON.stringify(storeIds) +
  //     " " +
  //     JSON.stringify(totalRevenue)
  // );
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: colors,
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: colors,
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: 100,
    },
  };

  const [series, setSeries] = useState(allSeries);

  const [storeVisibility, setStoreVisibility] = useState({
    store1: true,
    store2: true,
  });

  useEffect(() => {
    let newSeries = [];

    if (storeVisibility.store1) {
      newSeries.push(allSeries[0]);
    }
    if (storeVisibility.store2) {
      newSeries.push(allSeries[1]);
    }

    setSeries(newSeries);
  }, [storeVisibility]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoreVisibility({
      ...storeVisibility,
      [event.target.name]: event.target.checked,
    });
  };
  const [isPopupVisible, setPopupVisible] = useState(false);
  const togglePopup = () => {
    setPopupVisible((prev) => !prev);
  };

  const style = `.apexcharts-series > path:first-child {
    display: none !important; 
  }
  .bg-color1 {
    background-color: ${colors[0]} ;
  }
  .bg-color2 {
    background-color: ${colors[1]};
  }
  .text-color1 {
    color: ${colors[0]};
  }
  .text-color2 {
    color: ${colors[1]};
  }
  `;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-gray-800 sm:px-7.5 xl:col-span-8">
      <style>{style}</style>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          {storeVisibility.store1 && (
            <div className="flex min-w-47.5">
              {" "}
              <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-color1"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-color1">Chi nhánh Hà Nội</p>
              </div>
            </div>
          )}
          {storeVisibility.store2 && (
            <div className="flex min-w-47.5">
              {" "}
              <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-color2"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-color2">Chi nhánh TP HCM</p>
              </div>
            </div>
          )}
          {/* {storeVisibility.store3 && (
            <div className="flex min-w-47.5">
              <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-color3"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-color3">Chi nhánh Đà Nẵng</p>
              </div>
            </div>
          )} */}
        </div>
        <div className="flex w-full max-w-45 justify-end">
          {/* <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-gray-800">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-gray-800">
              Month
            </button>
          </div> */}
          <div className="select-store relative">
            <div
              className="front p-2  whitespace-nowrap select-none"
              onClick={togglePopup}
            >
              <div className="front-content pr-5 clickable">
                <h3>Lọc theo chi nhánh</h3>
                <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                      fill="#637381"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                      fill="#637381"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
            {isPopupVisible && (
              <div className="popup absolute z-999 p-5 w-fit whitespace-nowrap left-1/2 transform -translate-x-1/2 bg-white border border-secondary mt-1">
                <div className="store-checkbox flex gap-1 ">
                  <input
                    type="checkbox"
                    id="store-1"
                    name="store1"
                    value="store-1"
                    checked={storeVisibility.store1}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="store-1">Chi nhánh Hà Nội</label>
                </div>
                <div className="store-checkbox flex gap-1">
                  <input
                    type="checkbox"
                    id="store-2"
                    name="store2"
                    value="store-2"
                    checked={storeVisibility.store2}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="store-2">Chi nhánh TP HCM</label>
                </div>
                {/* <div className="store-checkbox flex gap-1">
                  <input
                    type="checkbox"
                    id="store-3"
                    name="store3"
                    value="store-3"
                    checked={storeVisibility.store3}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="store-3">Chi nhánh Đà Nẵng</label>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div id="chartFive" className="-ml-5">
          <ReactApexChart
            options={options}
            series={allSeries}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartFive;
