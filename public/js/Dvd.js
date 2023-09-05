// Script For Moving A Dvd-Logo around the page like the old dvd screensavers
// ignore my horrible code im still learning
// Made By: Skeley (discord: .skeley)


// run update each millisecond (probably bad practice idk)
setInterval(Update, 1);

// speed of dvd logo
var xVel = 1;
var yVel = 1;

// keep track of how many bounces
var bounces = 0;
var cornerBounces = 0;

// current X Y pos
var currentX = 1;
var currentY = 1;

// update function
function Update()
{
    updateLogoVelocity();
    moveDvdLogo(); 
}

// incriment the position of the dvd by the velocity
function moveDvdLogo()
{
    var logo = document.getElementById('dvd-logo');
    currentX = currentX + xVel;
    currentY = currentY + yVel;

    logo.style.left = currentX + 'px';
    logo.style.top = currentY +'px';
}

// change the speed and or direction of the logo 
function updateLogoVelocity()
{
    let cornerBounce = 0;

    let logo = document.getElementById('dvd-logo');

    let sizeX = window.innerWidth - (window.innerWidth * 0.1);
    let sizeY = window.innerHeight - (window.innerHeight * 0.12);

    // if the logo is at the top or bottom reverse the yvel
    if (currentY >= sizeY || currentY <= 0) {
        yVel = -yVel;
        cornerBounce++;
        bounces++;

        // update bounce display
        let counter = document.getElementById('dvd-bounces')
        counter.textContent = "Bounces: " + bounces

        // snap it to the edge of the screen
        if (currentY >= sizeY + 10)
        {
            currentY = sizeX
        }
    }

    // if the logo is at the top or bottom reverse the yvel
    if (currentX >= sizeX || currentX <= 0) {
        xVel = -xVel;
        cornerBounce++;
        bounces++;

        // update bounce display
        let counter = document.getElementById('dvd-bounces')
        counter.textContent = "Bounces: " + bounces        

        // if the logo is outside the bounds of the screen move it to the edge
        if (currentX >= sizeX + 10)
        {
            currentX = sizeX
        }     
    }
    

    if (cornerBounce == 2)
    {
        console.log("Corner Bounce!");
        cornerBounces++;

        // update corner bounces counter
        let counter = document.getElementById('dvd-bounces-corner');
        counter.textContent = "Corner Bounces: " + cornerBounces;
    }
}