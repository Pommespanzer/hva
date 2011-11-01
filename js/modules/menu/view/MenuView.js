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

        mapView.addUnits(LevelOne.units);
        mapView.addObstacles(LevelOne.obstacles);
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

        var data = this.model.load(),
            battlefield = $('#battlefield'),
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


var LevelOne = {
    obstacles: [
{y: 0,x: 6},
{y: 0,x: 7},
{y: 0,x: 9},
{y: 0,x: 10},
{y: 0,x: 11},
{y: 0,x: 12},
{y: 0,x: 13},
{y: 0,x: 14},
{y: 0,x: 15},
{y: 0,x: 16},
{y: 0,x: 17},
{y: 0,x: 18},
{y: 0,x: 19},
{y: 0,x: 20},
{y: 0,x: 21},
{y: 0,x: 22},
{y: 0,x: 23},
{y: 0,x: 24},
{y: 0,x: 25},
{y: 0,x: 26},
{y: 0,x: 27},
{y: 0,x: 28},
{y: 0,x: 29},
{y: 0,x: 30},
{y: 0,x: 31},
{y: 1,x: 6},
{y: 1,x: 7},
{y: 1,x: 9},
{y: 1,x: 10},
{y: 1,x: 11},
{y: 1,x: 30},
{y: 1,x: 31},
{y: 2,x: 6},
{y: 2,x: 7},
{y: 2,x: 9},
{y: 2,x: 10},
{y: 2,x: 11},
{y: 2,x: 28},
{y: 2,x: 29},
{y: 2,x: 30},
{y: 2,x: 31},
{y: 3,x: 6},
{y: 3,x: 7},
{y: 3,x: 9},
{y: 3,x: 10},
{y: 3,x: 11},
{y: 3,x: 15},
{y: 3,x: 16},
{y: 3,x: 17},
{y: 3,x: 18},
{y: 3,x: 19},
{y: 3,x: 20},
{y: 3,x: 21},
{y: 3,x: 22},
{y: 3,x: 23},
{y: 3,x: 24},
{y: 3,x: 25},
{y: 3,x: 28},
{y: 3,x: 29},
{y: 3,x: 30},
{y: 3,x: 31},
{y: 4,x: 6},
{y: 4,x: 7},
{y: 4,x: 9},
{y: 4,x: 10},
{y: 4,x: 11},
{y: 4,x: 15},
{y: 4,x: 25},
{y: 4,x: 28},
{y: 4,x: 29},
{y: 4,x: 30},
{y: 4,x: 31},
{y: 5,x: 6},
{y: 5,x: 7},
{y: 5,x: 9},
{y: 5,x: 10},
{y: 5,x: 11},
{y: 5,x: 15},
{y: 5,x: 25},
{y: 5,x: 28},
{y: 5,x: 29},
{y: 5,x: 30},
{y: 5,x: 31},
{y: 6,x: 6},
{y: 6,x: 7},
{y: 6,x: 9},
{y: 6,x: 10},
{y: 6,x: 11},
{y: 6,x: 15},
{y: 6,x: 30},
{y: 6,x: 31},
{y: 7,x: 6},
{y: 7,x: 7},
{y: 7,x: 9},
{y: 7,x: 10},
{y: 7,x: 11},
{y: 7,x: 15},
{y: 7,x: 25},
{y: 7,x: 30},
{y: 7,x: 31},
{y: 8,x: 6},
{y: 8,x: 7},
{y: 8,x: 9},
{y: 8,x: 10},
{y: 8,x: 11},
{y: 8,x: 15},
{y: 8,x: 18},
{y: 8,x: 19},
{y: 8,x: 20},
{y: 8,x: 21},
{y: 8,x: 22},
{y: 8,x: 23},
{y: 8,x: 24},
{y: 8,x: 25},
{y: 8,x: 26},
{y: 8,x: 27},
{y: 8,x: 30},
{y: 8,x: 31},
{y: 9,x: 6},
{y: 9,x: 7},
{y: 9,x: 9},
{y: 9,x: 10},
{y: 9,x: 11},
{y: 9,x: 15},
{y: 9,x: 18},
{y: 9,x: 19},
{y: 9,x: 20},
{y: 9,x: 21},
{y: 9,x: 22},
{y: 9,x: 23},
{y: 9,x: 24},
{y: 9,x: 25},
{y: 9,x: 26},
{y: 9,x: 27},
{y: 9,x: 30},
{y: 9,x: 31},
{y: 10,x: 6},
{y: 10,x: 7},
{y: 10,x: 9},
{y: 10,x: 10},
{y: 10,x: 11},
{y: 10,x: 15},
{y: 10,x: 25},
{y: 10,x: 30},
{y: 10,x: 31},
{y: 11,x: 6},
{y: 11,x: 7},
{y: 11,x: 9},
{y: 11,x: 10},
{y: 11,x: 11},
{y: 11,x: 15},
{y: 11,x: 25},
{y: 11,x: 30},
{y: 11,x: 31},
{y: 12,x: 15},
{y: 12,x: 18},
{y: 12,x: 19},
{y: 12,x: 20},
{y: 12,x: 21},
{y: 12,x: 25},
{y: 12,x: 28},
{y: 12,x: 29},
{y: 12,x: 30},
{y: 12,x: 31},
{y: 13,x: 15},
{y: 13,x: 18},
{y: 13,x: 19},
{y: 13,x: 20},
{y: 13,x: 21},
{y: 13,x: 25},
{y: 13,x: 28},
{y: 13,x: 29},
{y: 13,x: 30},
{y: 13,x: 31},
{y: 14,x: 15},
{y: 14,x: 18},
{y: 14,x: 19},
{y: 14,x: 20},
{y: 14,x: 21},
{y: 14,x: 25},
{y: 14,x: 28},
{y: 14,x: 29},
{y: 14,x: 30},
{y: 14,x: 31},
{y: 15,x: 6},
{y: 15,x: 7},
{y: 15,x: 9},
{y: 15,x: 10},
{y: 15,x: 11},
{y: 15,x: 12},
{y: 15,x: 13},
{y: 15,x: 14},
{y: 15,x: 15},
{y: 15,x: 18},
{y: 15,x: 19},
{y: 15,x: 20},
{y: 15,x: 21},
{y: 15,x: 25},
{y: 15,x: 28},
{y: 15,x: 29},
{y: 15,x: 30},
{y: 15,x: 31},
{y: 16,x: 6},
{y: 16,x: 7},
{y: 16,x: 9},
{y: 16,x: 10},
{y: 16,x: 11},
{y: 16,x: 18},
{y: 16,x: 19},
{y: 16,x: 20},
{y: 16,x: 21},
{y: 16,x: 25},
{y: 16,x: 28},
{y: 16,x: 29},
{y: 16,x: 30},
{y: 16,x: 31},
{y: 17,x: 6},
{y: 17,x: 7},
{y: 17,x: 9},
{y: 17,x: 10},
{y: 17,x: 11},
{y: 17,x: 18},
{y: 17,x: 19},
{y: 17,x: 20},
{y: 17,x: 21},
{y: 17,x: 25},
{y: 17,x: 28},
{y: 17,x: 29},
{y: 17,x: 30},
{y: 17,x: 31},
{y: 18,x: 6},
{y: 18,x: 7},
{y: 18,x: 9},
{y: 18,x: 10},
{y: 18,x: 11},
{y: 18,x: 18},
{y: 18,x: 19},
{y: 18,x: 20},
{y: 18,x: 21},
{y: 18,x: 25},
{y: 19,x: 6},
{y: 19,x: 7},
{y: 19,x: 9},
{y: 19,x: 10},
{y: 19,x: 11},
{y: 19,x: 18},
{y: 19,x: 19},
{y: 19,x: 20},
{y: 19,x: 21},
{y: 19,x: 25},
{y: 20,x: 6},
{y: 20,x: 7},
{y: 20,x: 9},
{y: 20,x: 10},
{y: 20,x: 11},
{y: 20,x: 18},
{y: 20,x: 19},
{y: 20,x: 20},
{y: 20,x: 21},
{y: 20,x: 25},
{y: 21,x: 6},
{y: 21,x: 7},
{y: 21,x: 9},
{y: 21,x: 10},
{y: 21,x: 11},
{y: 21,x: 12},
{y: 21,x: 13},
{y: 21,x: 14},
{y: 21,x: 15},
{y: 21,x: 16},
{y: 21,x: 17},
{y: 21,x: 18},
{y: 21,x: 19},
{y: 21,x: 20},
{y: 21,x: 21},
{y: 21,x: 22},
{y: 21,x: 23},
{y: 21,x: 24},
{y: 21,x: 25},
{y: 22,x: 6},
{y: 22,x: 7},
{y: 22,x: 9},
{y: 22,x: 10},
{y: 22,x: 11},
{y: 22,x: 12},
{y: 22,x: 13},
{y: 22,x: 14},
{y: 22,x: 15},
{y: 22,x: 16},
{y: 22,x: 17},
{y: 22,x: 18},
{y: 22,x: 19},
{y: 22,x: 20},
{y: 22,x: 21},
{y: 22,x: 22},
{y: 22,x: 23},
{y: 22,x: 24},
{y: 22,x: 25},
{y: 22,x: 26},
{y: 22,x: 27},
{y: 22,x: 28},
{y: 22,x: 29},
{y: 22,x: 30},
{y: 22,x: 31},
{y: 23,x: 6},
{y: 23,x: 7},
{y: 23,x: 9},
{y: 23,x: 10},
{y: 23,x: 11},
{y: 23,x: 12},
{y: 23,x: 13},
{y: 23,x: 14},
{y: 23,x: 15},
{y: 23,x: 16},
{y: 23,x: 17},
{y: 23,x: 18},
{y: 23,x: 19},
{y: 23,x: 20},
{y: 23,x: 21},
{y: 23,x: 22},
{y: 23,x: 23},
{y: 23,x: 24},
{y: 23,x: 25},
{y: 23,x: 26},
{y: 23,x: 27},
{y: 23,x: 28},
{y: 23,x: 29},
{y: 23,x: 30},
{y: 23,x: 31}
],
    units: [
        {
            position: {
                x: 12,
                y: 1
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 12,
                    y: 1
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 29,
                y: 1
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 29,
                    y: 1
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 24,
                y: 4
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 24,
                    y: 4
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 29,
                y: 11
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 29,
                    y: 11
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 14,
                y: 14
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 14,
                    y: 14
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 26,
                y: 21
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [MachineGunView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 26,
                    y: 21
                },
                protectionRange: 25
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        /*
         * USERS UNITS
         */
        {
            position: {
                x: 0,
                y: 0
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [MachineGunView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 1,
                y: 0
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [MachineGunView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 2,
                y: 0
            },
            type: 'unit-human-bazooka',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [BazookaView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 0,
                y: 23
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [MachineGunView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 1,
                y: 23
            },
            type: 'unit-human-mg',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [MachineGunView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 2,
                y: 23
            },
            type: 'unit-human-bazooka',
            armor: 400,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [BazookaView, PistolView],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 11,
                y: 14
            },
            type: 'defense-tower',
            armor: 800,
            actionPoints: 10,
            isEnemy: true,
            speed: 0,
            weapons: [DoubleBazookaView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 11,
                    y: 14
                },
                protectionRange: 5
            },
            sounds: {
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 11,
                y: 12
            },
            type: 'defense-tower',
            armor: 800,
            actionPoints: 10,
            isEnemy: true,
            speed: 0,
            weapons: [DoubleBazookaView],
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 11,
                    y: 12
                },
                protectionRange: 5
            },
            sounds: {
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        }
    ]
};
