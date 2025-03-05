const { ipcRenderer } = require('electron');

document.getElementById('close').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

document.getElementById('close2').addEventListener('click', () => {
     ipcRenderer.send('min-window');
 });


const audio = document.getElementById("audio");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

// Adjust canvas size
canvas.width = window.innerWidth - 50;
canvas.height = 120;

// Create an AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);

analyser.fftSize = 256/4; // Controls bar count & smoothness
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect audio source to analyser and output to speakers
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Draw the visualizer bars
function draw() {
    requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 1.5; // Adjust height multiplier

        ctx.fillStyle = `rgb(255, 140, 0)`; // 🔥 Solid Orange (RGB: 255,140,0)
        ctx.fillRect(x, canvas.height - barHeight/4, barWidth, barHeight);

        x += barWidth + 10.11; // Add spacing between bars
    }
}

// Start visualization when the user interacts with the page
audio.onplay = () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    draw();
};



const progress = document.getElementById("progress");
const timeline = document.getElementById("timeline");
const playButton = document.getElementById("playButton");
const buttonicon = document.getElementById("buttonicon");

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => buttonicon.src = "./files/caret-right-svgrepo-com.svg");

// Update the timeline as the song plays
function updateProgress() {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = progressPercent + "%";
}

// Handle clicks on the timeline
function seek(event) {
    const timelineWidth = timeline.offsetWidth;
    const clickPosition = event.offsetX;
    const seekTo = (clickPosition / timelineWidth) * audio.duration;
    audio.currentTime = seekTo;
}

// Handle clicks on the play/pause button

// Play or pause the song when the button is clicked
function togglePlay() {
    if (audio.paused) {
        audio.play();
     //    playButton.textContent = "./files/caret-right-svgrepo-com.svg";
     buttonicon.src = "./files/pause.png";

    } else {
        audio.pause();
     //    playButton.textContent = "Play";
          buttonicon.src = "./files/caret-right-svgrepo-com.svg";

    }
}
