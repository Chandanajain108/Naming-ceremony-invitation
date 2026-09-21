// ================= USER SETTINGS =================
// Change this date/time to your real event date.
const EVENT_DATE = new Date("September 6, 2026 11:45:00").getTime();
// =================================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => $('#loader')?.classList.add('hide'), 1000);
  $$('.reveal').forEach(el => revealObserver.observe(el));
  renderGallery();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
}, { threshold: 0.14 });

// Countdown
function updateCountdown(){
  const diff = EVENT_DATE - Date.now();
  const values = diff <= 0 ? [0,0,0,0] : [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60
  ];
  ['days','hours','minutes','seconds'].forEach((id,i)=>{
    const el = document.getElementById(id); if(el) el.textContent = String(values[i]).padStart(2,'0');
  });
}
updateCountdown(); setInterval(updateCountdown,1000);

// Wishes carousel
let wishIndex = 0;
function showWish(i){
  wishIndex = (i + 3) % 3;
  const track = $('#wishTrack');
  const mobile = innerWidth <= 850;
  track.style.transform = `translateX(${mobile ? -100*wishIndex : -33.33*wishIndex}%)`;
  $('#wishPage').textContent = `${wishIndex+1} / 3`;
}
$('#wishPrev').onclick = () => showWish(wishIndex-1);
$('#wishNext').onclick = () => showWish(wishIndex+1);
$('#wishPagePrev').onclick = () => showWish(wishIndex-1);
$('#wishPageNext').onclick = () => showWish(wishIndex+1);
window.addEventListener('resize',()=>showWish(wishIndex));

// Schedule carousel
const scheduleItems = [
  ['Welcome &<br>Gathering','10:30 am'],
  ['Lunch','12:30 pm'],
  ['Naming Ceremony','1:15 pm'],
  ['Blessings &<br>Goodbyes','2:30 pm']
];
let scheduleIndex=0;
function showSchedule(i){
  scheduleIndex=(i+4)%4;
  $('#scheduleTitle').innerHTML=scheduleItems[scheduleIndex][0];
  $('#scheduleTime').textContent=scheduleItems[scheduleIndex][1];
  $('#schedulePage').textContent=`${scheduleIndex+1}/4`;
}
$('#schedulePrev').onclick=()=>showSchedule(scheduleIndex-1);
$('#scheduleNext').onclick=()=>showSchedule(scheduleIndex+1);

// Wishes form
$('#generateButton').onclick=()=>{
  const name=$('#guestName').value.trim() || 'A loving friend';
  $('#guestWish').value=`Dear little one, may your life be filled with love, laughter, good health and beautiful memories. With lots of love, ${name} ❤️`;
};
$('#wishForm').addEventListener('submit',e=>{
  e.preventDefault();
  alert('Thank you! Your wishes have been received.');
  e.target.reset();
});

// Music
const music=$('#bgMusic'); let musicReady=false;
music.addEventListener('pause',()=>$('#muteButton').textContent='♪');
music.addEventListener('play',()=>$('#muteButton').textContent='🔊');
music.addEventListener('error',()=>alert('The music file could not be decoded. Replace assets/music.mp3 with a valid MP3 file.'));
$('#muteButton').onclick=async()=>{
  try{
    if(music.paused){ await music.play(); $('#muteButton').textContent='🔊'; }
    else { music.pause(); $('#muteButton').textContent='♪'; }
    musicReady=true;
  }catch(e){alert('Music could not start. Check that assets/music.mp3 is a valid MP3 file.');}
};

// Video demo
$('#playVideo').onclick=()=>alert('Replace this demo image with your own YouTube/video link if you want a real video.');

// Gallery: default photos + local upload preview
let galleryImages=['assets/photo1.jpg','assets/photo2.jpg','assets/photo3.jpg','assets/photo4.jpg'];
let galleryPage=0;
function renderGallery(){
  const grid=$('#galleryGrid'); grid.innerHTML='';
  const start=galleryPage*6;
  galleryImages.slice(start,start+6).forEach((src,i)=>{
    const item=document.createElement('button'); item.className='gallery-item'; item.type='button';
    item.innerHTML=`<img src="${src}" alt="Gallery photo ${start+i+1}">`;
    item.onclick=()=>openLightbox(src); grid.appendChild(item);
  });
  $('#galleryPage').textContent=`Page ${galleryPage+1}`;
}
$('#galleryPrev').onclick=()=>{if(galleryPage>0){galleryPage--;renderGallery();}};
$('#galleryNext').onclick=()=>{if((galleryPage+1)*6<galleryImages.length){galleryPage++;renderGallery();}};
$('#photoUpload').addEventListener('change',e=>{
  const files=[...e.target.files];
  files.forEach(file=>galleryImages.push(URL.createObjectURL(file)));
  galleryPage=Math.floor((galleryImages.length-1)/6); renderGallery();
});

// Lightbox
function openLightbox(src){$('#lightboxImage').src=src;$('#lightbox').classList.add('show');}
$('#closeLightbox').onclick=()=>$('#lightbox').classList.remove('show');
$('#lightbox').onclick=e=>{if(e.target.id==='lightbox')$('#lightbox').classList.remove('show');};

// Active nav based on scroll
const sections=[...document.querySelectorAll('main section[id]')];
window.addEventListener('scroll',()=>{
  const y=scrollY+120;
  let current='home'; sections.forEach(s=>{if(y>=s.offsetTop) current=s.id;});
  $$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
});
