const { ipcRenderer, screen } = require('electron');
window.PIXI = require('phaser/build/pixi');
window.p2 = require('phaser/build/p2');
var _ = require('lodash');
var Phaser = require('phaser');
const { width, height } = screen.getPrimaryDisplay().workAreaSize;
const transparent = true;
const wrappedSheep = [];
const { Scene } = require('./game/Scene');
var game = new Phaser.Game(
    width,
    height,
    Phaser.AUTO,   // Phaser.HEADLESS
    'phaser-example',
    null,
    transparent
);

game.state.add('scene', new Scene(game));
game.state.start('scene');

setTimeout(() => {
    game.paused = false;
    console.log('paused=', game.paused);
}, 1000);

return;

// In the renderer process.
const { desktopCapturer } = require('electron')
desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error) throw error
    for (let i = 0; i < sources.length; ++i) {
        console.log(sources[i].name);
        if (sources[i].name === 'Entire screen') {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sources[i].id,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
                .then((stream) => handleStream(stream))
                .catch((e) => handleError(e))
            return
        }
    }
})
const Sobel = require('sobel');
function handleStream(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
        video.play();
        const canvas = document.createElement("canvas");
        const { videoWidth, videoHeight } = video;
        canvas.width = videoWidth;
        canvas.height = videoWidth
        document.body.appendChild(canvas);
        var canvasContext = canvas.getContext("2d");
        setInterval(() => {
            canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
            var imgData = canvasContext.getImageData(0, 0, videoWidth, videoHeight);
            // var sobelData = Sobel(imgData);
            // var sobelImageData = sobelData.toImageData();
            //canvasContext.putImageData(sobelImageData, 0, 0);
             const pix = require('pixfinder');
             var planes = pix.findAll({
                img: imgData,
                distance: 5,
                colors: ['eff1f0'],
                clearNoise: 50
            });
            console.log(planes);
            return;
             const rects = [];
             let cur;
             let startX, startY;
             for(let y = 0; y < videoHeight; y++){
                for(let x = 0; x < videoWidth; x++){
                    var pixel = canvasContext.getImageData(x, y, 1, 1);
                    var data = pixel.data;
                    if(!data[0]){
                        if(!cur){
                            cur = {
                                x, y
                            }
                        }else{
                            cur.w = x - cur.x;
                            cur.h = y - cur.y;
                        }
                    } else {
                        if (cur){
                            rects.push(cur);
                            cur = null;
                        }
                    }
                }
                if (cur){
                    rects.push(cur);
                    cur = null;
                }
             }
             console.log('done');
           console.log(rects);
        }, 2000);
    }
}

function handleError(e) {
    console.log(e)
}

return;

function preload() {
    game.load.spritesheet('sheep', './sheep-sprite.png', 40, 40, 189);
    // game.load.spritesheet('spinner', 'assets/sprites/bluemetal_32x32x4.png', 32, 32);

}

let allSheep;
let sheepIdSpooler = 0;
ipcRenderer.on('make-a-sheep', (event, arg) => {
    console.log('make a sheep');
    // const sheepId = addSheep();
    //event.sender.send('made-a-sheep', { id: 0 });
});
var r = 0;
function addSheep() {
    const x = 70;//game.rnd.integerInRange(50, game.width - 50);
    var sprite = allSheep.create(x, r++, 'sheep');
    const sheep = new Sheep(game, sprite);
    wrappedSheep.push(sheep);
}

function addWindow() {
    var bmd = game.add.bitmapData(100, 100);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#AAAAAA';
    bmd.ctx.fill();
    const x = 60;
    const sprite = allSheep.create(x, game.height - 300, bmd);
    sprite.body.immovable = true;
    // var sprite = game.add.sprite(x, game.height - 300, bmd);

}

function create() {
    game.clearBeforeRender = true;
    game.stage.backgroundColor = 'rgba(255, 0, 0, 255)';
    game.stage.disableVisibilityChange = true; // dont pause game on window.blur
    game.time.advancedTiming = true;
    //  Here we create a group, populate it with sprites, give them all a random velocity
    //  and then check the group against itself for collision

    allSheep = game.add.physicsGroup(Phaser.Physics.ARCADE);
    addWindow();

    // for(var t = 0; t< 100; t++){
    //     addSheep();
    // }

    setTimeout(addSheep, 1000);

}

function update() {
    game.physics.arcade.collide(allSheep);
    wrappedSheep.forEach((sheep) => {
        if (sheep.isIdle()) {
            sheep.doSomething();
        }
    });

    // , (sheep1, sheep2) => {
    //     console.log('colision', sheep1, sheep2);
    // });
    // // object1, object2, collideCallback, processCallback, callbackContext
    // game.physics.arcade.collide(sprite1, sprite2, collisionHandler, null, this);



}

function render() {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
}


return
/*
const { ipcRenderer, screen } = require('electron');
window.PIXI = require('phaser/build/pixi');
window.p2 = require('phaser/build/p2');
 var _ = require('lodash');
var Phaser = require('phaser');
 const {width, height} = screen.getPrimaryDisplay().workAreaSize;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: _.throttle(render, 1000) }, true);

const allSheep = [];
let sheepIdSpooler = 0;
ipcRenderer.on('make-a-sheep', (event, arg) => {
    const sheepId = addSheep();
    event.sender.send('made-a-sheep', { id: sheepId });
});

function preload() {
    //game.load.spritesheet('sheep', './sheep-sprite.png', 40, 40, 189);
}

function addSheep(){
    const x = game.rnd.integerInRange(50, game.width - 50);
   // var sprite = game.add.sprite(x, 0, 'sheep');

    var bmd = game.add.bitmapData(40, 40);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#AAAAAA';
    bmd.ctx.fill();
    var sprite = game.add.sprite(x, 0, bmd);


   // sprite.animations.add('walk', [2, 3]);
   // sprite.animations.play('walk', 2, true);
   return;
    game.physics.enable([sprite], Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;
    sprite.body.gravity.y = 1000;
    sprite.body.bounce.y = 0.7;

    //  Input Enable the sprites
    sprite.inputEnabled = true;

    //  Allow dragging - the 'true' parameter will make the sprite snap to the center
    sprite.input.enableDrag(true);
    //  Drag events
    sprite.events.onDragStart.add(() => {
        sprite.body.bounce.y = 0;
        sprite.body.gravity.y = 0;
        sprite.body.velocity.y = 0;
        sprite.body.velocity.x = 0;
    });
    //sprite.events.onDragUpdate.add(dragUpdate);
    sprite.events.onDragStop.add(() => {
        sprite.body.bounce.y = 0.7;
        sprite.body.gravity.y = 1000;
    });

    //  By default the Signal is empty, so we create it here:
    sprite.body.onWorldBounds = new Phaser.Signal();

    //  And then listen for it
    sprite.body.onWorldBounds.add(() => {
        // if he was sliding down a window then he splats and stops dead
        // maybe he stops dead and splats then walks off after a bit
        // maybe he bounces a few times the walks off..but rarely and only if falling from high
        // maybe he stops dead and turns away then walks off

        // remember though this wont be rendered here!
        // its gotta be just the gravity and bounce and stuff
        // so basically i wont be playing an animation here
        // i will be sending a message
        // and a little window is gonna play the animation when it gets the message
        // but all the logic can live here like this.i just wont load any sprites
       
        const randy = game.rnd.integerInRange(0, 100);
        if (randy > 80) {
            // let him bounce
        } else if (randy > 60) {
            // turn away..disable bounce
        } else if (sprite.body.velocity.y > 500) {
            // splat him
        } else {
            // just walk off...disable bounce
        }
    });
    allSheep.push({ id: sheepIdSpooler, sprite } );
    return sheepIdSpooler++;
};

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true; // dont pause game on window.blur
   // game.physics.startSystem(Phaser.Physics.ARCADE);
    game.clearBeforeRender = false;
    //addSheep();

    // game.time.events.loop(100, () => {
    //     ipcRenderer.send('update-sheep-positions', {
    //         positions: allSheep.map(({id, sprite}) => ({ id, x: Math.floor(sprite.body.position.x), y: Math.floor(sprite.body.position.y) }))
    //     });
    // });
}

function render() {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
}

// setInterval(() => {
//     window.moveTo(window.screenLeft - 1, window.screenTop - 1);
// }, 1000);

// i need to make a fullscreen trans window
// and it has click through
// unless its a sheep

///// i can use that parent child example
// only i need the childs to follow the sprites
// the i can just make the whole thing in nomral phaser game using DOM!

// first i need to get some sheep walking around and draggable with gravity - with the issue of no clickthrough
// then i just attach some listeners or something to the sprites
// and send a message to move the shaddow window

// so that wont work due to electron tranparent windows rendering really slow
// works a charm without transparent, but way to slow with only a single sheep

// back to plan A...
// lots of small windows
// i need to somehow co-ordinate interactions
// and do gravity

// could i have a master renderer window
// he makes a Game...its not showing or offscreen it a hidden window
// it adds sprites but with just white
// and i can add gravity
// then i monitor the positions
// and update the little windows with just a sheep
//

// another idea for small windows
// could I make it tall?? - no
*/