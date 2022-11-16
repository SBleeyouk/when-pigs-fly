class Truck1{
    constructor(){
      this.r = 250;
      this.x = width;
      this.y = height-this.r;
    }
    move(){
      this.x -=8;
    }
    show(){
        image(tImg, this.x, this.y, this.r*2, this.r);
    }
}