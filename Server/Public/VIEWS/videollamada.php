<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ByteTalk - Videollamada</title>
    <?php require 'PHP/cssStyles.php'; ?>
    <link rel="stylesheet" href="CSS/mensajes.css" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Exo+2:wght@800&family=Saira+Stencil+One&display=swap" rel="stylesheet">
    <style>
        .video-call-container {
            display: flex;
            justify-content: center;
            gap: 1rem;
            padding: 1rem;
        }
        .video-container video {
            width: 300px;
            height: 220px;
            background: black;
            border-radius: 10px;
        }
        .call-controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 20px;
        }
        .control-btn {
            padding: 10px 15px;
            font-size: 20px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
        }
        .end-call {
            background-color: #e74c3c;
            color: white;
        }
        .start-call {
            background-color: #2ecc71;
            color: white;
        }
    </style>
</head>
<body>

<?php require 'TEMPLATES/header.php'; ?>

<div class="video-call-container">
    <div class="video-container">
        <video id="local-video" autoplay muted playsinline></video>
    </div>
    <div class="video-container">
        <video id="remote-video" autoplay playsinline></video>
    </div>
</div>

<div class="call-controls">
    <button id="mute-btn" class="control-btn"><i class="bx bxs-microphone"></i></button>
    <button id="camera-btn" class="control-btn"><i class="bx bxs-video"></i></button>
    <button id="start-call-btn" class="control-btn start-call"><i class="bx bx-phone-call"></i></button>
    <button id="end-call-btn" class="control-btn end-call"><i class="bx bxs-phone-off"></i></button>
</div>

<?php require 'PHP/socket.php'; ?>
<script src="CONF/server_url.js"></script>
<script>
    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    let localStream = null;
    let peerConnection = null;
    let readyToCall = false;
    let esperandoLlamada = false;

    const socket = io(SERVER_URL);
    const roomId = new URLSearchParams(window.location.search).get('chatId');

    // Unirse automáticamente a la sala
    socket.emit('joinRoom', roomId);

    document.getElementById("start-call-btn").addEventListener("click", async () => {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('local-video').srcObject = localStream;

            inicializarPeerConnection();

            // Agrega tracks
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });

            if (readyToCall) {
                iniciarLlamada();
            } else {
                esperandoLlamada = true;
            }

        } catch (err) {
            console.error("Error accediendo a cámara o micrófono:", err);
        }
    });

    function inicializarPeerConnection() {
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack = event => {
            document.getElementById('remote-video').srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('iceCandidate', { candidate: event.candidate, roomId });
            }
        };
    }

    function iniciarLlamada() {
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .then(() => {
                socket.emit('offer', { roomId, sdp: peerConnection.localDescription });
            })
            .catch(err => console.error("Error al iniciar la llamada:", err));
    }

    socket.on('readyToCall', () => {
        readyToCall = true;
        if (esperandoLlamada) {
            iniciarLlamada();
        }
    });

    socket.on('offer', async (data) => {
        if (!peerConnection) {
            inicializarPeerConnection();
        }

        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', { roomId, sdp: peerConnection.localDescription });
    });

    socket.on('answer', (data) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
    });

    socket.on('iceCandidate', (data) => {
        if (data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });

    // Micrófono toggle
    document.getElementById("mute-btn").addEventListener("click", () => {
        const icon = document.querySelector("#mute-btn i");
        if (localStream && localStream.getAudioTracks().length > 0) {
            const track = localStream.getAudioTracks()[0];
            track.enabled = !track.enabled;
            icon.classList.toggle("bxs-microphone-off");
        }
    });

    // Cámara toggle
    document.getElementById("camera-btn").addEventListener("click", () => {
        const icon = document.querySelector("#camera-btn i");
        if (localStream && localStream.getVideoTracks().length > 0) {
            const track = localStream.getVideoTracks()[0];
            track.enabled = !track.enabled;
            icon.classList.toggle("bxs-video-off");
        }
    });

    document.getElementById("end-call-btn").addEventListener("click", () => {
        if (peerConnection) peerConnection.close();
        if (socket.connected) socket.disconnect();
        alert("Llamada finalizada.");
    });

    window.onunload = window.onbeforeunload = () => {
        if (peerConnection) peerConnection.close();
        if (socket.connected) socket.disconnect();
    };
</script>

<?php require 'TEMPLATES/footer.php'; ?>
<script src="JS/header.js"></script>
</body>
</html>
