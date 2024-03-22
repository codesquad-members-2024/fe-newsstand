export async function getSubscriptionData(path) {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const news = await fetch(`http://localhost:3000/${path}`, request).then(
    (response) => response.json()
  );

  return news;
}

export async function postSubscriptionData(path, pressData) {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pressData),
  };

  await fetch(`http://localhost:3000/${path}`, request)
    .then((response) => {
      response.json();
      console.log("구독 성공!");
    })
    .catch((error) => console.error("서버와의 통신 중 오류 발생:", error));
}

export async function deleteSubscriptionData(path, pressId) {
  const request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  await fetch(`http://localhost:3000/${path}/${pressId}`, request)
    .then((response) => {
      response.json();
      console.log("해지 성공!");
    })
    .catch((error) => console.error("서버와의 통신 중 오류 발생:", error));
}
