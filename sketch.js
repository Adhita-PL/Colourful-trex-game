var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("dinasaur-1.png","dinasaur-2.png","dinasaur-3.png","dinasaur-4.png");
  trex_collided = loadAnimation("dinasaur-1.png");



  cloudImage1 = loadImage("cloud1.png");
  cloudImage2 = loadImage("cloud2.png");
  cloudImage3 = loadImage("cloud3.png");
  cloudImage4 = loadImage("cloud4.png");

  obstacle1 = loadImage("obstacle-1.png");
  obstacle2 = loadImage("obstacle-2.png");
  obstacle3 = loadImage("obstacle-3.png");
  obstacle4 = loadImage("obstacle-4.png");
  obstacle5 = loadImage("obstacle-5.png");

  restartImg = loadImage("restart-1.png")
  gameOverImg = loadImage("Gameover.png")

  groundImage = loadImage("gd.jpg");
  sunimg = loadImage("Sun.png");
  jumpSound = loadSound("jumpSound.mp3");
  dieSound = loadSound("gameover.mp3");
  //checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  bgImage = loadImage("bg.jpg");
  
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width/2,height-0.00001,width,100);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2.5;
  
  trex = createSprite(50,height-400,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.3;
  
  gameOver = createSprite(width/2.1,height/3);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2.1,height/2.3);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.3;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(width/2,height-55,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  sun = createSprite(width-70,100);
  sun.addImage("sun",sunimg);
  sun.scale = 0.1;
  
  score = 0;
  
}

function draw() {  
  background(bgImage);
  //displaying score
  fill("black");
  textSize(15);
  text("Score: "+ score, width/12,height/9);
  
  fill("green");
  rect(width-1000,height-130,1000,1000);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(2 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       //checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("space"))&& trex.y >= height-220) {
        trex.velocityY = -12;
        touches=[];
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  


  drawSprites();
}

function reset(){
  gameState = PLAY;
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width - 10,height-140,0.1,0.1);
   obstacle.addImage(obstacle1);
   obstacle.velocityX = -(6 + score/100);
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width - 10,120,40,10);
    cloud.addImage(cloudImage4);
    cloud.y = Math.round(random(80,250));
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: cloud.addImage(cloudImage1);
              break;
      case 2: cloud.addImage(cloudImage2);
              break;
      case 3: cloud.addImage(cloudImage3);
              break;
      case 4: cloud.addImage(cloudImage4);
              break;
      default: break;
    }
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = windowWidth;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

