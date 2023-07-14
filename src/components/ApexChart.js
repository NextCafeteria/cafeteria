"use client";
import { useEffect, useState } from "react";

export default function ApexChart(props) {
  const [Chart, setChart] = useState();
  const hasType = typeof props?.type !== "undefined";

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  if (!hasType) {
    return null;
  }

  if (!Chart) {
    return <div>Loading...</div>;
  }

  return hasType && Chart && <Chart {...props} />;
}
