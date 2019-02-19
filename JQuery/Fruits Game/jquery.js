//click on start/reset
//if:play=true
//reload Page
//else
//change to reset
//show trials box
//make score=0
//do:create random fruit
//define random step
//move fruit down every 30sec
//if height <threshold
//while:if trials>0
//trials--

//else
//Show game over
//change reset to start
//slice -> play sound and explode the fruit -> score++
var play = false;
var score = 0;
var trials;
var step;
var currentObj;
var action;
var fruitN = 4;
$(function () {
    $('#startreset').click(function () {
        if ($(this).html() == 'Reset Game') {
            location.reload();
            play = false;
        } else {
            play = true;
            $(this).html('Reset Game');
            score = 0;
            $('#trialsLeft').show();
            $('#gameOver').hide();
            trials = 3;
            addHearts();

            startGame();
        }

    });

    function startGame() {
        createFruit();

        simGame();

    };

    function movObj() {
        step = chooseFruit(5);
        $('#fruit' + currentObj).css('top', $('#fruit' + currentObj).position().top + step);
    }

    function createFruit() {
        currentObj = chooseFruit(fruitN);
        $('#fruit' + currentObj).css({
            'left': genPos([0, 590]),
            'top': -70
        });

        $('#fruit' + currentObj).show();
    }

    function simGame() {

        action = setInterval(function () {

            movObj();
            if ($('#fruit' + currentObj).position().top > $('#fruitsContainer').height()) {

                if (trials == 1) {

                    $('#gameOver').html('<p>Game Over!<br><br>your score is ' + score + '</p>');
                    $('#gameOver').show();
                    $('#trialsLeft').hide();
                    $('#startreset').html('Start Game');
                    play = false;
                    clearInterval(action);

                } else {
                    trials--;
                    addHearts();
                    createFruit();
                }
            }
        }, 10);
    };

    function hitFruit() {
        $('#fruit' + currentObj).hide('explode', 500);
        clearInterval(action);
    }

    function genPos(range) {
        return (range[0] + Math.floor((range[1] - range[0] + 1) * Math.random()));
    }

    function chooseFruit(n) {
        return (1 + Math.floor((n - 1) * Math.random()));
    };

    function addHearts() {
        $('#trialsLeft').empty();
        for (var i = 0; i < trials; i++) {
            $('#trialsLeft').append('<img src="images/heart.png" class="heart">');
        }
    };
    $('.fruit').mouseover(function () {
        score++;
        $('#scorevalue').html(score);
        $('#sliceSound')[0].play();
        hitFruit();
        setTimeout(function () {
            startGame();
        }, 500);

    });
});
