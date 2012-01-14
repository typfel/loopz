require({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'backbone': '../lib/backbone-min',
        'underscore': '../lib/underscore-min',
        'jquery': '../lib/jquery-1.7.1-min'
    }
},
['jquery', 'GameView', 'GameController', '../lib/paper'],
function ($, GameView, GameController) {

    $(function () {
        $('#loopz-game').each(function (index, element) {
            paper = new paper.PaperScope();
            
            var gameView   = new GameView(element);
            var controller = new GameController(gameView);
        }); 
    });

});
