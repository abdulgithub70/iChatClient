const socket = io('http://localhost:3000')

const form =  document.getElementById('send-container');
const messageInp = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')
const imageInput = document.getElementById('imageInput');
var audio = new Audio('ting.mp3')

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const imageData = evt.target.result;
            socket.emit('send-image', imageData);
            appendImage(imageData, 'right');
        }
        reader.readAsDataURL(file); // Convert image to base64
    }
});

form.addEventListener('submit',(e) => {
    e.preventDefault()
    const message = messageInp.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message)
    messageInp.value = ''
})

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if (position === 'left') {
        audio.play()
    }
    // 👇 This line auto scrolls to the bottom when new message comes
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
const appendImage = (imageData, position) => {
    const img = document.createElement('img');
    img.src = imageData;
    img.classList.add('message', position);
    img.style.maxWidth = '200px'; // You can style images
    img.style.margin = '10px';
    messageContainer.append(img);
};

let username = prompt("Enter your name here to join the chat");
socket.emit('new-user-joined', username);


socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left')
})
socket.on('left', name => {
    append(`${name} left the chat`, 'left')
})
socket.on('receive-image', (imageData) => {
    appendImage(imageData, 'left');
});
