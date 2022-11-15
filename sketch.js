let pig;
let prImg;
let pjImg;
let pfImg;
let i = 0;
let tImg;
let bImg;
let htmlbImg;
let trucks = [];

let heart = 250;
let heart_count = 5;
let icon;

//for background img flow
let x1 = 0;
let x2;

let video;
var scrollSpeed = 2;

//PoseNet
let poseNet;
let pose;
let skeleton;
let poseLabel;

//nerual network
let brain;
let state = 'waiting';
let targetLabel;

let prepare = false;

function preload(){
    pigImg[0] = loadImage('static/pig-run.png');
    pigImg[1] = loadImage('static/pig-jump.png');
    pigImg[2] = loadImage('static/pig-fly.png');

    tImg = loadImage('static/pig-run.png')
    bImg = loadImage('static/back-resize.png')
    htmlbImg = loadImage('static/html-background.png')
    icon = loadImage('static/heart.png')
}

function keyPressed(){
    if (key == 'q'){
        brain.saveData();
    }
    if (key == ' '){
        pig.jump();
    }
    else{
        targetLabel = key;
        console.log(targetLabel);
        setTimeout(function(){
            console.log('collecting');
            state = 'collecting';
            setTimeout(function(){
                console.log('not collecting');
                state = 'waiting';
            }, 10000)
        }, 10000);
    }
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    x2 = bImg.width;
    pig = new Pig();
    video = createCapture(VIDEO);
    video.size(300, bImg.height*0.3)
    //video.position(windowWidth/2-150, 0)
    video.hide()
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    //PoseNet neural machine learning model
    let options = {
        inputs:34,
        outputs:4,
        task:'classification',
        debug:true
    };

    brain = ml5.neuralNetwork(options);
    const modelInfo = {
        model : 'Model-final/model_1116.json',
        metadata : 'Model-final/model_meta_1116.json',
        weights: 'Model-final/model_weight_1116.bin',
    }
    brain.load(modelInfo, brainLoaded)
    //brain.loadData('Model-final/datacollection.json', dataReady());
}

/* for model training
function dataReady(){
    brain.normalizeData();
    brain.train({epochs: 100}, finished());
}

function finished(){
    console.log('model trianed');
    brain.save();
}
*/

function brainLoaded(){
    console.log('pose classification ready!');
    classifyPose();
    draw();
}

function classifyPose(){
    if (pose){
      let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++){
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs,gotResult);
    }else{
      setTimeout(classifyPose,100);
    }
}

function gotResult(error, results){
    poseLabel = results[0].label;
    classifyPose();
}

function gotPoses(poses){
    if (poses.length > 0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;

        if (state == 'collecting'){
          let inputs = [];
          for (let i = 0; i < pose.keypoints.length; i++){
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
              inputs.push(x);
              inputs.push(y);
          }
          let target = [targetLabel];
          brain.addData(inputs, target);
        }
      }
}

function modelLoaded(){
    console.log('posenet Ready');
    draw();
}

function draw(){
    background('#54C1F4');
      if (pose){
        if (pose.nose.y > 20 && pose.rightAnkle.y < bImg.height*0.3+20){
            console.log('true')
            prepare = true;
        }
        if (prepare === false){
            push();
            textAlign(CENTER);
            textSize(24);
            noStroke();
            fill('#FBC9C1');
            text('카메라와 멀리 떨어져 전신이 카메라에 잡힐 수 있도록 위치를 조정해주세요.', 0, bImg.height*0.3+150, width)
            text('카메라에 전신이 잡히면 게임을 시작합니다.', 0, bImg.height*0.3+200, width)
            translate(window.width, 0);
            scale(-1,1);
            fill('#FBC9C1');
            rect(windowWidth/2 - 160, 10, 320, bImg.height*0.3+20);
            image(video, windowWidth/2 - 150, 20, 300, bImg.height*0.3)
            translate(windowWidth/2-150, 0)
            for (let i =0; i < skeleton.length; i++){
                let a = skeleton[i][0];
                let b = skeleton[i][1];
                strokeWeight(5);
                stroke('#FBC9C1');
                line(a.position.x, a.position.y, b.position.x, b.position.y);
            }
            for (let i = 0; i < pose.keypoints.length; i++){
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                noStroke();
                fill('#FBC9C1');
                ellipse(x,y,10,10);
            }
            pop();
        }
        if (prepare === true){
            setTimeout(Action(), 10);
        } 

        }
}

function Action(){
    background(htmlbImg); 
    image(bImg, x1, height-bImg.height*0.9, bImg.width, windowHeight*0.9);
    image(bImg, x2, height-bImg.height*0.9, bImg.width, windowHeight*0.9);

    x1 -= scrollSpeed;
    x2 -= scrollSpeed;
    
    if (x1 < -bImg.width){
      x1 = bImg.width;
    }
    if (x2 < -bImg.width){
      x2 = bImg.width;
    }

    for (let i=0; i<heart_count; i++ ) {  
        image(icon, 30+70*i, 30, 50, 50);
    }

    if (poseLabel=='j'){
        scrollSpeed = 3;
        i = 1;
        pig.jump();
    } if (poseLabel=='w'){
        scrollSpeed = 3;
        i = 0;
        pig.run();
    } 
     if (poseLabel == 'f'){
        scrollSpeed = 3;
        i = 2;
        pig.fly();
    }
    if (poseLabel == 'n'){
        i = 0;
        scrollSpeed = 1;
    }
    if (random(1)<0.005){
        trucks.push(new Truck1());
    }
    for (let t of trucks){
        t.move();
        t.show();
        if (pig.hits(t)){
            console.log('game over');
            heart --;
        }
    }
    if (heart < 250){
        heart_count = 5
    } if (heart < 200){
        heart_count = 4
    } if (heart < 150){
        heart_count = 3
    } if (heart < 100){
        heart_count = 2
    } if (heart < 50){
        heart_count = 1
    } if (heart == 0){
        gameOver();
        noLoop();
    }

    
      pig.show();
      pig.move();

      translate(window.width, 0);
      scale(-1,1);
      fill('#FBC9C1');
      rect(windowWidth/2 - 160, 10, 320, bImg.height*0.3+20);
      image(video, windowWidth/2 - 150, 20, 300, bImg.height*0.3)
      if (pose){
        translate(windowWidth/2-150, 0)
        for (let i =0; i < skeleton.length; i++){
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(5);
            stroke('#FBC9C1');
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < pose.keypoints.length; i++){
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            noStroke();
            fill('#FBC9C1');
            ellipse(x,y,10,10);
        }
      }

      if (pig.x > windowWidth) {
        gameSuccess();
    }

}

function gameOver(){
    window.location.href = '/gameEnding-1.html'
}

function gameSuccess(){
    window.location.href = '/gameEnding-2.html'
}

