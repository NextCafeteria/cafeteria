import useSWR, { useSWRConfig } from "swr";

export function useGetCommonSettings(settingSet = "common") {
  let settings = JSON.parse(localStorage.getItem("commonSettings", "{}"));

  const { fetcher } = useSWRConfig();
  let { data, error } = useSWR(`/api/settings/${settingSet}`, fetcher);

  if (data) {
    if (typeof window !== "undefined") {
      localStorage.setItem("commonSettings", JSON.stringify(data.data));
    }
  }
  return {
    data: data ? data.data : settings,
    error,
  };
}

export async function UpdateCommonSettings(settingSet, newSettingData) {
  const response = await fetch(`/api/settings/${settingSet}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSettingData),
  });

  const data = await response.json();
  return data;
}
