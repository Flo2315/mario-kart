manifest = [{id:"background", src:"img/background.jpg"},
            {id:"background2", src:"img/background2.jpg"},
            {id:"background3", src:"img/background3.jpg"},
            {id:"gameoverImage", src:"img/gameover.jpg"},
            {id:"missileSprite", src:"img/objets.png"},
            {id:"missileMonsterSprite", src:"img/objets.png"},
            {id:"missile2MonsterSprite", src:"img/feu.png"},
            {id:"monsterSprite", src:"img/boss.png"},
            {id:"concurentsSprite", src:"img/concurents.png"},
            {id:"bossSprite", src:"img/boss.png"},
            {id:"spaceSprite", src:"img/player.png"},
            {id:"heartSprite", src:"img/vie.png"}];

var scoreTotal = 0;


function start(levelNum)
{
      //console.log("start game");

      if(levelNum === 1){
        level             = 1; 
      }else{
         level            = levelNum; 
      }
      
     // console.log("level "+ level);
     // console.log("level apres"+ levelNum);

      tabFirePlayer     = new Array();
      speedFirePlayer   = 5;

      tabFireMob        = new Array();
      tailleMob         = 0.7;
      speedFireMob      = 1.5;
      intervalTir       = 2000;
      
      tabBoss           = new Array();
      tabFireBoss       = new Array();
      speedFireBoss     = 4;
      vieBossTire       = 0;
      vieBoss           = 20;

      tabCoeur          = new Array();
      coeur             = 5;
      tabCoeurMove      = new Array();
      speedCoeurMove    = 2
      percentChanceCoeur= 5;
      
      pointParTir       = 50;
      pointParTirMissile= 1;
      
      coeurPerduTotal   = 0;
      
      bossActive              = false;

      levelMap();


      if(bossActive){
        //createBoss();
      }else{
        rowsMobs          = listMobs.length;
        colsMobs          = listMobs[0].length;
      }

      tabMobs           = new Array();
      


      speedXMobs        = 10;
      speedYMobs        = 3;
      dirXMob           = 0;
      dirYMob           = 1;
      posYMob           = 0;

      speedXBoss        = 10;
      speedYBoss        = 3;
      dirXBoss           = 0;
      dirYBoss           = 1;
 
      createBackground();
      createFPSViewer();
      levelAffiche();
      createPlayer("Stand");
      if(bossActive){

        createBoss();
        if(tabBoss.length != 0){interval = setInterval(gestionTirBoss, intervalTir);}
        //gestionTirBoss();
        vieNbBoss();

      }else{
        createMobs();
        if(tabMobs.length != 0){ interval = setInterval(gestionTirMob, intervalTir);}

      }
      
      createHearts();
      getScore();
      
      
      
      

      restart = createjs.Ticker.on("tick", this.tickerGame);
      createjs.Ticker.useRAF = false;
      createjs.Ticker.setFPS(60);
      stage.snapToPixel = true;

     //stage.update();
}


function tickerGame()
{
      mvtPlayer();
      mvtFirePlayer();
     
      if(bossActive){
        mvtBoss();
        mvtFireBoss();
      }else{
        mvtMobs();
        mvtFireMob();
      }

      mvtHeart();
      
      fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " FPS";
      stage.update();
}


function createFPSViewer()
{
      fpsLabel =  new createjs.Text("FPS", "bold 25px Arial", "#000");
      fpsLabel.x = 10;
      fpsLabel.y = 5;
      stage.addChild(fpsLabel);
}

function createBackground()
{
  //console.log(bossActive);
    if(level < 5){
     background = new createjs.Bitmap(backgroundImage);
    }
    else if(level == 5){
      background = new createjs.Bitmap(background3Image);
    }else if(level > 5){
     background = new createjs.Bitmap(background2Image);
    }
      
      background.scaleX = 0.9;
      background.scaleY = 0.9;
      background.regX = 0;
      background.regY = 160;
      background.snapToPixel = true; 
      stage.addChild(background);
}

function reload(){
    createjs.Ticker.off("tick", restart);
    clearInterval(interval); 
    start(level);
}

function reloadWinner(){
    createjs.Ticker.off("tick", restart);
    clearInterval(interval); 
    //console.log("level fin niveau"+ level);
    // console.log("level plus niveau"+ (level+1));
    start(level+1);
}

function winner(){
    //console.log("gagner");
    if(level == 10){
      winnerLabel =  new createjs.Text("Winner, Fin t'et trop fort :) ", "bold 25px Arial", "#ff0000");
      winnerLabel.x = canvas.width/3;
      winnerLabel.y = canvas.height/2;
      stage.addChild(winnerLabel);
      createjs.Ticker.removeAllEventListeners();
      
    }else{
      winnerLabel =  new createjs.Text("Winner, Niveau suivant dans 5s ", "bold 25px Arial", "#fff");
      winnerLabel.x = canvas.width/3;
      winnerLabel.y = canvas.height/2;
      stage.addChild(winnerLabel);
      createjs.Ticker.removeAllEventListeners();
      
      //createjs.Ticker.addEventListener("click", reload);
      setTimeout(function(){reloadWinner()},5000);
    }

    //stage.addEventListener("click", start)
    //console.log("----->"+tabMobs.length);
}

function gameover(){
    gameoverVar = new createjs.Bitmap(gameoverImageImage);
    gameoverVar.scaleX = 1;
    gameoverVar.scaleY = 1;
    gameoverVar.regX = 0;
    gameoverVar.regY = 0;
    gameoverVar.snapToPixel = true;
    stage.addChild(gameoverVar);
    player = createPlayer("Explose");
    createjs.Ticker.removeAllEventListeners();


    winnerLabel =  new createjs.Text("La partie reprend dans 5s", "bold 25px Arial", "#fff");
    winnerLabel.x = canvas.width/3;
    winnerLabel.y = canvas.height/1.5;
    stage.addChild(winnerLabel);
    
    setTimeout(function(){reload()},5000);
 
 
   
    
    
   
}


function createPlayer(type){
      var definitionPlayer = {
            framerate : 25,
            images : [spaceSpriteImage],
            frames : {
                  width : 150,
                  height : 128,
                  count : 1,
                  regX : 75,
                  regY : 128
            },
            animations :{
                  typeStand : {frames: [0]}
                  //typeExplose : {frames: [3]}
            } 
      }

      var playerSheet = new createjs.SpriteSheet(definitionPlayer);
      player = new createjs.Sprite(playerSheet, "type"+type);
      player.x = canvas.width-55;
      player.y = canvas.height/2;
      player.scaleX = 0.7;
      player.scaleY = 0.7;
      player.snapToPixel = true;

      stage.addChild(player);
      stage.addEventListener("click", createFirePlayer);
}

function createHeart(type){
      var definitionHeart = {
            framerate : 25,
            images : [heartSpriteImage],
            frames : {
                  width : 76,
                  height : 86,
                  count : 1,
                  regX : 38,
                  regY : 86
            },
            animations :{
                  typevie : {frames: [0]}
            } 
      }

      var heartSheet = new createjs.SpriteSheet(definitionHeart);
      var heart = new createjs.Sprite(heartSheet, "type"+type);
      
      heart.scaleX = 0.7;
      heart.scaleY = 0.7;
      heart.snapToPixel = true;
      stage.addChild(heart);
      
      return heart;
}

function createHearts(){
    for(var h = 0; h < coeur; h++){
        heart = createHeart("vie");
        heart.x = canvas.width-(25+ h*spriteEasyWidth(heart));
        heart.y = 50;
        tabCoeur[tabCoeur.length] = heart;
    }
}
function removeHearts(){
    var posX = tabCoeur[coeur-1].x;
    var posY = tabCoeur[coeur-1].y;
    stage.removeChild(tabCoeur[coeur-1]);
    /*heart = createHeart("vide");
    heart.x = posX;
    heart.y = posY;*/
    coeur --;
    if(coeur === 0){
        //console.log("coeur ---->"+coeur);
        gameover();
    }
    
}
function lacheHeart(mob){
    perrcent=Math.random()*100;
    if(perrcent <= percentChanceCoeur) {
        var heart = createHeart("vie");
        tabCoeurMove[tabCoeurMove.length] = heart;
        heart.x = mob.x;
        heart.y = mob.y;
        heart.scaleX = 0.5;
        heart.scaleY = 0.5;
    }
}
function addHeart(){
    if(coeur < 5 ){
        var posX = tabCoeur[coeur].x;
        var posY = tabCoeur[coeur].y;
        stage.removeChild(tabCoeur[coeur]);
        heart = createHeart("vie");
        heart.x = posX;
        heart.y = posY;
        coeur++;
    }
}

function getScore(){
     if(scoreTotal < 0){
         scoreTotal = 0;
     }
      scoreLabel =  new createjs.Text("Score : " + scoreTotal, "bold 25px Arial", "#000");
      scoreLabel.x = canvas.width/2;
      scoreLabel.y = 5;
      stage.addChild(scoreLabel);
}

function plusScore(type){
   if(type === "missile"){
       scoreTotal += pointParTirMissile*coeur;
   }else if(type === "monster"){
       scoreTotal += pointParTir*coeur;
   }
   
    stage.removeChild(scoreLabel);
    getScore();
}

function moinsScore(){
    if(coeurPerduTotal > 0){
        scoreTotal -= pointParTir*coeurPerduTotal;
    }
    stage.removeChild(scoreLabel);
    getScore();
}
function createMob(type){

     /* if(type<0 || type>3){
            console.log("function createMob param type is not");
            
            
      }*/

      var definitionMob = {
            framerate : 25,
            images : [concurentsSpriteImage],
            frames : {
                  width : 136,
                  height : 128,
                  count : 8,
                  regX : 0,
                  regY : 0
            },
            animations :{
                  type0 : {frames: [0]},
                  type1 : {frames: [1]},
                  type2 : {frames: [2]},
                  type3 : {frames: [3]},
                  type4 : {frames: [4]},
                  type5 : {frames: [5]},
                  type6 : {frames: [6]},
                  type7 : {frames: [7]}
            } 
      }

      var mobSheet = new createjs.SpriteSheet(definitionMob);
      var mob = new createjs.Sprite(mobSheet, "type"+type);
      mob.scaleX = tailleMob;
      mob.scaleY = tailleMob;
      mob.snapToPixel = true;

      stage.addChild(mob);
     
      return mob;
}

function createMobs(){
  
  for(var r=0; r< rowsMobs; r++){
        for(var c=0; c< colsMobs; c++){
            //console.log(tabMobs[c][r]);
            
            if(listMobs[r][c] != -1){
              //console.log(listMobs[c][r]);
              
               var mob = createMob(listMobs[r][c]);
                 mob.x   = c * spriteEasyWidth(mob);
                mob.y   = 40+ r * spriteEasyHeight(mob);
                tabMobs[tabMobs.length] = mob;
              
            }
            
        }
    }
    // console.log("------>"+tabMobs);
    //die();
    
}
   
function createFirePlayer(){

      typeObject = Math.floor((Math.random()*8)+1);

      var definitionFire = {
            framerate : 25,
            images : [missileMonsterSpriteImage],
            frames : {
                  width : 76,
                  height : 86,
                  count : 9,
                  regX : 0,
                  regY : 0
            },
            animations :{
                  type1 : { frames: [0]},
                  type2 : { frames: [1]},
                  type3 : { frames: [2]},
                  type4 : { frames: [3]},
                  type5 : { frames: [4]},
                  type6 : { frames: [5]},
                  type7 : { frames: [6]},
                  type8 : { frames: [8]}               

            } 
      }

      var fireSheet = new createjs.SpriteSheet(definitionFire);
      var fire = new createjs.Sprite(fireSheet, "type"+typeObject);
     
      fire.x = player.x - 50;
      fire.y = player.y - 50;
      fire.scaleX =0.4;
      fire.scaleY =0.4;
      fire.snapToPixel =true;

      stage.addChild(fire);
      tabFirePlayer[tabFirePlayer.length] = fire
}

function gestionTirMob(){
      if(tabMobs.length != 0){
        mob_fire=tabMobs[Math.floor(Math.random()*tabMobs.length)];
        typeObject = Math.floor((Math.random()*9)+1);
        //console.log(typeObject);
        createFireMob(mob_fire, typeObject);
      }
   
}

function createFireMob(mob, typeO){

      var definitionFire = {
            framerate : 25,
            images : [missileMonsterSpriteImage],
            frames : {
                  width : 76,
                  height : 86,
                  count : 9,
                  regX : 0,
                  regY : 0
            },
            animations :{
                  type1 : { frames: [0]},
                  type2 : { frames: [1]},
                  type3 : { frames: [2]},
                  type4 : { frames: [3]},
                  type5 : { frames: [4]},
                  type6 : { frames: [5]},
                  type7 : { frames: [6]},
                  type8 : { frames: [7]},
                  type9 : { frames: [8]}               

            } 
      }

      var fireSheet = new createjs.SpriteSheet(definitionFire);
      var fire = new createjs.Sprite(fireSheet, "type"+typeO);
     
      fire.x = mob.x+100;
      fire.y = mob.y+70;
      fire.scaleX =0.5;
      fire.scaleY =0.5;
      fire.snapToPixel =true;

      stage.addChild(fire);
      tabFireMob[tabFireMob.length] = fire
}  
   
function mvtPlayer()
{
      var delta = stage.mouseY - player.y;
      player.y += delta/10
      player.y = Math.min(canvas.width + (spriteEasyWidth(player)/2), Math.max(spriteEasyWidth(player)/2, player.y));
}

function mvtMobs(){
    
    var nbMob = tabMobs.length;
    //console.log(nbMob);
    
    if(nbMob === 0){
        //console.log(nbMob);
        winner();
        
    }

    if(dirXMob === 0){
        for(var m=0; m<nbMob;m++){
            tabMobs[m].y += speedYMobs * dirYMob;

            if (ndgmr.checkPixelCollision(player, tabMobs[m], 0)) {
                clearInterval(interval);
                gameover();
                break;
             }
        }
        for (var m=0; m<nbMob; m++){
            if((tabMobs[m].y +spriteEasyWidth(tabMobs[m]) >= canvas.height) || (tabMobs[m].y <= 0)) {
                dirYMob *= -1;
                dirXMob = 1;
                break;
            }
        }
    }
    else{
        for(var m=0; m<nbMob;m++){
            tabMobs[m].x += speedXMobs * dirXMob;
        }
        dirXMob = 0;
        
    }
}

function mvtFirePlayer() {
    
    var nbFirePlayer = tabFirePlayer.length;
    
    for (var fp=0; fp<nbFirePlayer; fp++) {
        tabFirePlayer[fp].x -= speedFirePlayer;
        
        if (tabFirePlayer[fp].x + spriteEasyWidth(tabFirePlayer[fp]) <= 0) {
            stage.removeChild(tabFirePlayer[fp]);
            tabFirePlayer.splice(fp, 1);
            nbFirePlayer--;
            fp--;
            
        } else {
            
            if(bossActive){
              var nbBoss = tabBoss.length;           

              for(var m=0; m<nbBoss; m++){
                  if (ndgmr.checkPixelCollision(tabFirePlayer[fp], tabBoss[m], 0)) {
                      lacheHeart(tabBoss[m]);
                      plusScore("monster");
                      stage.removeChild(tabFirePlayer[fp]);
                      tabFirePlayer.splice(fp, 1);
                      nbFirePlayer--;
                      vieBossTire++;
                      stage.removeChild(vieLabel);
                      vieNbBoss();                 
                      //fp--;
                      break;
                  }
              } 
            }else{
              var nbMob = tabMobs.length;
              for(var m=0; m<nbMob; m++){
                  if (ndgmr.checkPixelCollision(tabFirePlayer[fp], tabMobs[m], 0)) {
                      lacheHeart(tabMobs[m]);
                      plusScore("monster");
                      stage.removeChild(tabFirePlayer[fp], tabMobs[m]);
                      tabFirePlayer.splice(fp, 1);
                      tabMobs.splice(m, 1);
                      nbFirePlayer--;
                      fp--;
                      break;
                  }
              } 
            }
   
        }
    }
}

function mvtFireMob() {
    
    var nbFireMob = tabFireMob.length;
    
    for (var fp=0; fp<nbFireMob; fp++) {
        tabFireMob[fp].x += speedFireMob;
        
        if (tabFireMob[fp].x + spriteEasyWidth(tabFireMob[fp]) <= 0) {
            stage.removeChild(tabFireMob[fp]);
            tabFireMob.splice(fp, 1);
            nbFireMob--;
            fp--;
            
        } else {
            if (ndgmr.checkPixelCollision(tabFireMob[fp], player, 0)) {
                // gestion des coeur
                stage.removeChild(tabFireMob[fp]);
                tabFireMob.splice(fp, 1);
                nbFireMob--;
                fp--;
                coeurPerduTotal++;
                removeHearts();
                moinsScore();
                //console.log(coeur);
                //console.log("coeur perdu "+coeurPerduTotal);
                break;
            }
            
            var nbFirePlayer = tabFirePlayer.length;
            for(var p=0; p<nbFirePlayer; p++){
                if (ndgmr.checkPixelCollision(tabFireMob[fp], tabFirePlayer[p], 0)) {
                    stage.removeChild(tabFireMob[fp], tabFirePlayer[p]);
                    tabFireMob.splice(fp, 1);
                    tabFirePlayer.splice(p, 1);
                    fp--;
                    p--;
                    nbFireMob--;
                    nbFirePlayer--;
                    plusScore("missile");
                    break;


                }
            }
              
        }
    }
}

function mvtHeart() {
    
    var nbCoeur = tabCoeurMove.length;
    
    for (var fp=0; fp<nbCoeur; fp++) {
        tabCoeurMove[fp].x += speedCoeurMove;
        
        if (tabCoeurMove[fp].x + spriteEasyWidth(tabCoeurMove[fp]) <= 0) {
            stage.removeChild(tabCoeurMove[fp]);
            tabCoeurMove.splice(fp, 1);
            nbCoeur--;
            fp--;
            
        } else {
            if (ndgmr.checkPixelCollision(tabCoeurMove[fp], player, 0)) {
                // gestion des coeur
                stage.removeChild(tabCoeurMove[fp]);
                tabCoeurMove.splice(fp, 1);
                nbCoeur--;
                fp--;
                addHeart();
               // console.log(coeur);
                break;
            }
              
        }
    }
}











function createBoss(type){

     /* if(type<0 || type>3){
            console.log("function createMob param type is not");
            
            
      }*/

      var definitionBoss = {
            framerate : 25,
            images : [monsterSpriteImage],
            frames : {
                  width : 174,
                  height : 200,
                  count : 3,
                  regX : -50,
                  regY : 0
            },
            animations :{
                  type0 : {frames: [0]}
            } 
      }

      var bossSheet = new createjs.SpriteSheet(definitionBoss);
      var boss = new createjs.Sprite(bossSheet, "type"+type);
      boss.scaleX = 0.55;
      boss.scaleY = 0.55;
      boss.snapToPixel = true;

      tabBoss[tabBoss.length] = boss;
      stage.addChild(boss);
      
      return boss;
}


function mvtBoss(){
    
    var nbBoss = tabBoss.length;
    if(vieBossTire == vieBoss){
      winner();
    }

    if(dirXBoss === 0){
        for(var m=0; m<nbBoss;m++){
            tabBoss[m].y += speedYBoss * dirYBoss;

            if (ndgmr.checkPixelCollision(player, tabBoss[m], 0)) {
                clearInterval(interval);
                gameover();
                break;
             }
        }
        for (var m=0; m<nbBoss; m++){
            if((tabBoss[m].y +spriteEasyWidth(tabBoss[m]) >= canvas.height) || (tabBoss[m].y <= 0)) {
                dirYBoss *= -1;
                dirXBoss = 1;
                break;
            }else if(Math.random()*1000 <= 3) {
                dirYBoss *= -1;
            }
        }


        
    }
    else{
        for(var m=0; m<nbBoss;m++){
            tabBoss[m].x += speedXBoss * dirXBoss;
        }
        dirXBoss = 0;
        
    }
}


function createFireBoss(boss){

      var definitionFire = {
            framerate : 25,
            images : [missile2MonsterSpriteImage],
            frames : {
                  width : 200,
                  height : 149,
                  count : 1,
                  regX : 0,
                  regY : 0
            },
            animations :{
                  feu : {frames: [0]}
            }
      }

      var fireSheet = new createjs.SpriteSheet(definitionFire);
      var fire = new createjs.Sprite(fireSheet, "feu");
     
      fire.x = boss.x+spriteEasyWidth(boss);
      fire.y = boss.y+25;
      fire.scaleX =0.2;
      fire.scaleY =0.2;
      fire.snapToPixel =true;

      stage.addChild(fire);
      tabFireBoss[tabFireBoss.length] = fire
}  

function gestionTirBoss(){
      if(tabBoss.length != 0){
        boss_fire=tabBoss[Math.floor(Math.random()*tabBoss.length)];
        createFireBoss(boss_fire);
      }
   
}

function mvtFireBoss() {
    
    var nbFireBoss = tabFireBoss.length;
    
    for (var fp=0; fp<nbFireBoss; fp++) {
        tabFireBoss[fp].x += speedFireBoss;
        
        if (tabFireBoss[fp].x + spriteEasyHeight(tabFireBoss[fp]) <= 0) {
            stage.removeChild(tabFireBoss[fp]);
            tabFireBoss.splice(fp, 1);
            nbFireBoss--;
            fp--;
            
        } else {
            if (ndgmr.checkPixelCollision(tabFireBoss[fp], player, 0)) {
                // gestion des coeur
                stage.removeChild(tabFireBoss[fp]);
                tabFireBoss.splice(fp, 1);
                nbFireBoss--;
                fp--;
                coeurPerduTotal++;
                removeHearts();
                moinsScore();
                //console.log(coeur);
                //console.log("coeur perdu "+coeurPerduTotal);
                break;
            }   

            var nbFirePlayer = tabFirePlayer.length;
            for(var p=0; p<nbFirePlayer; p++){
                if (ndgmr.checkPixelCollision(tabFireBoss[fp], tabFirePlayer[p], 0)) {
                    stage.removeChild(tabFireBoss[fp], tabFirePlayer[p]);
                    tabFireBoss.splice(fp, 1);
                    tabFirePlayer.splice(p, 1);
                    fp--;
                    p--;
                    nbFireBoss--;
                    nbFirePlayer--;
                    plusScore("missile");
                    break;


                }
            }
        }
    }
}




















function vieNbBoss(){
    vieLabel =  new createjs.Text("Vie "+(vieBoss-vieBossTire) , "bold 25px Arial", "#ff0000");
    vieLabel.x = 0;
    vieLabel.y =30;
    stage.addChild(vieLabel);
}



function levelAffiche(){
 
    levelLabel =  new createjs.Text("Level "+level, "bold 25px Arial", "#000");
    levelLabel.x = 100;
    levelLabel.y =5;
    stage.addChild(levelLabel);
}

function levelMap(){

      if(level === 1){
        levelMob1           = new Array(0,-1);
        levelMob2           = new Array(1,-1);
        levelMob3           = new Array(2,3);
        levelMob4           = new Array(4,5);
        levelMob5           = new Array(6,-1);
        levelMob6           = new Array(7,-1);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
      }
      else if(level === 2){
        levelMob1           = new Array(0,-1,5);
        levelMob2           = new Array(-1,7,-1);
        levelMob3           = new Array(2,-1,-1);
        levelMob4           = new Array(-1,4,-1);
        levelMob5           = new Array(6,-1,-1);
        levelMob6           = new Array(-1,3,1);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
        speedFireMob         = 1.8;
      }
      else if(level === 3){
        leveMob1           = new Array(0,2,5);
        leveMob2           = new Array(6,7,-1);
        leveMob3           = new Array(2,-1,-1);
        leveMob4           = new Array(3,4,-1);
        leveMob5           = new Array(6,-1,-1);
        leveMob6           = new Array(4,3,1);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
        speedFireMob         = 1.9;
        intervalTir          = 1800;
        //speedXMobs           = 4;
      }
      else if(level === 4){
        levelMob1           = new Array(7,2,-1);
        levelMob2           = new Array(6,7,-1);
        levelMob3           = new Array(-1,2,4);
        levelMob4           = new Array(-1,4,3);
        levelMob5           = new Array(5,-1,-1);
        levelMob6           = new Array(4,3,1);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
        speedFireMob         = 2;
        intervalTir          = 1900;
      }
      else if(level === 5){
        bossActive           = true;
        intervalTir          = 1900;
      }
      else if(level === 6){
        levelMob1           = new Array(7,2,1);
        levelMob2           = new Array(6,7,3);
        levelMob3           = new Array(5,2,4);
        levelMob4           = new Array(7,4,3);
        levelMob5           = new Array(5,3,7);
        levelMob6           = new Array(4,3,1);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
        speedFireMob         = 2.5;
        intervalTir          = 2000;
        bossActive           = false;
      }
      
      else if(level === 7){
        levelMob1           = new Array(7,2,1,4);
        levelMob2           = new Array(6,7,3,5);
        levelMob3           = new Array(5,2,4,-1);
        levelMob4           = new Array(7,4,3,-1);
        levelMob5           = new Array(5,3,7,2);
        levelMob6           = new Array(4,3,1,6);
        listMobs             = new Array(levelMob1,levelMob2,levelMob3,levelMob4,levelMob5,levelMob6);
        speedFireMob         = 3;
        intervalTir          = 2100;
      }

      

}

