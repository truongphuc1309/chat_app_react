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

    connect() {
        this.stomp.connect(
            {},
            () => {
                if (this.broker && this.onReceived)
                    this.stomp.subscribe(this.broker, this.onReceived);
            },
            () => {
                console.log('Error connect to ws');
            }
        );
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
