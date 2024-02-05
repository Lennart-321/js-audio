const player = document.getElementById("player");
const playList = document.getElementById("playlist");
const playButton = document.getElementById("play-pause");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("previous");
const loopCheck = document.getElementById("looping");
const shuffCheck = document.getElementById("shuffling");
const container = document.getElementById("player-container");
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
    console.log("currentSong.id:", currentSong.id);
}

function setSong(songLiElem, song) {
    if (!song) song = songs.find(s => s.id == songLiElem.id);
    forEach(playList.children, li => li.classList.remove("selected"));
    songLiElem.classList.add("selected");
    setCurrentSong(song);
    const npIx = notPlayed.indexOf(song);
    if (npIx >= 0) notPlayed.splice(npIx, 1);
}
function playSong(songLiElem, song) {
    setSong(songLiElem, song);
    player.play();
    startRangeView();
    playButton.innerText = "Pause";
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
    startRangeView();
    playButton.innerText = "Pause";
}

function initSong() {
    if (!currentSong) {
        let songIx = isShuffling ? Math.floor(Math.random() * playQueue.length) : 0;
        setCurrentSong(songs[songIx]);
    }
}

function playNext() {
    console.log("isShuffling():", isShuffling(), "  isLooping():", isLooping());
    console.log(notPlayed);
    if (!currentSong) {
        initSong();
        playSong2(currentSong);
    } else if (isShuffling()) {
        let choises = notPlayed.length > 0 ? notPlayed : playQueue.slice();
        let i;
        if ((i = choises.indexOf(currentSong)) >= 0) choises.splice(i, 1);
        let nxIx = Math.floor(Math.random() * choises.length);
        if (nxIx >= choises.length) {
            console.log("ERROR new shuffling song:", nxIx, choises);
            stopRangeView();
            return;
        }
        playSong2(choises[nxIx]);
    } else {
        let nextIx = -1;
        const cIx = playQueue.indexOf(currentSong);
        console.log("playQueue.indexOf(currentSong):", playQueue.indexOf(currentSong));
        if (cIx < 0) {
            nextIx = 0;
        } else if (cIx === playQueue.length - 1) {
            if (isLooping()) nextIx = 0;
        } else {
            nextIx = cIx + 1;
        }

        if (nextIx >= 0) {
            playSong2(playQueue[nextIx]);
        } else {
            playButton.innerText = "Play";
            stopRangeView();
        }
    }
}

document.querySelectorAll(".song").forEach(s => s.addEventListener("click", e => playSong(s)));

const range = document.getElementById("range");
const playedRange = document.getElementById("played-range");
let dragRangeStatus = 0;

//Clink on range viewer
range.addEventListener("click", e => {
    console.log("click", e.offsetX);
    if (dragRangeStatus === 0) player.currentTime = player.duration * (e.offsetX / range.clientWidth);
});

// //Drag range viewer
range.addEventListener("mousedown", e => {
    console.log("mousedown", e.offsetX);
    if (Math.abs(e.offsetX - playedRange.clientWidth) <= 4) {
        console.log("Start drag", e.offsetX);
        dragRangeStatus = 1;
        stopRangeView();
        container.addEventListener("mousemove", dragEventListner);
        e.preventDefault();
    }
});

function getBodyOffset(elem, offsetX) {
    if (elem.offsetParent === document.body) return elem.offsetLeft + offsetX;
    return getBodyOffset(elem.offsetParent, elem.offsetLeft + offsetX);
}
console.log(range);
console.log(range.offsetParent, range.offsetLeft);
console.log(range.offsetParent.offsetParent, range.offsetParent.offsetLeft);
const rangeBaseOffset = () => getBodyOffset(range, 0);
function dragEventListner(e) {
    if (dragRangeStatus === 0) {
        container.removeEventListener("mousemove", dragEventListner);
        return;
    }
    let baseOffset = getBodyOffset(e.target, e.offsetX);
    let rangeOffset = Math.max(0, Math.min(baseOffset - rangeBaseOffset(), range.clientWidth));
    console.log("drag:", baseOffset, rangeOffset);
    playedRange.style.width = rangeOffset + "px";
}
container.addEventListener("mouseup", e => {
    if (dragRangeStatus === 1) {
        dragRangeStatus = 0;
        startRangeView();
        let containerOffset = getBodyOffset(e.target, e.offsetX);
        let rangeOffset = Math.max(0, Math.min(containerOffset - rangeBaseOffset(), range.clientWidth));
        console.log(player.duration, rangeOffset, range.clientWidth);
        console.log("player.currentTime = ", player.duration * (rangeOffset / range.clientWidth));
        player.currentTime = player.duration * (rangeOffset / range.clientWidth);
    }
});
container.addEventListener("mouseleave", () => {
    if (dragRangeStatus === 1) startRangeView();
    dragRangeStatus = 0;
});

//Range viewer
let rangeInterval = -1;
let lastPlayedSteps;
function startRangeView() {
    console.log("Start Range View:", player.ended, player.paused, player.duration, player.currentTime);
    // if (player.ended || player.paused || !player.duration) {
    //     //if (rangeInterval != -1) stopRangeView();
    //     return;
    // } else
    if (rangeInterval != -1) return;
    lastPlayedSteps = 0;
    rangeInterval = setInterval(() => {
        console.log("Interval Timeout");
        const ct = player.currentTime;
        const playedSteps = Math.round(ct * 4);
        if (lastPlayedSteps != playedSteps) {
            lastPlayedSteps = playedSteps;
            const fraction = ct / player.duration;
            playedRange.style.width = fraction ? fraction * range.clientWidth + "px" : "0";
        }
    }, 250);
    console.log(rangeInterval, " = setInterval(...)");
}
function stopRangeView() {
    console.log(`clearInterval(${rangeInterval})`);
    if (rangeInterval != -1) clearInterval(rangeInterval);
    rangeInterval = -1;
}

player.addEventListener("ended", playNext);

playButton.addEventListener("click", () => {
    if (playButton.innerText === "Play") {
        if (!currentSong) setSong2(songs[0]);
        player.play();
        playButton.innerText = "Pause";
        startRangeView();
    } else {
        player.pause();
        playButton.innerText = "Play";
        stopRangeView();
    }
});
nextButton.addEventListener("click", playNext);
prevButton.addEventListener("click", () => {
    let ix = playQueue.indexOf(currentSong);
    if (ix >= 0) {
        if (--ix < 0) ix = playQueue.length - 1;
        playSong2(playQueue[ix]);
    }
});
