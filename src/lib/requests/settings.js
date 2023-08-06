import useSWR, { useSWRConfig } from "swr";

export async function GetCommonSettings(settingSet = "common") {
  const response = await fetch(`/api/settings/${settingSet}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.data;
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
