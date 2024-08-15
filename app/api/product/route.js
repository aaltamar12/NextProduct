export async function GET(req, { params }) {
  const response = await fetch(
    `${process.env.NEXT_BACKEND_URL}/api/v1/products/?${Date.now()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(response.status);
  }

  const body = await response.json();

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req) {
  try {
    const {
      product: { name, description, price, images },
      userData: { email, password },
    } = await req.json();

    const productData = {
      name,
      description,
      price,
      images,
    };

    const loginResponse = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/v1/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const userLogged = await loginResponse.json();

    if (!loginResponse.ok || !userLogged?.token) {
      const { error } = await loginResponse.json();
      console.error("API LOGIN ERROR: ", error);
      throw new Error(error);
    }

    const response = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/v1/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userLogged.token}`,
        },
        body: JSON.stringify({ product: productData }),
      }
    );

    if (!response.ok) {
      const { error } = await response.json();
      console.error("API ERROR: ", error);
      throw new Error(error);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ status: 201, message: "Created", data, userLogged }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
