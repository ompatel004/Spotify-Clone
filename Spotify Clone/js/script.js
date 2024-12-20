
let currentSong = new Audio()
let prevSong;
let songs;
let currFolder;
let prevVol;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    
    seconds = Math.floor(seconds);
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${paddedMinutes}:${paddedSeconds}`;
}

function playSong(track, pause = false) {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";


    if (prevSong != currentSong) {
        for (const info of document.querySelector(".songList").getElementsByTagName("li")) {
            if (info.querySelector(".info") != null && info.querySelector(".info").firstElementChild.innerHTML == decodeURI(prevSong.split(`/${currFolder}/`)[1])) {
                info.style.color = "rgb(199, 199, 199)"
                info.style.backgroundColor = "black"
            }
        }
    }
    
    // console.log(currentSong); 
    
    for (const info of document.querySelector(".songList").getElementsByTagName("li")) {
        // console.log(info.querySelector(".info").firstElementChild.innerHTML);
        // console.log(decodeURI(currentSong.src.split(`/${currFolder}/`)[1]));
        
        
        if (info.querySelector(".info") != null && info.querySelector(".info").firstElementChild.innerHTML == decodeURI(currentSong.src.split(`/${currFolder}/`)[1])) {
            // console.log("true");
            info.style.color = "white"
            info.style.backgroundColor = "rgb(49 49 49)"
        }
    }
    prevSong = currentSong.src

}


async function getSongs(folder) {
    currFolder=folder
    let a = await fetch(`${folder}/`)
    
    let response = await a.text();
    // console.log(response) 
    
    let div = document.createElement("div")
    div.innerHTML = response;
    
    let as = div.getElementsByTagName('a')
    // console.log(as);
    songs = []
    
    for (let index = 0; index < as.length; index++) {
        
        const element = as[index];
        if (element.href.endsWith(".mp3")||element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // console.log(songs)
    playSong(songs[0], true)
    
    let sonUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    sonUL.innerHTML=""
    for (const song of songs) {
        sonUL.innerHTML = sonUL.innerHTML + `<li> 
        <img class="invert music" src="img/music.svg" alt="">
        <div class="info">
        <div>${decodeURI(song)}</div>
        <div>Justin Jay</div>
        <div></div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert play" src="img/play.svg" alt="">
        </div>
         </li>`;
    }

    // Attach Event listener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        //    console.log(e.querySelector(".info").firstElementChild.innerHTML);
        e.addEventListener("click", () => {
            playSong(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

}


async function displayAlbums(){
    let a = await fetch(`songs/`)
    
    let response = await a.text();
    // console.log(response) 
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".card-container")
    // console.log(anchors);
    let array=Array.from(anchors)
        // console.log(e.href);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if (e.href.includes("/songs/")) {
                let folder=e.href.split("/songs/")[1]
                //Get the meta data of the folder
                let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response.title,response.description);
            cardContainer.innerHTML=cardContainer.innerHTML+
            `<div data-folder="${folder}"  class="card rounded">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="50px" width="40px" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="256" fill="#1ed760"/>
            <polygon points="196,128 196,384 352,256" fill="black" transform="translate(35 27) scale(0.9) translate(-256 -256) translate(256,256)"/>
            </svg>
            </div>
            
            <img src="songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            </div>`
            
        }
    }
     
    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        // console.log(e);
        e.addEventListener('click',async item=>{
            console.log(item.currentTarget,item.currentTarget.dataset.folder);

            await getSongs(`songs/${item.currentTarget.dataset.folder}`)       
        })
    })
}

async function main() {
    
    await getSongs("songs/ncs")
    playSong(songs[0], true)


    //Display all the albums on the page
    displayAlbums()
        
    
    // var audio = new Audio(songs[0]);
    // // audio.play();
    
    // audio.addEventListener("loadeddata", () => {
        //   let duration = audio.duration;
        //   console.log(audio.duration);
        //   console.log(audio.currentSrc);
        //   console.log(audio.currentTime);
        
        //   // The duration variable now holds the duration (in seconds) of the audio clip
        // });
        
        
        // Attach Event listener to play,next and previous 
        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "img/pause.svg"
            } else {
                currentSong.pause()
                play.src = "img/play.svg"
            }
        })
        
        // add eventlistner for current time and duration of song
        
        currentSong.addEventListener("timeupdate", () => {
            // console.log(currentSong.currentTime,currentSong.duration);
            document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })
        
        // Add event listener to seekbar
        
        document.querySelector(".seekbar").addEventListener("click", (e) => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(percent);
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * currentSong.duration) / 100;
    })
    
    
    // Add event listener to seekbar
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0";
        // console.log(e);
    })
    
    // Add event listener for close button
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-120%";
        // console.log(e);
    })
    
    // Add event listener to previous and next
    
    previous.addEventListener("click", () => {
        let currentSongname = (currentSong.src.split(`/${currFolder}/`)[1])
        
        let index = songs.indexOf(currentSongname)
        
        if (index > 0)
            playSong(songs[index - 1])
        else
        playSong(songs[songs.length - 1])
    })
    
    next.addEventListener("click", () => {
        let currentSongname = (currentSong.src.split(`/${currFolder}/`)[1])
        // console.log(songs);
        // console.log(currentSongname);
        
        let index = songs.indexOf(currentSongname)
        
        if (index < songs.length - 1)
            playSong(songs[index + 1])
        else
        playSong(songs[0])
})

// Add event listener to volume    
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    // console.log(e,e.target,e.target.value);
    currentSong.volume=parseInt(e.target.value)/100;
})


//Add event listener to mute track
document.querySelector(".volume>img").addEventListener("click",(e)=>{
    // console.log(prevVol);
    
    if(document.querySelector(".volume").getElementsByTagName("img")[0].src.endsWith("img/volume.svg")){
        e.target.src="img/mute.svg"
        // console.log(e.target.src);
        currentSong.volume=0;
        prevVol=document.querySelector(".range").getElementsByTagName("input")[0].value;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }else{
        e.target.src="img/volume.svg"
        currentSong.volume=prevVol/100;
        
        document.querySelector(".range").getElementsByTagName("input")[0].value=prevVol;
    }
})

}

main() 
