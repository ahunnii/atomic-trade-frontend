export async function TestBackendApi() {
  const res = await fetch(`http://localhost:3000/api/trpc/payment.checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-trpc-source": "frontend",
    },
    body: JSON.stringify({
      input: "cm9t43l1y000w2gwstp6kqndd",
    }),
  });

  const result = await res.json();
  return <div>{JSON.stringify(result)}</div>;
}
