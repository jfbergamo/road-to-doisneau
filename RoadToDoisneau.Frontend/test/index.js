const button = document.getElementById("btn");

const API_ENDPOINT = "https://localhost:7022/api"

const order = {
  "tickets": [
    {
      "holderName": "string",
      "holderEmail": "string",
      "hasBooklet": true,
      "discountCode": "FREE",
    },
  ]
}

button.addEventListener("click", async () => {
    const result = await fetch(`${API_ENDPOINT}/orders`, {
        method: "POST",
        // body: JSON.stringify(order),
        body: '{"tickets":[{"holderName":"string","holderEmail":"string","hasBooklet":true,"discountCode":"FREE",}]}',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });
    // const result = await fetch(`${API_ENDPOINT}/status`);
    console.log(result);
})
