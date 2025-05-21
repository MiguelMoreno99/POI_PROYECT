// Conectar con el servidor Socket.IO
const socket = io(SERVER_URL); // Conectar al servidor con WebSockets

// Obtener elementos del DOM
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startCallBtn = document.getElementById('start-call');
const endCallBtn = document.getElementById('end-call');

let localStream = null;
let peerConnection = null;

// Configuración STUN para ICE candidates
const configRTC = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

// Obtener el usuario actual y el usuario destino
const usuarioActualId = localStorage.getItem("idUsuario");
const usuarioDestinoId = localStorage.getItem("usuarioVideollamada");

console.log("🧾 ID del usuario actual:", usuarioActualId);
console.log("📞 ID del usuario destino:", usuarioDestinoId);

// Habilitar o deshabilitar botones
function toggleButtons(inCall) {
    startCallBtn.disabled = inCall;
    endCallBtn.disabled = !inCall;
}

// Crear PeerConnection y configurar eventos
function crearPeerConnection() {
    peerConnection = new RTCPeerConnection(configRTC);

    peerConnection.ontrack = (event) => {
        console.log("🎥 Video remoto recibido");
        remoteVideo.srcObject = event.streams[0];
    };

peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        console.log("🌐 Enviando candidato ICE desde:", usuarioActualId, "a:", usuarioDestinoId);
        socket.emit('videollamada:candidato', {
            candidato: event.candidate,
            desde: usuarioActualId, // Agregar el ID del usuario que envía
            hacia: usuarioDestinoId,
        });
    }
};
}

// Iniciar la llamada: obtener media local y crear oferta
async function iniciarLlamada() {
    toggleButtons(true);

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        console.log("✅ Cámara activada correctamente");

        crearPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit('videollamada:oferta', {
            oferta: offer,
            desde: usuarioActualId,
            hacia: usuarioDestinoId,
        });
    } catch (err) {
        console.error('❌ Error al iniciar llamada:', err);
        toggleButtons(false);
    }
}

// Colgar llamada: cerrar peerConnection y detener streams
function colgarLlamada() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    
    toggleButtons(false);
}

// Recibir una oferta entrante
socket.on('videollamada:oferta', async ({ oferta, desde }) => {
    console.log('📞 Oferta de videollamada recibida de:', desde);
    
    if (!peerConnection) {
        crearPeerConnection();
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(oferta));

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit('videollamada:respuesta', {
            respuesta: answer,
            desde: usuarioActualId,
            hacia: desde,
        });

        toggleButtons(true);
    } catch (err) {
        console.error('❌ Error al responder llamada:', err);
    }
});

// Recibir respuesta a la oferta enviada
socket.on('videollamada:respuesta', async ({ respuesta }) => {
    console.log('📡 Respuesta a la oferta recibida');
    
    if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(respuesta));
    }
});

// Recibir candidato ICE
socket.on('videollamada:candidato', async ({ candidato }) => {
    try {
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidato));
        }
    } catch (err) {
        console.error('❌ Error al agregar candidato ICE:', err);
    }
});

// Botones
startCallBtn.addEventListener('click', iniciarLlamada);
endCallBtn.addEventListener('click', colgarLlamada);

// Estado inicial botones
toggleButtons(false);