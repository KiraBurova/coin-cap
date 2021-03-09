const socket = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

let assetsHandler = null;

export const getAssests = async () => {
  const URL = "https://api.coincap.io/v2/assets";

  return fetch(URL)
    .then(response => {
      return response.json();
    })
    .then(assets => assets.data);
};

socket.addEventListener("message", message => {
  const price = JSON.parse(message.data);

  assetsHandler(price);
});

export const subscribeToPricesChange = callback => {
  assetsHandler = callback;
};

// export const unSubscribeToPricesChange = (assets, callback) => {
//   assetsHandler = null;
//   subscribeToPricesOnWs(assets);
// };
