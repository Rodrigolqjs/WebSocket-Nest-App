import { Manager, Socket } from "socket.io-client"

let socket: Socket;

export const connectToServer = (token: string) => {

    const manager =new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token
        }
    });
    socket?.removeAllListeners();
    socket = manager.socket('/');

    addListeners();
}

const addListeners = () => {
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

    socket.on('connect', () => {
        console.log('connected');
        serverStatusLabel.innerHTML = 'connected'  
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
        serverStatusLabel.innerHTML = 'disconnected'
    });

    socket.on('clients-updated', (clients: string[]) => {
        console.log(clients);
        
        let clientsHtml = '';
        clients.forEach( clientId => {
            clientsHtml += `
                <li>${clientId}</li>
            `
        })
        clientsUl.innerHTML = clientsHtml;
    });

    socket.on('message-from-server', (payload: {fullname: string, message: string}) => {
        console.log(payload);
        let newMessage = `
                <strong>${payload.fullname}</strong>
                <span>${payload.message}</span>
            `
        const li = document.createElement('li');
        li.innerHTML = newMessage
        messagesUl.append(li);
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client', {id: 'YO!!', message: messageInput.value});
        messageInput.value = '';
    })

}