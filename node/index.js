import { WebSocketServer, WebSocket } from 'ws';
import dgram from 'node:dgram';

let   motuData   = null
const motuPort   = 1280
const udpSocket  = dgram.createSocket({ type: 'udp4' });
const wsRepeater = new WebSocketServer({ port: motuPort });

udpSocket.on('listening', function () {
	const address = udpSocket.address();
	console.log('ipAutoconfig: UDP socket listening on ' + address.address + ":" + address.port);
});

udpSocket.on('message', function (message) {
	console.log('ipAutoconfig: ' + message);
	try {
		const advertMessage = JSON.parse(message);
		advertMessage.model == "UltraLite-mk5" ? motuData = advertMessage : null;
    } catch (error) {
        return console.error(error);
	}
    console.log(`ipAutoconfig: ${motuData.name} is reachable at ${motuData.ip} 😎`);
	console.log("ipAutoconfig: Autoconfig done, closing udpSocket")
	udpSocket.close()
});

udpSocket.bind(motuPort);

wsRepeater.on('connection', function connection(clientWebSocket) {
    console.log("wsRepeater: Client CueMix connected")
    const motuWebSocket = new WebSocket(`ws://${motuData.ip}:${motuPort}`);

    motuWebSocket.on('open', function open() {
        console.log(`motuWebSocket: Opened ${motuData.model} - ${motuData.name} - ${motuData.ip}`)
    });
    
    motuWebSocket.on('message', function(data){
        clientWebSocket.send(data);
    });
    
    clientWebSocket.on('message', function message(data) {
      motuWebSocket.send(data)
    });

    clientWebSocket.on('close', function close() {
        console.log('clientWebSocket: Client disconnected from repeater');
      });
});
