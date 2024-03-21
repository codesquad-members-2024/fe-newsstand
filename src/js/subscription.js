function downloadSubscriptions() {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch("http://localhost:3000/subscriptions").then((response) =>
    response.json()
  );
}

function uploadSubscription(imgSrc) {
  // fetch API를 사용하여 서버에 POST 요청을 보낼 수 있음
  fetch("http://localhost:3000/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imgSrc: imgSrc }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed");
      }
      console.log("uploaded successfully");
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

function deleteSubscription(id) {
  // fetch API를 사용하여 서버에 DELETE 요청
  fetch(`http://localhost:3000/subscriptions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(id);
      if (!response.ok) {
        throw new Error("Failed");
      }
      console.log("deleted successfully");
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

export { downloadSubscriptions, uploadSubscription, deleteSubscription };
