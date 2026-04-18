const button = document.getElementById("btn");

const API_ENDPOINT = "https://localhost:7022/api"

const order = {
    "diego betto": 1,
    "tickets": [
        {
            "holderName": "string",
            "bullshit": "string",
            "hasBooklet": true,
            "discountCode": "FREE",
        }
    ]
}

button.addEventListener("click", async () => {
    // const body = JSON.stringify(order);
    const body = "bullshit";
    console.log(`Sending ${body}`);
    const result = await fetch(`${API_ENDPOINT}/orders`, {
        method: "POST",
        body: body,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    });
    // const result = await fetch(`${API_ENDPOINT}/status`);
    console.log(result);
})
