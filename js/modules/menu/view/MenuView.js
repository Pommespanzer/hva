var MenuView = Backbone.View.extend({
    /**
     * Object where to bind the menu.
     */
    el: $('body'),

    /**
     * All binded menu events.
     */
    events: {
        'click #js-resume-game': 'backToGame',
        'click #js-new-game': 'newGame',
        'click #js-save-game': 'saveGame',
        'click #js-load-game': 'loadGame',
        'click #js-quit-game': 'quitGame',
        'click #js-about': 'about'
    },

    /**
     * INIT
     * 
     * @return void
     */
    initialize: function () {
        _.bindAll(
            this,
            'backToGame',
            'newGame',
            'saveGame',
            'loadGame',
            'about',
            'quitGame'
        );
        
        this.render();
    },

    /**
     * This method displays the menu with different menu points than the initial
     * menu.
     * 
     * - back to game
     * - save game
     * - load game
     * - about
     * - quit game
     * 
     * @return void
     */
    show: function () {
        $('#js-resume-game').removeClass('hide');
        $('#js-save-game').removeClass('hide');
        $('#js-quit-game').removeClass('hide');
        $('#js-new-game').addClass('hide');
        $('#js-menu').removeClass('hide');
    },

    /**
     * This method hides the menu.
     * 
     * @return void
     */
    hide: function () {
        $('#js-menu').addClass('hide');
    },

    /**
     * This method hides the menu and displays the game.
     * 
     * @return void
     */
    backToGame: function () {
        this.hide();
        
        $('#battlefield').show();
        $('#js-action-panel').show();
    },

    /**
     * This method is called if an user clicked on the new game link in the menu.
     * It startes a new game.
     * 
     * @return void
     */
    newGame: function () {
        this.hide();

        actionPanelView = new ActionPanelView({
            model: new ActionPanelModel()
        });

        actionPanelView.render();
        
        mapView = new MapView({
            model: new MapModel()
        });

        mapView.render();
    },

    /**
     * This method saves the current state of the game.
     * 
     * @return void
     */
    saveGame: function () {
        this.model.save(mapView.unitCollection, mapView.obstacleCollection);
    },

    /**
     * This method loades a saved game state.
     * 
     * @return void
     */
    loadGame: function () {
        this.hide();
        
        var data = this.model.load();

        var battlefield = $('#battlefield'),
            actionPanel = $('#js-action-panel');
        
        if (battlefield.length === 0 && actionPanel.length === 0) {
            this.hide();

            actionPanelView = new ActionPanelView({
                model: new ActionPanelModel()
            });

            mapView = new MapView({
                model: new MapModel()
            });
        } else {
            battlefield.remove();
            actionPanel.remove();
        }
        
        mapView.unitCollection.reset(data.units);
        mapView.obstacleCollection.reset(data.obstacles);
        mapView.render();
        
        actionPanelView.render();
        
        actionPanel.show();
    },

    /**
     * This method displayes something about me.
     * 
     * @return void
     */
    about: function () {
        
    },

    /**
     * This method quits the game and display after reload the initial menu.
     * 
     * @return void
     */
    quitGame: function () {
        window.location.reload();
    },

    /**
     * This method renders the initial menu
     * 
     * - new game
     * - load game
     * - about
     * 
     * @return void
     */
    render: function () {
        var html = [];

        html.push('<ul id="js-menu" class="menu">');
        html.push('<li><a href="javascript:;" class="hide" id="js-resume-game">zurück zum Spiel</a></li>');
        html.push('<li><a href="javascript:;" id="js-new-game">neues Spiel</a></li>');
        html.push('<li><a href="javascript:;" class="hide" id="js-save-game">Spielstand speichern</a></li>');
        html.push('<li><a href="javascript:;" id="js-load-game">Spielstand laden</a></li>');
        html.push('<li><a href="javascript:;" id="js-about">About</a></li>');
        html.push('<li><a href="javascript:;" class="hide" id="js-quit-game">Spiel beenden</a></li>');
        html.push('</ul>');

        this.el.append(html.join(''));
    }
});