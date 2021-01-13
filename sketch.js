var PLAY = 1;
var END = 0;
var gameState = PLAY;
var canvas;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpSound,dieSound,checkpointSound;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bg,bgimg;
var score;
var gameOver,gimg,restart,rimg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  bgimg = loadImage("download.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
  gimg=loadImage("gameOver.png");
  rimg=loadImage("restart.png");
}

function setup() {
 canvas= createCanvas(displayWidth-200,displayHeight-500);
 // bg = createSprite(300,200);
 // bg = addAnimation("bgIMage",bgimg);
  trex = createSprite(10,180,20,50);
  trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  restart = createSprite(300,140);
  gameOver.addImage("gameOver",gimg);
  gameOver.scale = 0.5;
  restart.addImage("restart",rimg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the ground
    trex.velocityX=0.4;
    camera.position.x=displayWidth/75   ;
  // ground.velocityX = -(14)
    ground.velocityX = -(7 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      checkpointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 161.5){
      trex.velocityY = -12 ;
      jumpSound.play();
     // playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.6;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
     // playSound("jump.mp3");
      gameState = END;
      gameOver.visible = true;
      restart.visible = true;
      dieSound.play();
    }
  }
  
  else if(gameState === END) {
    
    
    //set velcity of each game object to 0
 //  trex.x=10;
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX =0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-5);
    cloudsGroup.setLifetimeEach(-5);

    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -8.5;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -8.6;
    
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
      case 6: obstacle.addImage(obstacle6);
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
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.x=10
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}