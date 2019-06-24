var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
var game_state = {};

game_state.main = function() {};
game_state.menu = function() {};
game_state.shop = function() {};

var mainRecord = '0';
var bpmText;
var planeMain;

game_state.shop.prototype = {
    preload: function() {
        game.load.image('cell', 'https://image.ibb.co/hRizOA/cell.png');
        game.load.image('arrow', 'https://image.ibb.co/mFxJ0q/arrey.png');
        game.load.image('plane2', 'https://image.ibb.co/eC5ADA/plane2.png');
    },

    create: function() {
        this.game.add.sprite(0, 0, 'cell');

        this.add.button(10, 10, 'arrow', this.startMenu, this);
        this.add.button(30, 170, 'plane2', this.choisePlane, this);
    },

    startMenu: function() {
        this.game.state.start('menu');
    },

    choisePlane: function(arg) {

    }
};

game_state.menu.prototype = {
    preload: function() {
        game.load.image('menu', 'https://image.ibb.co/igUNRV/start.png');
        game.load.image('angar', 'https://image.ibb.co/eTkPqq/angar.png');
        this.game.stage.backgroundColor = '#71c5cf';
    },

    create: function() {
        this.add.button(0, 0, 'menu', this.startGame, this);
        this.add.button(7, 440, 'angar', this.openShop, this);
        this.game.add.text(120, 250, 'Ваш рекорд:');
        this.game.add.text(200, 300, mainRecord);
    },

    startGame: function() {
        this.game.state.start('main');
    },

    openShop: function() {
        this.game.state.start('shop');
    }

};


game_state.main.prototype = {

    preload: function() {

        this.game.load.image('plane', 'https://image.ibb.co/jVPxRV/plane.png');

        this.game.load.image('pipe', 'https://image.ibb.co/mPkwmV/pipe.png');
    },

    create: function() {

        this.plane = this.game.add.sprite(100, 245, 'plane');


        this.plane.body.gravity.y = 1000;

        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);

        game.input.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);

        this.plane.anchor.setTo(-0.2, 0.5);
    },

    update: function() {

        if (this.plane.inWorld == false)
            this.restart_game();

        this.game.physics.overlap(this.plane, this.pipes, this.hitPipe, null, this);

        if (this.plane.angle < 20)
            this.plane.angle += 1;

    },

    jump: function() {
        this.plane.angle = -20

        this.plane.body.velocity.y = -350;


        var animation = game.add.tween(this.plane);


        animation.to({ angle: -20 }, 100);


        animation.start();

        if (this.plane.alive == false)
            return;

    },


    restart_game: function() {

        this.game.state.start('menu');

        this.game.time.events.remove(this.timer);
    },

    add_one_pipe: function(x, y) {

        var pipe = this.pipes.getFirstDead();


        pipe.reset(x, y);

        pipe.body.velocity.x = -200;


        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        this.score += 1;
        this.label_score.content = this.score;

        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i !== hole && i !== (hole + 1)) {
                this.add_one_pipe(400, i * 60 + 10);
            }
        }
    },

    hitPipe: function() {

        if (this.plane.alive == false)
            return;


        this.plane.alive = false;

        mainRecord = this.score;

        game.time.events.remove(this.timer);

        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    },


};

game.state.add('main', game_state.main);
game.state.add('menu', game_state.menu);
game.state.add('shop', game_state.shop);
game.state.start('menu');