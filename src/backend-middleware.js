const backendMiddleware = async (pathname) => {
  const apiURL =
    `${process.env.NEXT_PUBLIC_API_URL}/checkRoute` ||
    "http://localhost:4000/api/v1/checkRoute";
  const res = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ pathname }),
  });

  const response = await res.json();

  return response.result;
};

export default backendMiddleware;
