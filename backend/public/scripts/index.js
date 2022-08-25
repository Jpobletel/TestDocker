const socket = new WebSocket('ws://localhost:3000/data');
socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
    var noticia = event.data
    var noticiaJson = JSON.parse(noticia)
    document.getElementById("feed").innerHTML += getNoticiaDisplayEle(noticiaJson)
});

function getNoticiaDisplayEle(noticia) {
    return `<div class="feed">

        <div class="normal-view"
            <div>type: ${noticia.type}</div>
            <div>lat: ${noticia.lat}</div>
            <div>lon: ${noticia.lon}</div>
            <div>location: ${noticia.location}</div>
            <div>message: ${noticia.message}</div>
            <div>level: ${noticia.level}</div>
            <div> ------------------------------------- </div>
        </div>
    </div>`;
}
