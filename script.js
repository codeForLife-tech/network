const canvas = getel("canvas");
const ctx = canvas.getContext('2d');
var col="white";
var num=20;
var ySize=5;
var xSize=5;
var ro=0;
var colArr=["red", "blue", "lightgreen", "yellow", "orange", "violet", "indigo"];
var drawnArray=[];
var curCol=0;
var volt=18;
var R=JSON.parse(localStorage.getItem("Ra") || "[1,2,0.5]");
var L=JSON.parse(localStorage.getItem("La") || "[0.06666,0.4,0.081]");
var C=JSON.parse(localStorage.getItem("Ca") || "[0.06666,0.1,0.084]");
function createCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  strokeAxis(0, canvas.height/2, canvas.width, canvas.height/2, col);
  strokeAxis(canvas.width/2,0,canvas.width/2, canvas.height, col);
  strokeTicks();
}

function recreate() {
    createCanvas();
    for(var m=0;m<drawnArray.length;++m) {
        draw(drawnArray[m].iFunc, drawnArray[m].col);
    }
}
function getel(id) {
    return document.getElementById(id);
}

function strokeAxis(sx,sy,fx,fy, col) {
    ctx.beginPath();
    ctx.strokeStyle=col;
    ctx.moveTo(sx,sy);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ctx.closePath();
}
function coord(x, y) {
    return {
        X: canvas.width/2+x,
        Y: canvas.height/2-y
    };
}
function strokeTicks() {
    for(var x=num, i=1; x<canvas.width/2; x+=num, i++) {
        strokeTick(x, ySize, col, 1, -1, i);
        strokeTick(-x, ySize, col, 1, -1, -i);
        x++;
    }
    for(var y=num, j=1; y<canvas.height/2; y+=num, j++) {
        strokeTick(xSize, y, col, -1, 1, j);
        strokeTick(xSize, -y, col, -1, 1, -j);
        y++;
    }
}
function strokeTick(sX, sY, col, dir1, dir2, text) {
    var co1=coord(sX*dir1, sY*dir2);
    var co2=coord(sX, sY);
    strokeAxis(co1.X, co1.Y, co2.X, co2.Y, col);
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    if(dir2==1) {
        ctx.textAlign="right";
        ctx.textBaseline = 'middle';
    }
    else if(dir2==-1) {
        ctx.textAlign="center";
        ctx.textBaseline = 'top';
    }
    ctx.fillText(text,co1.X,co1.Y);
}

function plot(R, L, C) {
    console.log(R, L, C);
        ro++;
        func={
            R,L,C, volt
        };
        var color=colArr[curCol++];
        const graph= {
            id: ro,
            iFunc: func,
            col:color
        };
        
        drawnArray.push(graph);
        draw(func, color);
        
        console.log("finished");
}
function draw(inputVal, color) {
    ctx.lineWidth=2.5;
        var colourPlot=color;
        for(var xplot=0;xplot< canvas.width/2; xplot+=0.1) {
            var yplot=evaluate(inputVal, xplot);
            var yplot2=evaluate(inputVal, xplot+0.1);
            var coord1=coord(xplot, yplot);
            var coord2=coord(xplot+0.1, yplot2);
            strokeAxis(coord1.X, coord1.Y, coord2.X, coord2.Y, colourPlot);
        }
           
}
function evaluate(func, xVal) {
    xVal/=num;
    x=xVal;
    let v=func.volt;
    let r=func.R;
    let c=func.C;
    let l=func.L;
    var res=15;
    var res=v/(Math.sqrt(Math.pow((xVal*l-1/(xVal*c)), 2)+Math.pow(r,2)));
    return num*res;
}

document.addEventListener('keydown', function(event) {
    if(event.key=='w') {
        canvas.width*=2;
        canvas.height*=2;
        xSize*=2;
        ySize*=2;
        num*=2;
        recreate();
    }
    else if(event.key=='o') {
        canvas.width/=2;
        canvas.height/=2;
        xSize/=2;
        ySize/=2;
        num/=2;
        recreate();
    }
});
createCanvas();
for(let k=0; k<R.length; k++) {
    plot(R[k], L[k], C[k]);
}
