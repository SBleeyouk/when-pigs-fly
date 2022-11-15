let pig;
let pImg;
let tImg;
let bImg;
let htmlbImg;
let trains = [];

let heart = 30;

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

function preload(){
    pImg = loadImage('static/pig-default.png')
    tImg = loadImage('static/pig-default.png')
    bImg = loadImage('static/back-resize.png')
    htmlbImg = loadImage('static/html-background.png')
}

function keyPressed(){
    if (key == 'q'){
        brain.saveData();
    }else{
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
    pig = new Pig();
    x2 = bImg.width;

    video = createCapture(VIDEO);
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
    //background flowing image
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

    if (random(1) < 0.005){
        trains.push(new Truck1());
    }
    pig.show()
    pig.move()

    for (let t of trains){
        t.move();
        t.show();
        if (pig.hits(t)){
            //heart -= 1;
            //console.log('heart -1');
        }
        if (heart == 0){
            //console.log('gameover')
            noLoop();
        }
    }
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


}

