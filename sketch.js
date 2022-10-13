/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score = 0;
var flagpole;
var lives;

var jumpSound;
var bgSong;
var flagpoleSound;
var enemySound;
var fallSound;

var enemies;
var platforms;

let bg;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    
    jumpSound = loadSound('assets/jump.wav')
    jumpSound.setVolume(0.2);
    
    bgSong = loadSound('assets/bgsound.mp3')
    bgSong.setVolume(0.2);
    
    flagpoleSound = loadSound('assets/flag.mp3')
    flagpoleSound.setVolume(0.02);
    
    enemySound = loadSound('assets/enemyhurt.mp3')
    enemySound.setVolume(0.4);
    
    fallSound = loadSound('assets/fall.mp3')
    fallSound.setVolume(0.3);
}


function setup()
{
    bgSong.play();
    bg = loadImage('assets/backg.jpg');
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 4;
    startGame();

}

function startGame()
{
    gameChar_x = width/2;
    gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;
   

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
     trees_x = [50,250,450,650,850,1050,1250,1450,-250,-450,-650];
    clouds = [
        {x_pos: random(-1200,2000), y_pos: 50, size: 50},
        {x_pos: random(-1200,2000), y_pos: 70, size: 50},
        {x_pos: random(-1200,2000), y_pos: 90, size: 50},
        {x_pos: random(-1200,2000), y_pos: 90, size: 50},
        {x_pos: random(-1200,2000), y_pos: 50, size: 50},
        {x_pos: random(-1200,2000), y_pos: 50, size: 50},
        {x_pos: random(-1200,2000), y_pos: 50, size: 50}
    ];
    
    mountains = [
        {x_pos: random(-1000,1000), width: 100},
        {x_pos: 620, width: 100},
        {x_pos: random(-1000,1000), width: 100},
        {x_pos: 1220, width: 100},
        {x_pos: random(-1000,1000), width: 100},
        {x_pos: random(-1000,1000), width: 100},
        {x_pos: random(-1000,1000), width: 100},
        {x_pos: random(-1000,1000), width: 100},
                ];
    canyon = [
              {x_pos: 100, width: 100},
              {x_pos: 700, width: 100},
              {x_pos: 1300, width: 100},
              {x_pos: 1700, width: 100},
              {x_pos: -100, width: 100}
             ];
    collectable = [
        {x_pos: 750, y_pos: 320, size: 50},
        {x_pos: 350, y_pos: 432, size: 50},
        {x_pos: 50, y_pos: 332, size: 50},
        {x_pos: 1050, y_pos: 300, size: 50},
                  ];
    
    flagpole =
        {
            isReached: false,
            x_pos: 2000
        }
    lives-=1;
    
    enemies = [];
    
        enemies.push(new Enemy(50, floorPos_y-95, 100));
        enemies.push(new Enemy(320, floorPos_y+10, 100));
        enemies.push(new Enemy(1020, floorPos_y+10, 100));
    
    
    platforms = [];
        platforms.push(createPlatform(5,floorPos_y-100,150));
        platforms.push(createPlatform(1000,floorPos_y-100,150));
        
}

function draw()
{
	background(bg); // fill the sky blue

	stroke(0);
	fill(0, 244, 136);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);
    
    drawClouds();
    drawMountains();
    drawTrees();


    if(gameChar_x > canyon.x_pos && gameChar_x < canyon.x_pos + canyon.width && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
        }
    if (isPlummeting == true)
        {
            gameChar_y += 3;
        }
    else
        {
            isPlummeting == false;
        }
	// Draw canyons.
    for(var c = 0; c < canyon.length; c++)
         {
            drawCanyon(canyon[c]);
            checkCanyon(canyon[c]);

         }


	// Draw collectable items.
    for(var o = 0; o < collectable.length; o++)
    {
        if(!collectable[o].isFound)
            {
                drawCollectable(collectable[o])
                checkCollectable(collectable[o])   
             }
        }
    
    for(var i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }
    
    for(var i = 0; i<enemies.length; i++)
        {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContact(gameChar_world_x,gameChar_y))
            {
                enemySound.play();
                startGame();
                break;
            }
        }
    
    renderFlagpole();
    
    if (flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    pop();
    
    
    fill(204, 255, 49,70);
    rect(50,10,100,50);
    
    fill(204, 255, 49,70);
    rect(840,10,100,50);
    
    stroke(0);
    fill(255,0,0);
    textSize(28);
    text("Lives:" + lives, 850, 40);
    
    fill(255,0,0);
    textSize(28);
    text("Score:" + game_score, 50,40);

	// Draw game character.
	
	drawGameChar();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
        {
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 3;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 3;
		}
		else
		{
			scrollPos -= 3; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

     if(gameChar_y!=floorPos_y)
        {
            var isContact = false;
            
            for(var i = 0; i < platforms.length; i++)
                {
                    if(
                        platforms[i].checkContact(gameChar_world_x, gameChar_y) == true
                      )
                    {
                        isContact = true;
                        break;
                    }
                }
            if(isContact == false)
                {
                    gameChar_y+=2;
                    isFalling = true;
                }
            else 
            {
                isFalling = false;
            }
        }
    else{
            isFalling = false;
        }
    
    if(isPlummeting == true)
        {
            {
                gameChar_y += 2;
            }
            if(gameChar_y > height)
            {
                bgSong.stop();
                startGame();
                bgSong.play();
            }
        }
    
    if(lives < 1)
        {
            fill(255, 130, 121);
            noStroke();
            textSize(40);
            textSize(BOLD);
            text("GAME OVER! Press Space To Continue", width/2-400, height/2-100);
            bgSong.stop();
            isFalling = false;
            isRight = false;
            isLeft = false;
            isPlummeting = false;
            keyPressed = false;
            return;
            
        }
    
      if(flagpole.isReached == true)
        {
            fill(255, 0, 0);
            noStroke();
            textSize(30);
            textStyle(BOLD);
            text("LEVEL COMPLETE, YOUR SCORE WAS:"+ game_score, width/2-470 , height/2-100); 
            text("PRESS SPACE TO CONTINUE", width/2-470 , height/2-70);
            isFalling = false;
            isRight = false;
            isLeft = false;
            isPlummeting = false;
            keyPressed = false;
            bgSong.stop();
            flagpoleSound.play();
        return;
        }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    

    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
    {
        console.log("press" + keyCode);
        console.log("press" + key);
    
        if(keyCode == 65)
        {
            isLeft = true;
        }
    
        if(keyCode == 68)
        {
            isRight = true;
        }
        if(keyCode == 87 && gameChar_y == floorPos_y)
        {
            gameChar_y -= 130;
            jumpSound.play();
        }
        
        if(keyCode == ' ')
            {
                vid.play(true);
            }

}

function keyReleased()
{
    console.log("release" + keyCode);
	console.log("release" + key);
    
    if(keyCode == 65)
    {
        isLeft = false;
    }
    
    if(keyCode == 68)
    {
        isRight = false;
    }

}



// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	
		// add your jumping-left code
    {
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
    //arms
        ellipse(
        gameChar_x-15,
        gameChar_y-35,
        7,
        14,);
    
        ellipse(
        gameChar_x+14,
        gameChar_y-25,
        7,
        10,);
    
    //feet
        fill(255,105,180);
        ellipse(
        gameChar_x-10,
        gameChar_y-10,
        16,
        8);
    
        ellipse(
        gameChar_x+5,
        gameChar_y-10,
        8,
        14);
    
    //eyes
        fill(30,144,255);
        ellipse(
        gameChar_x-10,
        gameChar_y-30,
        3,
        9);
        ellipse(
        gameChar_x-2,
        gameChar_y-30,
        3,
        9);
    
    //mouth
        fill(255,51,51)
        arc(
        gameChar_x-5,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);

	}
    
    else if(isRight && isFalling)
    {
		// add your jumping-right code
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
    //arms
        ellipse(
        gameChar_x-14,
        gameChar_y-25,
        7,
        10,);
    
        ellipse(
        gameChar_x+16,
        gameChar_y-33,
        7,
        14,);
    
    //feet
        fill(255,105,180);
        ellipse(
        gameChar_x-5,
        gameChar_y-10,
        8,
        16);
    
        ellipse(
        gameChar_x+10,
        gameChar_y-10,
        16,
        8);
    
    //eyes
        fill(30,144,255);
        ellipse(
        gameChar_x,
        gameChar_y-30,
        3,
        9);
    
        ellipse(
        gameChar_x+8,
        gameChar_y-30,
        3,
        9);
    
    //mouth
        fill(255,51,51)
        arc(
        gameChar_x+5,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);

	}
	   else if(isLeft)
    {
		// add your walking left code
        
          //body
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
    //arms
        ellipse(
        gameChar_x-14,
        gameChar_y-25,
        14,
        7,);
    
        ellipse(
        gameChar_x+14,
        gameChar_y-25,
        7,
        10,);
    
    //feet
        fill(255,105,180);
        ellipse(
        gameChar_x-10,
        gameChar_y-10,
        16,
        8);
    
        ellipse(
        gameChar_x+5,
        gameChar_y-10,
        14,
        8);
    
    //eyes
        fill(30,144,255);
        ellipse(
        gameChar_x-10,
        gameChar_y-30,
        3,
        9);
        ellipse(
        gameChar_x-2,
        gameChar_y-30,
        3,
        9);
    
    //mouth
        fill(255,51,51)
        arc(
        gameChar_x-5,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);

	}
    else if(isRight)
    {
		// add your walking right code
        
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
    //arms
        ellipse(
        gameChar_x-14,
        gameChar_y-25,
        7,
        10,);
    
        ellipse(
        gameChar_x+14,
        gameChar_y-25,
        14,
        7,);
    
    //feet
        fill(255,105,180);
        ellipse(
        gameChar_x-5,
        gameChar_y-10,
        14,
        8);
    
        ellipse(
        gameChar_x+10,
        gameChar_y-10,
        16,
        8);
    
    //eyes
        fill(30,144,255);
        ellipse(
        gameChar_x,
        gameChar_y-30,
        3,
        9);
    
        ellipse(
        gameChar_x+8,
        gameChar_y-30,
        3,
        9);
    
    //mouth
        fill(255,51,51)
        arc(
        gameChar_x+5,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
    //arms
        ellipse(
        gameChar_x-14,
        gameChar_y-25,
        7,
        10,);
    
        ellipse(
        gameChar_x+16,
        gameChar_y-30,
        7,
        14);
    
    //feet
        fill(255,105,180);
        ellipse(
        gameChar_x-10,
        gameChar_y-10,
        8,
        16);
    
        ellipse(
        gameChar_x+10,
        gameChar_y-10,
        8,
        16);
    
    //eyes
        fill(30,144,255);
        ellipse(
        gameChar_x-5,
        gameChar_y-30,
        9,
        1);
    
        ellipse(
        gameChar_x+5,
        gameChar_y-30,
        9,
        1);
    
    //mouth
        fill(255,51,51)
        arc(
        gameChar_x,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);

	}
	else
	{
		// add your standing front facing code
        fill(255,192,203);
        rect(
        gameChar_x-12,
        gameChar_y-40,
        25,
        30,
        10);
    
        ellipse(
        gameChar_x-14,
        gameChar_y-25,
        7,
        14,);
    
        ellipse(
        gameChar_x+14,
        gameChar_y-25,
        7,
        14,);
    
        fill(255,105,180);
        ellipse(
        gameChar_x-10,
        gameChar_y-10,
        16,
        8);
        ellipse(gameChar_x+10,
        gameChar_y-10,
        16,
        8);
    
        fill(30,144,255);
        ellipse(gameChar_x-5,
        gameChar_y-30,
        3,
        9);
    
        ellipse(gameChar_x+5,
        gameChar_y-30,
        3,
        9);
    
        fill(255,51,51)
        arc(gameChar_x,
        gameChar_y - 22,
        8,
        7,
        0,
        PI);
}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var a = 0; a < clouds.length; a++)
    {
    noStroke();
    fill(255);
    ellipse(
            clouds[a].x_pos,clouds[a].y_pos,
            clouds[a].size +100,
            clouds[a].size-25);
    ellipse(
            clouds[a].x_pos+20,
            clouds[a].y_pos,
            clouds[a].size+50,
            clouds[a].size-90);
    ellipse(
            clouds[a].x_pos+40,
            clouds[a].y_pos,
            clouds[a].size +100,
            clouds[a].size-65);
    
    
    noStroke();
    fill(255);
    ellipse(
            clouds[a].x_pos+600,
            clouds[a].y_pos,
            clouds[a].size +100,
            clouds[a].size -25);
    ellipse(
            clouds[a].x_pos+620,
            clouds[a].y_pos, 
            clouds[a].size +50,
            clouds[a].size -95);
    ellipse(
            clouds[a].x_pos+640,
            clouds[a].y_pos,
            clouds[a].size +50,
            clouds[a].size +5);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var k = 0; k < mountains.length; k++)
    {
        noStroke();
        fill(155,86,7);
        triangle(
                mountains[k].x_pos,
                250,
                mountains[k].x_pos - 100,
                433,
                mountains[k].x_pos + 150,
                435);
        triangle(
                mountains[k].x_pos - 70,
                300,
                mountains[k].x_pos-200,
                433,
                mountains[k].x_pos + 150,
                435);
        fill(255);
        triangle(
                mountains[k].x_pos,
                250,
                mountains[k].x_pos- 27,
                300,
                mountains[k].x_pos +40,
                300);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
    stroke(0);
    fill(71,52,14);
    rect(
        trees_x[i] - 30,
        floorPos_y - 90,
        62,
        150);
    
    noStroke();
    fill(219, 162, 246);
    ellipse(
            trees_x[i] - 50,
            floorPos_y - 50,
            65,
            60);
    ellipse(
            trees_x[i],
            floorPos_y - 50,
            65,
            60);
    ellipse(
            trees_x[i]+ 50,
            floorPos_y - 50,
            65,
            60);
    ellipse(
            trees_x[i],
            floorPos_y -100,
            90,
            90);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke();
    fill(255, 15, 136,127);
    rect(
        t_canyon.x_pos,
        432,
        t_canyon.width,
        150)
        
        noStroke();
    fill(255, 15, 136)
    rect(
        t_canyon.x_pos,
        532,
        t_canyon.width,
        80)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
            fallSound.play();
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    noStroke();
    fill(53, 38, 231);
    ellipse(
        t_collectable.x_pos,
        t_collectable.y_pos,
        t_collectable.size);
    
    noStroke();
    fill(53, 162, 231);
    ellipse(
        t_collectable.x_pos,
        t_collectable.y_pos,
        t_collectable.size -20);
    
    noStroke();
    fill(53, 218, 231);
    ellipse(
        t_collectable.x_pos,
        t_collectable.y_pos,
        t_collectable.size -40);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x,
                 gameChar_y,
                 t_collectable.x_pos,
                 t_collectable.y_pos);
    
    if(d < 50)
     {
         game_score+=1;
        t_collectable.isFound = true;
     }
    
    
    if(t_collectable.isFound == false);
    
}

function renderFlagpole()
    {
        push();
        
        strokeWeight(5);
        stroke(255);
        line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 350);
        fill(178,95,239);
        noStroke();

        if(flagpole.isReached)
        {
            rect(flagpole.x_pos, floorPos_y - 50, 75, 50);
        }
        else
        {
            rect(flagpole.x_pos, floorPos_y - 350, 75, 50);  
        }
        
        pop();
    }

 function checkFlagpole()
    {
        var a = abs(gameChar_world_x - flagpole.x_pos);

        if(a < 15)
        {
            flagpole.isReached = true;
        }
    }
function Enemy(x,y,range)
    {
        this.x = x;
        this.y = y;
        this.range = range;
        this.current_x = x;
        this.incr = 1;
        
        this.draw = function()
        {
        fill(252, 198, 147);
        rect(this.current_x-12,this.y-40,25,30,10);
            
            
        fill(252, 157, 114);
        ellipse(this.current_x-14,this.y-25,7,14,);
        ellipse(this.current_x+14,this.y-25,7,14,);
    
        fill(252, 123, 68);
        ellipse(this.current_x-10,this.y-10,16,8);
        ellipse(this.current_x+10,this.y-10,16,8);
    
        fill(0);
        ellipse(this.current_x-5,this.y-30,3,9);
    
        ellipse(this.current_x+5,this.y-30,3,9);
        }
        
        this.update = function()
        {
            this.current_x += this.incr;
            
            if(this.current_x < this.x)
            {
                this.incr = 1;
            }
            else if(this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
        }
        this.isContact = function(gc_x, gc_y)
        {
            var d = dist(gc_x,gc_y,this.current_x,this.y)
            if(d < 25)
            {
                return true;
            }
            return false;
        }
    }

function createPlatform(x,y,length)
    {
        var isContact = false;
        var p = 
        {
            x: x,
            y: y,
            length: length,
            draw: function()
            {
                fill(125, 113, 163);
                stroke(0);
                rect(this.x, this.y, this.length, 10);
            },
            
            checkContact: function(gc_x,gc_y)
            {
                if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y+10;
                    if(d >=0 && d<5)
                    {
                        return true;
                    }
                }
                return false;
            }   
        }
        return p;
    }
