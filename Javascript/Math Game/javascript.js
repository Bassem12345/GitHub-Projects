var play = false;
var i = 60;
var result = 0;
var choices;
var indeces;
var score = 0;

function simpleRound(n, mode) {
    if (mode == 1)
        return (1 + Math.floor((n - 1) * Math.random()));
    else
        return (Math.floor(n * Math.random()));
}

function generateA(result, n, size, m) {
    var available = [];
    var drawn = [];
    for (var i = 1; i <= size; i++) {
        if (i != result)
            available.push(i);
    }

    for (i = 1; i <= n; i++) {
        var random = simpleRound(available.length, m);
        drawn.push(available[random]);
        available.splice(random, 1);

    }

    return drawn;
}

function generateQA() {
    var a = simpleRound(10, 1);
    var b = simpleRound(10, 1);
    document.getElementById('question').innerHTML = a + 'x' + b;
    result = a * b;
    choices = generateA(result, 3, 100, 1);
    choices.push(result);

    indeces = generateA(-1, 4, 4, 0);

    for (var i = 0; i <= 3; i++)

        document.getElementById('choice' + indeces[i]).innerHTML = choices[i];


}
document.getElementById('start').onclick = function () {

    if (document.getElementById('start').innerHTML == 'Reset Game') {
        location.reload();
    } else {
        i = 60;
        play = true;
        document.getElementById('scoreValue').innerHTML = 0;
        document.getElementById('time').style.display = 'block';
        document.getElementById('over').style.display = 'none';
        document.getElementById('start').innerHTML = 'Reset Game';
        generateQA();
        var action = setInterval(function () {
            document.getElementById('remainingValue').innerHTML = i;
            if (i == 0) {
                clearInterval(action);
                document.getElementById('over').style.display = 'block';
                document.getElementById('time').style.display = 'none';
                document.getElementById('correct').style.display = 'none';
                document.getElementById('wrong').style.display = 'none';
                document.getElementById('over').innerHTML = '<p>GAME OVER!<br><br>YOUR SCORE IS ' + score + '.</p>';
                document.getElementById('start').innerHTML = 'Start Game';
                play = false;

            }
            i--;
        }, 1000);

    }
};

for (var i = 1; i <= 4; i++) {
    document.getElementById('choice' + i).onclick = function () {

        if (play == true)

            if (this.innerHTML == result) {
                {
                    score++;
                    document.getElementById('scoreValue').innerHTML = score;

                    this.style.transition = 'all 1s';
                    document.getElementById('correct').style.display = 'block';
                    setTimeout(function () {

                        document.getElementById('correct').style.display = 'none';
                    }, 1000);
                    generateQA();
                    ans = true;
                }
            }
        else {
            document.getElementById('wrong').style.display = 'block';
            setTimeout(function () {

                document.getElementById('wrong').style.display = 'none';
            }, 1000);
        }

    };
}
