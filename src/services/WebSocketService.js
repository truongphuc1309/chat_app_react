import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    wsUrl = 'http://localhost:8080/ws';
    broker = null;
    stomp = null;
    onReceived = null;

    constructor({ broker = null, onReceived = null }) {
        const ws = new SockJS(this.wsUrl);
        this.stomp = Stomp.over(ws);
        this.broker = broker;
        this.onReceived = onReceived;
    }

    connect(token = '') {
        this.stomp.connect(
            {
                Authorization: `Bearer ${token}`,
            },
            () => {
                if (this.broker && this.onReceived)
                    this.stomp.subscribe(this.broker, this.onReceived);
            },
            () => {
                console.log('Error connect to ws');
            }
        );
        console.log(token);
    }

    send({ destination, message }) {
        this.stomp.send(destination, {}, JSON.stringify(message));
    }

    disconnect() {
        this.stomp.disconnect();
    }

    unsubscribe() {
        this.stomp.unsubscribe();
    }
}

export default WebSocketService;
