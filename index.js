const player = document.getElementById("player");
const playList = document.getElementById("playlist");
const playButton = document.getElementById("play-pause");
const loopCheck = document.getElementById("looping");
const shuffCheck = document.getElementById("shuffling");
const songs = [
    {
        id: 0,
        name: "Boys, Girls, Toys &Words - Modern Pitch",
        src: "assets/Boys,_Girls,_Toys_&_Words_-_Modern_Pitch",
    },
    {
        id: 1,
        name: "Not My Problem - All My Friends Hate Me",
        src: "assets/Not_My_Problem_-_All_My_Friends_Hate_Me",
    },
    {
        id: 2,
        name: "Old News - Hot Fiction",
        src: "assets/Old_News_-_Hot_Fiction",
    },
    {
        id: 3,
        name: "Peyote - Kinematic",
        src: "assets/Peyote_-_Kinematic",
    },
    {
        id: 4,
        name: "Say Goodbye - VITNE",
        src: "assets/Say_Goodbye_-_VITNE",
    },
    {
        id: 5,
        name: "You Saved Science - Portal 2",
        src: "assets/Portal2-23-You_Saved_Science",
    },
    {
        id: 6,
        name: "Higher And Higher - Scream Inc.",
        src: "assets/Higher_And_Higher_-_Scream_Inc._(3)",
    },
];

const audioSourceFromBase = baseName => baseName + ".mp3";
const imageFromBase = baseName => baseName + ".jpg";
const songName = name => name.split(" - ")[0];
const artist = name => name.split(" - ")[1];

songs.forEach(s =>
    playList.insertAdjacentHTML(
        "beforeend",
        `<li id="${s.id}" class="song"><img src="${imageFromBase(s.src)}" alt=""><p>${songName(s.name)}</p><p>${artist(
            s.name
        )}</p></li>`
    )
);

function forEach(elemChildren, f) {
    for (let i = 0; i < elemChildren.length; i++) {
        if (f(elemChildren.item(i)) === "break") break;
    }
}

function findSong(id) {
    return songs.find(s => s.id == id);
}

const notPlayed = [...songs];
const playQueue = [...songs];
let currentSong = null;
const isLooping = () => loopCheck.checked;
let isShuffling = () => shuffCheck.checked;
function setCurrentSong(song) {
    player.src = audioSourceFromBase(song.src);
    currentSong = song;
}

function setSong(songLiElem, song) {
    if (!song) song = songs.find(s => s.id == songLiElem.id);
    forEach(playList.children, li => li.classList.remove("selected"));
    songLiElem.classList.add("selected");
    setCurrentSong(song);
    notPlayed.remove(song);
}
function playSong(songLiElem, song) {
    setSong(songLiElem, song);
    player.play();
}

function setSong2(song) {
    let songLiElem = null;
    forEach(playList.children, li => {
        if (li.id == song.id) {
            songLiElem = li;
            return "break";
        }
    });
    setSong(songLiElem, song);
}
function playSong2(song) {
    setSong2(song);
    player.play();
}

function initSong() {
    if (!currentSong) {
        let songIx = isShuffling ? Math.floor(Math.random() * playQueue.length) : 0;
        setCurrentSong(songs[songIx]);
    }
}

function playNext() {
    // let ix = playQueue.indexOf(currentSong);
    // if (ix < 0) ix = 0;
    // if (playQueue.length === 0) return;
    let i;
    if (!currentSong) {
        initSong();
        playSong(currentSong);
    } else if (isShuffling()) {
        let choises = notPlayed.length > 0 ? notPlayed : playQueue.slice();
        if ((i = choises.indexOf(currentSong)) >= 0) choises.splice(i, 1);
        let nxIx = Math.floor(Math.random() * choises.length);
        if (nxIx >= choises.length) {
            console.log("ERROR new shuffling song:", nxIx, choises);
            return;
        }
        playSong2(choises[nxIx]);
    } else {
        i = (playQueue.indexOf(currentSong) + 1) % playQueue.length;
        playSong2(playQueue[i]);
    }
}

document.querySelectorAll(".song").forEach(s => s.addEventListener("click", e => playSong(s)));
//player.addEventListener();

const range = document.getElementById("range");
const playedRange = document.getElementById("played-range");
//console.log("range.width:", range.clientWidth);
range.addEventListener("click", e => (player.currentTime = player.duration * (e.offsetX / range.clientWidth)));

//const rangeWidthPercent = 70;
// range.style.width = rangeWidthPercent + "%";
let lastPlayedSteps = 0;
setInterval(() => {
    const ct = player.currentTime;
    const playedSteps = Math.round(ct * 4);
    if (lastPlayedSteps != playedSteps) {
        lastPlayedSteps = playedSteps;
        const fraction = ct / player.duration;
        playedRange.style.width = fraction ? fraction * range.clientWidth + "px" : "0";
    }
}, 250);

// console.log(songs);
//setTimeout(() => console.log("range.style.width:", range.style.width), 1000);

playButton.addEventListener("click", () => {
    if (playButton.innerText === "Play") {
        if (!currentSong) setSong2(songs[0]);
        player.play();
        playButton.innerText = "Pause";
    } else {
        player.pause();
        playButton.innerText = "Play";
    }
});
