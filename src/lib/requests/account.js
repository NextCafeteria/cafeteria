export async function UpdateAccount(
  name = null,
  avatarUrl = null,
  onSuccess = null,
  onError = null
) {
  const response = await fetch(`/api/account/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      image: avatarUrl,
    }),
  });

  const data = await response.json();
  if (data?.success) {
    if (onSuccess) {
      onSuccess(data?.data);
    }
  } else {
    if (onError) {
      onError(data);
    }
  }
}
