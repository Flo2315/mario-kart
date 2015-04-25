function init()
{
    progressBarWidch       = 300;
    var progressBarHeight      = 20;
    var progressBarBorderSize  = 2;
    var progressBarBorderColor = createjs.Graphics.getRGB(0,0,0);
    var progressBarColor       = createjs.Graphics.getRGB(125,125,125);
    
    canvas = document.getElementById("game");
    stage  = new createjs.Stage(canvas);
    
    progressLabel = new createjs.Text("", "18px Verdana", "black");
    progressLabel.lineWidch = progressBarWidch;
    progressLabel.textAlign = "center";
    progressLabel.x         = canvas.width/2;
    progressLabel.y         = 50;
    stage.addChild(progressLabel);
    
    progressContainer = new createjs.Container();
    progressContainer.x = (canvas.width - progressBarWidch)/2;
    progressContainer.y = progressLabel.y + 50
    stage.addChild(progressContainer);
    
    progessBar = new createjs.Shape();
    progessBar.graphics.beginFill(progressBarColor).drawRect(0,0,1,progressBarHeight).endFill();
    progressContainer.addChild(progessBar); 
    
    progessBorder = new createjs.Shape();
    progessBorder.graphics.setStrokeStyle(progressBarBorderSize).beginStroke(progressBarBorderColor).drawRect(0,0,progressBarWidch,progressBarHeight).endFill();
    progressContainer.addChild(progessBorder);
    
    preload = new createjs.LoadQueue();
    preload.addEventListener("complete", handleComplete);
    preload.addEventListener("progress", handleProgress);
    
    preload.loadManifest(manifest);
    
    stage.update();
}

function handleProgress()
{
    progressPercent = Math.round(preload.progress *100);
    
    progessBar.scaleX  = preload.progress * progressBarWidch;
    progressLabel.text = "Loaded : " + progressPercent + "%";
    
    stage.update();
}

function handleComplete()
{
    //backgroundImage = preload.getResult("background");
    
    for (property in preload._loadedResults) {
      // console.log(property);
      if(preload._loadedResults[property].nodeName === "IMG"){
         window[property+"Image"]= preload.getResult(property);
      }
      
    }

    
    //console.log(preload);
    // console.log(backgroundImage);
    // console.log(missileSpriteImage);
    // console.log(monsterSpriteImage);
    // console.log(spaceSpriteImage);

    progressLabel.text = "Click to Start";
    stage.update();

    canvas.addEventListener("click", handleClick);

    
}

function handleClick()
{
    stage.removeChild(progressLabel, progressContainer);
    canvas.removeEventListener("click", handleClick);
    start(1);
}