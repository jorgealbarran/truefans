//Jeu du MM "True Fans"
//
// Objectif: Montrer au joeur le modèle mental des "True Fans"
//
// Le modèle mental des True Fans dit qu'il vaut mieux d'avoir un petit nombre des true fans à la place de plein de followers qui n'apportent rien au business.

// Déclarations
const magnete = {path:"https://www.dropbox.com/s/qbouyq2772zl8vc/magnet-e.png?raw=1",width:103,height:95}; 
const magnetn = {path:"https://www.dropbox.com/s/bour9sniuteubuv/magnet-n.png?raw=1",width:95,height:103};
const magnets = {path:"https://www.dropbox.com/s/wsoceepngpd3vlw/magnet-s.png?raw=1",width:103,height:95};
const magnetw = {path:"https://www.dropbox.com/s/y4r4u7nhto695if/magnet-w.png?raw=1",width:95,height:103};


const disk1 = {color:"#000000",width:106,height:106};
const disk2 = {color:"#1A2843",width:161,height:161};
const disk3 = {color:"#1F356A",width:215,height:215};
const disk4 = {color:"#1E3F66",width:267,height:267};
const disk5 = {color:"#2E5984",width:325,height:325};
const disk6 = {color:"#528AAE",width:378,height:378};
const disk7 = {color:"#73A5C6",width:433,height:433};
const disk8 = {color:"#91BAD6",width:489,height:489};
const disk9 = {color:"#BCD2E8",width:541,height:541};
const disk10 = {color:"#FFFFFF",width:596,height:595};

const powerlevels=[disk1,disk2,disk3,disk4,disk5,disk6,disk7,disk8,disk9,disk10];
const mag=[magnete,magnets,magnetw,magnetn];

const bg = "https://www.dropbox.com/s/4am0fkldqom6eqd/background.png?raw=1";

const population = [];
const populationsize = 100;
const segment=populationsize/4;
var cost=1;
var score=0;
const truefansroi=0;
const time=0;
const grain=500;
const ignoringrate=2000;
const attractingrate=1000;

var startingTime;
const executionTime=40000;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


// Classes
class Board {
    constructor() {
      this.img = new Image();
      this.img.src = bg;
      this.img.onload = () => {
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
      };
    }
    draw() {
      ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
    }
  }

  class Power {
    constructor(level) {
      this.img = new Image();
      this.level=level;
      this.color=powerlevels[this.level-1]["color"];
      this.width=powerlevels[this.level-1]["width"];
      this.height=powerlevels[this.level-1]["height"];
      this.x=canvas.width/2;
      this.y=canvas.height/2;
      this.onload = () => {
        this.draw();
      };
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.width/2, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    levelup() {
        if (this.level<10){
            ++this.level;
            this.color=powerlevels[this.level-1]["color"];
            this.width=powerlevels[this.level-1]["width"];
            this.height=powerlevels[this.level-1]["height"];
        }
    }
    leveldown() {
        if (this.level>1){
            --this.level;
            this.color=powerlevels[this.level-1]["color"];
            this.width=powerlevels[this.level-1]["width"];
            this.height=powerlevels[this.level-1]["height"];
        }
    }
  }

  class Magnet{
    constructor(direction) {
        this.direction=direction;
        this.img = new Image();
        this.img.src=mag[this.direction-1]["path"];
        this.width=mag[this.direction-1]["width"];
        this.height=mag[this.direction-1]["height"];
        this.x=(canvas.width-this.width)/2;
        this.y=(canvas.height-this.height)/2;
        this.img.onload = () => {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        };
      }
      draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }   
      rotate() {
        this.direction = this.direction %4 +1;
        this.img.src=mag[this.direction-1]["path"];
        this.width=mag[this.direction-1]["width"];
        this.height=mag[this.direction-1]["height"];
        this.x=(canvas.width-this.width)/2;
        this.y=(canvas.height-this.height)/2;
        this.draw();
      } 
  }

  class Person {
      constructor(x,y,direction,attraction,interest,color){
            this.direction=direction;
            this.attraction=attraction;
            this.interest=interest;
            this.x0=x;
            this.y0=y;
            this.x=this.x0;
            this.y=this.y0;
            this.color=color;
            this.step=0;
        this.onload = () => {
            this.draw();
          };
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x,this.y, 10, 0, Math.PI*2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        attract(){
            if(this.step<=grain){
                this.step=this.step+this.attraction*power.level;
                this.x=(1-this.step/grain)*this.x+(this.step/grain)*(magnet.x+magnet.width/2);
                this.y=(1-this.step/grain)*this.y+(this.step/grain)*(magnet.y+magnet.height/2);
            }
        }
        repel(){
            if(this.step<=grain){
                this.step=this.step-this.interest+parseInt(power.level/10);
                //console.log(this.step);
                this.x=(1-this.step/grain)*this.x+(this.step/grain)*(magnet.x+magnet.width/2);
                this.y=(1-this.step/grain)*this.y+(this.step/grain)*(magnet.y+magnet.height/2);
            }
        }
      }
  
  const board = new Board();
  const power = new Power(1);
  const magnet= new Magnet(1);

// Le jeu
function update() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.draw();
    power.draw();
    magnet.draw();
    drawpopulation();
    calculatecost();
    drawCost();
  }
  
  // inicio
  function start() {
      interval = setInterval(update, 1000 / 60);
      generatepopulation();
      inter1 = setInterval(detachpopulation,ignoringrate);
      inter2 = setInterval(attachpopulation,attractingrate);
      countdown = setInterval(gameover,executionTime);
    }
    
    function generatepopulation() {
        for (i=0; i<segment; i++){
            population[i]=new Person(Math.random()*100+500,Math.random()*400+100,0,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"red");
        }
        for (i=segment; i<segment*2; i++){
            population[i]=new Person(Math.random()*400+100,Math.random()*100+500,1,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"blue");
        }
        for (i=segment*2; i<segment*3; i++){
            population[i]=new Person(Math.random()*100,Math.random()*400+100,2,Math.floor(Math.random())*5+1,Math.floor(Math.random()*5)+1,"green");
        }
        for (i=segment*3; i<segment*4; i++){
            population[i]=new Person(Math.random()*400+100,Math.random()*100,3,Math.floor(Math.random())*5+1,Math.floor(Math.random()*5)+1,"yellow");
        }
    }

    function drawpopulation() {
        population.forEach(person => {
            person.draw();
        });
    }

    function rotatemagnet(){
        magnet.rotate();
    }

    function attractpopulation(direction){
        for(i=segment*direction;i<segment*(direction+1);i++){
            population[i].attract();
        }
    }

    function repelpopulation(direction){
        for(i=segment*direction;i<segment*(direction+1);i++){
            population[i].repel();
        }
    }

    function powerup(){
        power.levelup();
    }

    function powerdown(){
        power.leveldown();
        repelpopulation(magnet.direction-1);
    }
    
    function detachpopulation(){
        population.forEach(person => {
            person.repel();
        });
    }

    function attachpopulation(){
        for(i=segment*(magnet.direction-1);i<segment*(magnet.direction);i++){
            population[i].attract();
        }
    }

    const Xo=canvas.width/2;
    const Yo=canvas.height/2;

    function calculatescore(){
        var radius=0;
        population.forEach(person => {
            let dx=Math.abs(person.x-Xo);
            let dy=Math.abs(person.y-Yo);
            if(dx<107 && dy<107){
                score=score+(4-Math.floor(Math.max(dx,dy)/27))*10*(person.direction+1);
            }
        });
    }

    function calculatecost(){
        cost=parseInt(cost+power.level/5);
        //console.log(power.level+"-"+cost);
    }

    function drawCost() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0B2981";
        ctx.fillText("Campaign cost:"+cost, 8, 20);
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0B2981";
        ctx.fillText("Clients investment:"+score, 8, 40);
        let TotalScore=score-cost;
        ctx.fillText("ROI:"+TotalScore, 8, 60);
    }


    addEventListener("keydown", function(e) {
        if (e.keyCode === 38) {
            powerup();
        }
        else if (e.keyCode === 40) {
            powerdown();
        }
        else if (e.keyCode === 82) {
            rotatemagnet();
        } 
      });

      function gameover(){
        clearInterval(interval);
        calculatescore();
        drawScore();
    }

start();