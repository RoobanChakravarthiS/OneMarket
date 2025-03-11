// import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// // Backend WebSocket URL
// const SOCKET_URL = 'http://192.168.23.154:1102/websocket-sockjs-stomp';

// let stompClient = null;

// export const connectStomp = (onMessageReceived) => {
//   const socket = new SockJS(SOCKET_URL);

//   stompClient = new Client({
//     webSocketFactory: () => socket,
//     reconnectDelay: 5000, // Auto-reconnect
//     onConnect: () => {
//       console.log('Connected to WebSocket');

//       // Subscribe to the response topic
//       stompClient.subscribe('/queue/responses', (message) => {
//         onMessageReceived(JSON.parse(message.body));
//       });
//     },
//     onStompError: (frame) => {
//       console.error('WebSocket Error:', frame.headers['message']);
//     },
//     onDisconnect: () => {
//       console.log('Disconnected from WebSocket');
//     }
//   });

//   stompClient.activate();
// };

// // Function to send a message
// export const sendMessage = () => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({ destination: '/app/subscribe', body: JSON.stringify("Test Message") });
//     console.log("Message sent!");
//   } else {
//     console.log("WebSocket is not connected.");
//   }
// };

// // Disconnect function
// export const disconnectStomp = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     console.log('Client disconnected');
//   }
// };

const stompClient = null;

const socket = new SockJS('/ws');

stompClient = Stomp.over(socket);
stompClient.connect({}, function (frame) {
  console.log('Connected: ', frame);
  stompClient.subscribe('/all/responses', function (message) {
    console.log(JSON.parse(message.body));
  });
});
