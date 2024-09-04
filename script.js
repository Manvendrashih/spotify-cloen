console.log("Sptify Clone");
let currentsong = new Audio;
let song;
let currfolder;



function secondminite (second) {
    if(isNaN(second) || second < 0) {
        return "INvalid Input"
    }

    const minuts = Math.floor(second / 60);
    const remainingSrconds = Math.floor(second % 60);

    const formatings = String(minuts).padStart(2, '0');
    const formatingSrconds = String(remainingSrconds).padStart(2, '0');

    return `${formatings}:${formatingSrconds}`;
}
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let respose = await a.text();
    let div = document.createElement("div");
    div.innerHTML = respose;
    let as = div.getElementsByTagName("a")

    song = [];
    for (let i = 0; i < as.length; i++) {
        const aref = as[i];
        if (aref.href.endsWith(".mp3")) {
        
            song.push(aref.href.split(`/${currfolder}/`)[1]);
        }
    }

    //card song add

    let songsuse = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songsuse.innerHTML = "";
    for (let songs of song) {
        songsuse.innerHTML = songsuse.innerHTML + `
            
            <li>
                 <img class="itility" src="img/song.svg" alt="song" >
                 <div class="info">
                     ${songs.replaceAll("(PaglaSongs).mp3", " ")} 
                 </div>
                 <div class=".play">    
                  <img class="itility" src="img/playsong.svg" alt="">
                 </div> 
            </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").innerHTML);
            palysong(e.querySelector(".info").innerHTML.trim());
            play.src="img/pose.svg";
            currentsong.play();
        });

    });
    
    //privew Na d Next
    prive.addEventListener("click", e => {
        currentsong.pause()
        console.log("privew")
        
        let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if((index-1) >= 0){
            palysong(song[index-1])
        }
       
    });

    next.addEventListener("click", e => {
        currentsong.pause();
        console.log("next")

        let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if((index+1) < song.length){
            palysong(song[index+1])
        }
    });


    //pay and pose
    play.addEventListener("click", () => {
        if(currentsong.paused){
            currentsong.play();
            play.src="img/pose.svg";
        }
        else{
            currentsong.pause();
            play.src="img/playsong.svg" ;
        }

    });
    
}

const palysong = (track ,pause=false) => {
    
    currentsong.src = `/${currfolder}/` + track;

    if(!pause){
        currentsong.play();
        play.src="img/pose.svg" ;
    }

    document.querySelector(".songname").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

//dispay aboms
async function dispayabomb () {
    let a = await fetch(`http://127.0.0.1:5500/song/`);
    let respose = await a.text();
    let div = document.createElement("div");
    div.innerHTML = respose;    
    let as = div.getElementsByTagName("a")

    Array.from(as).forEach(e=>{
        if(e.href.includes("/song")){
            console.log(e.href.split("/").slice(-1)[0])
        }
    })
}

async function main() {
    await getsongs("song/rendom" );
    palysong(song[0],true);

    dispayabomb();    
    
    currentsong.addEventListener("timeupdate", () => { 
        document.querySelector(".songtime").innerHTML =  `${secondminite(currentsong.currentTime)}/${secondminite(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration) *100 + "%";
    });

    document.querySelector(".sikbar").addEventListener("click", e => {
        let presrnt = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = presrnt +"%";
        currentsong.currentTime = ((currentsong.duration)*presrnt)/100;
    });

    document.querySelector(".ingofhamebarger").addEventListener("click", e => {
        document.querySelector(".left").style.left ="0px"
    });

    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left ="-120%"
    });
   


    document.querySelector(".soundlog").addEventListener("click", e => {
        let sou = document.querySelector(".sou");
        if(currentsong.volume > 0) {
            sou.src = "img/soundof.svg";
            currentsong.volume = 0.0;
        }
        else{
            sou.src = "img/sound.svg";
            currentsong.volume = 1.0;
        }
    });


    //add to clik card
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
       e.addEventListener( "click",async item => {
        song = await getsongs(`song/${item.currentTarget.dataset.folder}` )
        });
    });

}
main();
