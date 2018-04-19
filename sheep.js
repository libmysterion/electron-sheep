
const { ipcRenderer } = require('electron');
window.PIXI = require('phaser/build/pixi');
window.p2 = require('phaser/build/p2');
 
var Phaser = require('phaser');
var game = new Phaser.Game(40, 40, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, render: render }, true);

ipcRenderer.on('update-sheep-position', (event, arg) => {
    window.moveTo(x, y);
});

function preload() {
    game.load.spritesheet('sheep', './sheep-sprite.png', 40, 40, 189);
}

function addSheep(){
    var sprite = game.add.sprite(0, 0, 'sheep');
    sprite.animations.add('walk', [2, 3]);
    sprite.animations.play('walk', 2, true);
};

function create() {
    game.stage.disableVisibilityChange = true; // dont pause game on window.blur
    addSheep();
}

function render() {
   
}
