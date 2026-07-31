// app/api/test/route.js

export async function GET(request) {
  return new Response(
    JSON.stringify({ message: "Hello from the API route!" }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function POST(request) {
  const body = await request.json();
  return new Response(
    JSON.stringify({ message: "Data received!", data: body }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
