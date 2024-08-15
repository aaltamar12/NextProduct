export async function POST(req, { params }) {
  const { id } = params;
  const { token } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_BACKEND_URL}/api/v1/products/${id}/?${Date.now()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    const { error, status } = await response.json();

    return new Response(JSON.stringify({ error, status }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

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

export async function PUT(req, { params }) {
  const { id } = params;

  const {
    userData: { token },
    product,
  } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_BACKEND_URL}/api/v1/products/${id}/?${Date.now()}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const updatedProduct = await response.json();

  return new Response(
    JSON.stringify({ message: "Success", product: updatedProduct }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const { token } = await req.json();

  const response = await fetch(
    `${process.env.NEXT_BACKEND_URL}/api/v1/products/${id}/?${Date.now()}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
