  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const backendMiddleware = async (pathname) => {
    try {
      const response = await fetch(`${API_URL}/checkRoute`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pathname }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return Boolean(data?.result);
    } catch (error) {
      console.error("Route authorization failed:", error);
      return false;
    }
  };

  export default backendMiddleware;