export const loadNews = async (path) => {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  const news = await fetch(`http://localhost:3000/${path}`, request)
    .then(response => response.json());

  return news;
};

export const addNews = async (news, path) => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(news),
  };

  await fetch(`http://localhost:3000/${path}`, request)
    .then(response => response.json());
};