const player = document.getElementById("player");
const playList = document.getElementById("playlist");
const songs = [
    {
        //id: 0,
        name: "Boys, Girls, Toys &Words - Modern Pitch",
        src: "assets/Boys,_Girls,_Toys_&_Words_-_Modern_Pitch.mp3",
    },
    {
        //id: 1,
        name: "Not My Problem - All My Friends Hate Me",
        src: "assets/Not_My_Problem_-_All_My_Friends_Hate_Me.mp3",
    },
    {
        //id: 2,
        name: "Old News - Hot Fiction",
        src: "assets/Old_News_-_Hot_Fiction.mp3",
    },
    {
        //id: 3,
        name: "Peyote - Kinematic",
        src: "assets/Peyote_-_Kinematic.mp3",
    },
    {
        //id: 4,
        name: "Say Goodbye - VITNE",
        src: "assets/Say_Goodbye_-_VITNE.mp3",
    },
    {
        name: "You Saved Science - Portal 2",
        src: "assets/Portal2-23-You_Saved_Science.mp3",
    },
];

songs.forEach(s => playList.insertAdjacentHTML("beforeend", `<li class="song">${s.name}</li>`));
document.querySelectorAll(".song").forEach(s => s.addEventListener("click", e => playSong(e.target)));

function forEach(elemChildren, f) {
    for (let i = 0; i < elemChildren.length; i++) {
        f(elemChildren.item(i));
    }
}

// function findSong(id) {
//     return songs.find(s => s.id === id);
// }
function playSong(songLiElem) {
    const song = songs.find(s => s.name === songLiElem.innerText);
    //playList.children.forEach(li => li.classList.remove("selected"));
    forEach(playList.children, li => li.classList.remove("selected"));
    songLiElem.classList.add("selected");

    player.src = song.src;
    player.play();
}
