import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_URL = 'https://mamanmakuetchehelene.site'; // Replace with your Spring Boot backend URL

export const connectToChat = (token, onMessageReceived) => {
    // Add token to URL and use localStorage as backup
    const socket = new SockJS(`${API_URL}/ws?token=${token}`);

    localStorage.setItem('token', token);
    const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            'Authorization': `Bearer ${token}` // Pass the JWT token for authentication
        },
        debug: function(str) {

        },
        onConnect: () => {

            stompClient.subscribe('/user/queue/messages', (message) => {
                const parsedMessage = JSON.parse(message.body);
                onMessageReceived(parsedMessage);
            });
        },
        onStompError: (error) => {
            console.error('WebSocket error:', error);
        },
        onWebSocketClose: () => {
            console.warn('WebSocket connection closed. Please check your token.');
        },
    });

    stompClient.activate();
    return stompClient;
};

export const sendMessage = (stompClient, message) =>
{
    stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify({
            id : message.id,
            content: message.content,
            fileType: message.fileType,
            accessUrl : message.accessUrl,
        })
    });
};