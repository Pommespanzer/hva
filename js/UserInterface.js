var UserInterface = function() {
    var _battlefieldMap = $('#battlefield');

    var _addUnits = function () {
        var i;
        for (i in Level.units) {
            var x = Level.units[i].position.x;
            var y = Level.units[i].position.y;

            var id = Math.floor(Math.random() * 9999999999 + x + Math.random() * 9999999999 + y);
            var unit = new Unit(id, id);
            unit.setType(Level.units[i].type);
            unit.setAmmo(Level.units[i].ammo);
            unit.setActionPoints(Level.units[i].actionPoints);
            unit.isEnemy = Level.units[i].isEnemy;
            unit.setSpeed(Level.units[i].speed);
            unit.addWeapon(Level.units[i].weapon);
            unit.setOrder(Level.units[i].order);
            unit.setSounds(Level.units[i].sounds);
            
            Map.addUnit(unit, x, y);
        }
    };
    
    var _addObstacles = function () {
        var i;
        for (i = 0; i < Level.obstacles.length; i++) {
            var x = Level.obstacles[i].x;
            var y = Level.obstacles[i].y;

            Map.addObstacle(x, y);
        }
    };

    var _handleClickOnBattlefield = function(event) {
        var coordinates = Map.getPosition(event.clientX, event.clientY);

        var selectedUnit = Map.getSelectedUnit();
        var unit = Map.getUnit(coordinates.x, coordinates.y);
        var hindrance = Map.getObstacle(coordinates.x, coordinates.y);

        if (hindrance) {
            return;
        }

        if (unit !== false && unit.isEnemy === true) {
            // user wants to attack an enemy
            if (selectedUnit !== null) {
                _battlefieldMap.trigger('attack', [unit]);
            }

            return;
        }

        // free place on battlefield
        if (false === unit) {
            if (selectedUnit !== null) {
                _battlefieldMap.trigger('move', [coordinates]);
            }
            return;
        }

        // remove all selections on battlefield
        var selectedUnitObject = $('.selected', _battlefieldMap);
        if (selectedUnitObject.length !== 0) {
            selectedUnitObject.removeClass('selected');
            selectedUnitObject.css('background-position', '');
        }

        Map.setSelectedUnit(unit);

        // mark clicked unit on battlefield
        $('#' + unit.getId()).addClass('selected');

        unit.renderFirerange(coordinates.x, coordinates.y);
        ControlPanel.displayAll(unit);
    };

    this.initEventListeners = function () {
        _battlefieldMap.bind('lock.userEvents', function() {
            $('.finish-turn').hide();
            _battlefieldMap.unbind('click.bf');
        });

        _battlefieldMap.bind('unlock.userEvents', function() {
            // to avoid multi bindings
            _battlefieldMap.trigger('lock.userEvents');

            _battlefieldMap.bind('click.bf', _handleClickOnBattlefield);
            $('.finish-turn').show();
        });

        $('.finish-turn').bind('click', function() {
            Status.usersTurn = false;
            Ai.init();
        });

        _battlefieldMap.bind('move', function(event, coordinates) {
            var selectedUnit = Map.getSelectedUnit();
            var position  = selectedUnit.getPosition();
            var wayPoints = UnitFacade.getWaypoints(position.x, position.y, coordinates.x, coordinates.y);

            if (!wayPoints) {
                return false;
            }

            selectedUnit.move(wayPoints);
        });

        _battlefieldMap.bind('attack', function(event, enemy) {
            var selectedUnit = Map.getSelectedUnit();
            selectedUnit.attack(enemy);
        });
    };

    this.init = function() {
        // MAP
        Map.init();

        // Control Panel
        ControlPanel.init();

        // add obstacles
        _addObstacles();
        
        // add units
        _addUnits();

        this.initEventListeners();

        _battlefieldMap.trigger('unlock.userEvents');
    };
};

var Level = {
    obstacles: [
        // line 1
        {x: 6, y: 0},
        // line 2 -> empty
        // line 3
        {x: 4, y: 2},
        {x: 5, y: 2},
        {x: 6, y: 2},
        {x: 7, y: 2},
        {x: 8, y: 2},
        {x: 9, y: 2},
        {x: 10, y: 2},
        {x: 11, y: 2},
        {x: 12, y: 2},
        {x: 14, y: 2},
        {x: 15, y: 2},
        // line 4
        {x: 4, y: 3},
        {x: 5, y: 3},
        {x: 15, y: 3},
        {x: 17, y: 3},
        {x: 18, y: 3},
        // line 5
        {x: 4, y: 4},
        {x: 5, y: 4},
        {x: 12, y: 4},
        {x: 13, y: 4},
        {x: 14, y: 4},
        {x: 15, y: 4},
        {x: 17, y: 4},
        {x: 18, y: 4},
        // line 6
        {x: 1, y: 5},
        {x: 2, y: 5},
        {x: 4, y: 5},
        {x: 5, y: 5},
        {x: 15, y: 5},
        // line 7
        {x: 1, y: 6},
        {x: 2, y: 6},
        {x: 4, y: 6},
        {x: 5, y: 6},
        {x: 15, y: 6},
        // line 8
        {x: 4, y: 7},
        {x: 5, y: 7},
        {x: 7, y: 7},
        {x: 15, y: 7},
        // line 9
        {x: 4, y: 8},
        {x: 5, y: 8},
        {x: 7, y: 8},
        {x: 15, y: 8},
        // line 10
        {x: 7, y: 9},
        {x: 15, y: 9},
        // line 11
        {x: 7, y: 10},
        {x: 15, y: 10},
        // line 12
        {x: 4, y: 11},
        {x: 5, y: 11},
        {x: 7, y: 11},
        {x: 15, y: 11},
        // line 13
        {x: 4, y: 12},
        {x: 5, y: 12},
        {x: 7, y: 12},
        {x: 15, y: 12},
        // line 14
        {x: 1, y: 13},
        {x: 2, y: 13},
        {x: 4, y: 13},
        {x: 5, y: 13},
        {x: 15, y: 13},
        // line 15
        {x: 1, y: 14},
        {x: 2, y: 14},
        {x: 4, y: 14},
        {x: 5, y: 14},
        {x: 15, y: 14},
        // line 16
        {x: 4, y: 15},
        {x: 5, y: 15},
        {x: 12, y: 15},
        {x: 13, y: 15},
        {x: 14, y: 15},
        {x: 15, y: 15},
        {x: 17, y: 15},
        {x: 18, y: 15},
        // line 17
        {x: 4, y: 16},
        {x: 5, y: 16},
        {x: 15, y: 16},
        {x: 17, y: 16},
        {x: 18, y: 16},
        // line 18
        {x: 4, y: 17},
        {x: 5, y: 17},
        {x: 6, y: 17},
        {x: 7, y: 17},
        {x: 8, y: 17},
        {x: 9, y: 17},
        {x: 10, y: 17},
        {x: 11, y: 17},
        {x: 12, y: 17},
        {x: 14, y: 17},
        {x: 15, y: 17},
        // line 19 -> empty
        // line 20
        {x: 6, y: 19},
    ],
    units: [
        {
            position: {
                x: 6,
                y: 3
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 6,
                    y: 3
                },
                protectionRange: 5
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 6,
                y: 16
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 6,
                    y: 16
                },
                protectionRange: 5
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 8,
                y: 7
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 8,
                    y: 7
                },
                protectionRange: 5
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 8,
                y: 12
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 8,
                    y: 12
                },
                protectionRange: 5
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 12,
                y: 5
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 12,
                    y: 5
                },
                protectionRange: 5
            },
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 12,
                y: 14
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            order: {
                action: 'protect',
                positionToProtect: {
                    x: 12,
                    y: 14
                },
                protectionRange: 5
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
            ammo: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
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
                y: 1
            },
            type: 'unit-human-bazooka',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapon: {
                selected: true,
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
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
                y: 18
            },
            type: 'unit-human-mg',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapon: {
                selected: true,
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
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
                y: 19
            },
            type: 'unit-human-bazooka',
            ammo: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapon: {
                selected: true,
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        }
    ]
}