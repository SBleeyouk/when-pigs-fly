let pigImg = [];

class Pig{
  constructor(){
    this.r =250;
    this.x = this.r ;
    this.y=height-this.r ;
    this.vy = 0;
    this.vx = 0;
    this.gravity = 1 ;
  }
  run(){ 
    this.y+=0;
    this.vy+=0;
    this.vx=0;
  }
  jump(){
    if (this.y == height - this.r){
      this.vy=-28;
      this.vx=0;
    }
  }
  hits(truck) {
    let x1 = this.x+this.r*0.5;
    let y1 = this.x+this.r*0.5;
    let x2 = truck.x+truck.r*0.5;
    let y2 = truck.x+truck.r*0.5;
    
    //return collideRectRect(x1,y1, this.r,this.r,x2,y2, truck.r,truck.r)
    //return collideCircleCircle(x1,y1, this.r,x2,y2, truck.r);
    
    return collideRectRect(this.x, this.y, this.r*0.6, this.r*0.6,truck.x, truck.y, truck.r, truck.r);
  }
  fly(){
      this.vy = -0.5;
      this.vx =+ 0.2;
  }
  
  move(){
    this.y += this.vy;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y = constrain(this.y, 0, height-this.r);
  }
  show(){
    //fill(255,50);
    //rect(this.x, this.y, this.r, this.r*0.8);
    image(pigImg[i],this.x, this.y, this.r, this.r*0.7);
  }

}

