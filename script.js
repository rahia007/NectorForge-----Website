//to get model 3d 
const beeModel = document.getElementById("bee-model");

// converting section (home,about,gallery,contact) to an array for easy access and manipulation
const sections = Array.from(document.querySelectorAll("section"));

//moving bee relative to camera position (horizontal,vertical) as scroll
const cameraOrbits = [[90 , 90] , [-45 , 90] , [-180 , 0] , [45 , 90]];

// Setting how far the bee shifts left/right ; array tells how far 3d element will shift in each section; 0 means whole page , -20 left 
const shiftPositions = [0, -20 , 0 ,25];

// store relative position of element For each section, gets how many pixels it is from the top of the page.  ; use map method to create an array of offset valeues (distance from top of page) and pixel
const sectionOffsets = sections.map(section => section.offsetTop);

//Define the variable last section-index ; this variable is used to store the last index of the sections array the value ; sections.length represents the total number of sections which is four then we subtract one since array indexing starts from zero if there are four sections the last index is three this variable is useful for determining the endpoint when calculating scroll progress
const lastSectionIndex = sections.length - 1; 

//interpolate is func to mix two number; Takes three inputs: start value, end value, and how far along (0 to 1); Blends them. If progress is 0.5, it's halfway between start and end. 
const interpolate = (start, ens, progress) => start + (ens - start) * progress ; 

//this function is used to calculate the scroll progress based on our position within the page 
const getScrollProgress = scrollY => 
    {
    for (let i=0 ; i<lastSectionIndex; i++) 
        {
        if(scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i+1] ) 
            {
            // return i + (scrollY - sectionOffsets[i] /sectionOffsets[i+1]- sectionOffsets[i]);
              const rawProgress =
                (scrollY - sectionOffsets[i]) /
                (sectionOffsets[i + 1] - sectionOffsets[i]);

            return i + rawProgress;
        
            }
        }
        return lastSectionIndex;
   };

window.addEventListener("scroll" , () => {
   const scrollProgress = getScrollProgress(window.scrollY); //saves the value returned by getscrollprogress function
   const sectionIndex = Math.floor(scrollProgress) ; 
   const sectionProgress = scrollProgress - sectionIndex; //to find how far we scroll within a current single section

   const currentShift = interpolate(
     shiftPositions[sectionIndex],
     shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex] , sectionProgress
   );

   //for bee mov rel to camera
   const currentOrbit = cameraOrbits[sectionIndex].map((val,i) => 
    interpolate(val , cameraOrbits[sectionIndex + 1]?.[i]?? val, sectionProgress)
);


   beeModel.style.transform = `translateX(${currentShift}%)`;

   //first hor then ver
   beeModel.setAttribute("camera-orbit" , `${currentOrbit[0]}deg ${currentOrbit[1]}deg`);
});


//for pollen display in bckgrnd
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.pointerEvents = 'none';

const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
    });
}

function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
    });
    requestAnimationFrame(animate);
}

animate();
//till here pollen





    

    
