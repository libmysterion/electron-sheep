const { Sheep } = require('./Sheep');
const Phaser = require('phaser');
const debug = true;

module.exports.Scene = class Scene {
    constructor(game) {
        this.render = this.render.bind(this, game);
        this.preload = this.preload.bind(this.game);
        this.update = this.update.bind(this, game);
        this.create = this.create.bind(this, game);
        this.addPlatform = this.addPlatform.bind(this, game);
        this.sheeps = [];
        this.platforms = [];
    }
    preload(game) {
        game.load.spritesheet('sheep', './sheep-sprite.png', 40, 40, 189);
    }
    create(game) {
        game.clearBeforeRender = true;
        game.stage.backgroundColor = 'rgba(255, 0, 0, 255)';
        game.stage.disableVisibilityChange = true; // dont pause game on window.blur
        game.time.advancedTiming = true;
        //  Here we create a group, populate it with sprites, give them all a random velocity
        //  and then check the group against itself for collision

        this.physicsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.addPlatform(60, game.height - 300, 100, 100);

        const addSheep = (y = 0) => {
            const x = 70;//game.rnd.integerInRange(50, game.width - 50);
            var sprite = this.physicsGroup.create(x, y, 'sheep');
            const sheep = new Sheep(game, sprite);
            this.sheeps.push(sheep);
        }
        document.body.addEventListener('click', addSheep);
        
        setTimeout(addSheep, 1000);
    }
    addPlatform(game, x, y, w, h) {
        if(debug){
            const bmd = game.add.bitmapData(100, 100);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, w, h);
            bmd.ctx.fillStyle = '#AAAAAA';
            bmd.ctx.fill();
            const sprite = this.physicsGroup.create(x, y, bmd);
            sprite.body.immovable = true;
            this.platforms.push(sprite);
        }
    }
    update(game) {
        game.physics.arcade.collide(this.physicsGroup);
        this.sheeps.forEach((sheep) => sheep.update());
        
        this.platforms.forEach((sprite) => {
          
        });
    }
    render(game) {
        game.debug.text(game.time.fps, 2, 14, "#00ff00");
    }
}
