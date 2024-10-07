import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

// start the game
kaboom({
    width: 1000,
    height: 600
});

// define gravity
setGravity(2400);

// load a default sprite
//loadBean()
loadSprite("player", "./penguin-png-images-5a22412a142e52.5027763715121943460827-removebg-preview.png");
loadSprite("coin", "./pngtree-gold-coin-coin-money-e-commerce-gold-coin-image_1138140-removebg-preview.png");
loadSprite("background", "./background2.png");

loadSound("coin_sound", "./sfx/coin.mp3");
loadSound("death_sound", "./sfx/death.mp3");
loadSound("jump_sound", "./sfx/jump.mp3");
loadSound("game_music", "./sfx/music.mp3");

let score = 0;

const bg_music = play("game_music", {
    volume: 0.8,
    loop: true
})

scene("one", ()=>{
    bg_music.paused = false;
    add([
        sprite("background", {width:width(), height:height()}),
        pos(0, 0),
    ])
    
    add([
        rect(200, 200),
        pos(0, height()-200),
        color(100, 100, 100),
        area(),
        body({isStatic: true}),
    ])
    
    add([
        text("Score: " + score),
        pos(0,0),
        scale(1.5),
        color(0,0,0),
    ])

    let h;
    let prev = height() - 200;
    let prev2;
    // random platform generator
    for(let i = 300; i < width(); i += Math.floor(Math.random() * 300) + 75) {
        h = Math.floor(Math.random() * 7) % 2 == 1 ? prev + (Math.floor(Math.random() * 125)) : prev - (Math.floor(Math.random() * 75) + 35);
        if(prev >= height() - 100)
            h -= 125;
        if(prev - h >= 150 || h <= 100)
            h += 150;
        add([
            rect(Math.floor(Math.random() * 15) + 75, 50),
            pos(i, h),
            color(100, 100, 100),
            area(),
            body({isStatic: true}),
        ])
        prev = h;
        prev2 = i;
    }
    
    // add character to screen, from a list of components
    const player = add([
        sprite("player"),  // renders as a sprite
        pos(10, height() - 250),    // position in world
        area(),          // has a collider
        body(),          // responds to physics and gravity
        scale(0.125),
    ])
    
    const coin = add([
        sprite("coin"),
        pos(prev2, height() - 800),
        area(),
        body(),
        scale(0.125),
        "coin"
    ])

    // jump when player presses "space" key
    onKeyPress("up", () => {
        // .jump() is provided by the body() component
        if(player.isGrounded()) {
            player.jump(900);
            play("jump_sound");
        }
    })
    
    onKeyDown("right", () => {
        player.move(350,0);
    })
    
    onKeyDown("left", () => {
        if(player.pos.x > 10)
            player.move(-350,0);
    })

    player.onCollide("coin", ()=>{
        score++;
        play("coin_sound");
        go("one");
    })

    onUpdate(()=> {
        if(player.pos.y >= height()) {
            bg_music.paused = true;
            go("gameover");
        }
        if(coin.pos.y >= height()) {
            coin.pos.x -= 75;
            coin.pos.y = height() - 800;
            coin.jump(1000);
            coin.move(-350, 0);
        }
    });
})

scene("gameover", ()=>{
    play("death_sound")
    add([
        rect(width(), height()),
        color(23,54,63),
        pos(0,0),
    ])
    add([
        text("Game Over\nClick to Restart\nScore: " + score),
        anchor("center"),
        pos(width() / 2, height() / 2),
        color(255, 0, 0),
        scale(2),
    ])
    score = 0;
    onClick(() => {
        go("one");
    })
})

go("one");