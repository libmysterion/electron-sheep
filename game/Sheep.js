const SHEEP_WALK_SPEED = 16;
const SHEEP_GRAVITY = 1000;
module.exports.Sheep = class Sheep {
    constructor(game, sprite){
        this.game = game;
        this.walkies = this.walkies.bind(this, sprite);
        this.splat = this.splat.bind(this, sprite);
        this.walkLeft = this.walkLeft.bind(this, sprite);
        this.walkRight = this.walkRight.bind(this, sprite);

        this.sprite = sprite;
        sprite.anchor.setTo(.5, .5);
        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.y =  0.7;
        sprite.body.gravity.y = SHEEP_GRAVITY;
        sprite.body.velocity.y = 100;
        sprite.animations.add('walk', [2, 3]);
        sprite.animations.add('splat', [ 48 ]);
        sprite.animations.add('slide-side', [ 40, 41 ]);
        
       // sprite.body.onCollide = new Phaser.Signal();
        // sprite.body.onCollide.add((sheep1, sheep2) => {
        //     console.log('collide', sheep1, sheep2);
        //     const randy = game.rnd.integerInRange(0, 100);
        //     if (randy > 80) {
        //         // let him bounce
        //     } else if (randy > 60) {
        //         // turn away..disable bounce
        //     } else if (sprite.body.velocity.y > 500) {
        //         // splat him
        //        this.splat();
        //     } else {
        //         // just walk off...disable bounce
        //     }
        // });

        //  Input Enable the sprites
        sprite.inputEnabled = true;

        //  Allow dragging - the 'true' parameter will make the sprite snap to the center
        sprite.input.enableDrag(true);
        //
        //sprite.animations.play('walk', 2, true);
    }
    splat(sprite){
        sprite.animations.play('splat', 2, true);
        sprite.body.velocity.y = 0;
        setTimeout(() => {
            this.walkies();
        }, 2000);
    }
    isIdle(){
      //  return this.sprite.body.isMoving === false;
   // debugger;
        return ((this.sprite.body.wasTouching.down &&
            this.sprite.body.touching.down) ||
             this.sprite.body.blocked.down) &&
            Math.abs(this.sprite.body.velocity.x) < SHEEP_WALK_SPEED;
    }
    isFalling(){
        return this.sprite.body.wasTouching.down && 
            this.sprite.body.touching.none && 
            this.sprite.body.velocity.y > 0;
    }
    update(){
       // console.log('update', this.sprite.body.wasTouching.down, Math.abs(this.sprite.body.velocity.x) < SHEEP_WALK_SPEED);
        if (this.isFalling()) {
            this.slideDownSide();
        }else if(this.isIdle()){
            this.doSomething();
        }
    }
    isMovigLeft(){
        return this.sprite.body.velocity.x < 0;
    }
    isMovigRight(){
        return this.sprite.body.velocity.x > 0;
    }
    slideDownSide(){
        console.log('slide down that side!');
        this.sprite.animations.play('slide-side', 2, true);
        const left = this.isMovigLeft();
        this.sprite.body.velocity.y = 0;
        this.sprite.body.velocity.x = 0;
        this.sprite.scale.x *= -1;
        this.sprite.body.gravity.y = 0;
        this.sprite.body.position.y = this.sprite.body.position.y + this.sprite.body.height;  
        if(left){
            this.sprite.body.position.x += 5; 
        } else {
            this.sprite.body.position.x -= 5;
        }

        

        // i think i want to tween garvity here or something?
        //.. but still after he hangs for 2

        setTimeout(() => {
            this.sprite.body.gravity.y = 13;
            setTimeout(() => {
                this.sprite.body.gravity.y = SHEEP_GRAVITY;
            }, 1000);
        }, 2000);
        // i need to do some math to make a curve
        // thats the y velocity!
        // then its like he struggle and slide!
    }
    doSomething(){
        const fn = this.game.rnd.pick([ this.walkies ]);
        fn();
    }

    walkies(sprite){
        console.log('walkies');
        sprite.animations.play('walk', 2, true);
        sprite.body.velocity.y = 0;
        const walkFn = this.game.rnd.pick([ this.walkLeft, this.walkRight ]);
        walkFn();
    }
    walkLeft(sprite){
        sprite.body.velocity.x = SHEEP_WALK_SPEED * -1;
        // Invert scale.x to flip left/right
        if(sprite.scale.x < 0){
            sprite.scale.x *= -1;
        }
    }
    walkRight(sprite){
        sprite.body.velocity.x = SHEEP_WALK_SPEED;
        // Invert scale.x to flip left/right
        if(sprite.scale.x > 0){
            sprite.scale.x *= -1;
        }
    }


}