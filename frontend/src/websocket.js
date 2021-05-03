import socketIOClient from "socket.io-client"
import configs from './config.json'

const SOCKET_SERVER_URL = configs.API_URL

const socket = socketIOClient(SOCKET_SERVER_URL, {
    transports: ['websocket'],
    upgrade: false
})

export default socket