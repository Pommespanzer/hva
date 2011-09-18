var MapView = Backbone.View.extend({
    el: $('body'),
    events: {
        'click .unit:not(.enemy)': 'selectUnit',
        'click #battlefield': 'battlefieldAction'
    },
    
    battlefield: null,
    
    initialize: function () {
        _.bindAll(
            this, 
            'addUnits', 
            'addObstacles', 
            'render', 
            'selectUnit', 
            'battlefieldAction',
            'removeUnitFromCollection'
        );
        
        this.unitCollection = new UnitCollection();
        
        this.unitCollection.bind(
            'change:destroyed', 
            this.removeUnitFromCollection
        );
        
        this.obstacleCollection = new ObstacleCollection();
        
        this.addUnits(LevelOne.units);
        this.addObstacles(LevelOne.obstacles);
        
        this.render();
    },
    
    addUnits: function (units) {
        var i;
        for (i in units) {
            var x = units[i].position.x;
            var y = units[i].position.y;

            var id = x + '_' + y;
            
            var unitModel = new UnitModel();
            unitModel.setId(id);
            unitModel.setPosition(x, y);
            unitModel.setType(units[i].type);
            unitModel.setArmor(units[i].armor);
            unitModel.setActionPoints(units[i].actionPoints);
            unitModel.isEnemy(units[i].isEnemy);
            unitModel.setSpeed(units[i].speed);
            unitModel.addWeapon(units[i].weapon);
            unitModel.setOrder(units[i].order);
            unitModel.setSounds(units[i].sounds);
            
            this.unitCollection.add(unitModel, {at: id});
        }
    },
    
    addObstacles: function (obstacles) {
        var i;
        for (i = 0; i < obstacles.length; i++) {
            var x = obstacles[i].x;
            var y = obstacles[i].y;

            var id = x + '_' + y;
            
            var obstacleModel = new ObstacleModel();
            obstacleModel.setId(id);
            obstacleModel.setPosition(x, y);
            
            this.obstacleCollection.add(obstacleModel, {at: id});
        }
    },
    
    selectUnit: function (event) {
        event.stopPropagation();
        var selectedUnitId = this.model.getSelectedUnitId();
        
        // unselect current selected unit
        if (selectedUnitId) {
            var selectedUnitModel = this.unitCollection.get(selectedUnitId);
            selectedUnitModel.unselect();
        }
        
        var id = event.target.id;
        this.model.setSelectedUnitId(id);
        
        var unitModel = this.unitCollection.get(id);
        unitModel.select();
    },
    
    battlefieldAction: function (event) {
        var selectedUnitId = this.model.getSelectedUnitId();
        // no selected unit found
        if (!selectedUnitId) {
            return;
        }
        
        var selectedUnitModel = this.unitCollection.get(selectedUnitId);
        
        // unit is busy -> quit
        if (selectedUnitModel.get('isBusy')) {
            return;
        }
        
        var clickedElement = $(event.target);
        
        // avoid moving over an obstacle
        if (clickedElement.hasClass('obstacle')) {
            return;
        }
        
        var startPosition = selectedUnitModel.getPosition();
        var goalPosition = Position.byCoordinates(event.clientX, event.clientY);
        
        // user wants to attack an enemy
        if (clickedElement.hasClass('enemy')) {
            var enemyModel = this.unitCollection.get(event.target.id);
            
            // enemy out of range? -> quit
            if (false === this.model.isEnemyInRange(selectedUnitModel, enemyModel)) {
                return false;
            }
            
            // check if unit has a free shot line
            if (false === this.model.isShootingPossible(this.obstacleCollection, startPosition, goalPosition)) {
                return false;   
            }
            
            selectedUnitModel.attack(enemyModel);
            return;
        }
        
        var wayPoints = this.model.getWayPoints(
            this.obstacleCollection,
            this.unitCollection,
            startPosition,
            goalPosition
        ); 
        
        // no path to clicked position
        if (!wayPoints) {
            return;
        }
        
        selectedUnitModel.move(wayPoints);
    },
    
    removeUnitFromCollection: function (unitModel) {
        if (unitModel.isSelected()) {
            this.model.setSelectedUnitId(null);
        }
        
        this.unitCollection.remove(unitModel);
    },
    
    render: function () {
        // render map
        this.el.append('<div id="battlefield"></div>');
        
        this.battlefield = $('#battlefield');
        
        // render units on the map
        for (var index in this.unitCollection.models) {
            var unitModel = this.unitCollection.models[index];
            
            var unitView = new UnitView({
                model: unitModel
            });
            
            this.battlefield.append(unitView.render().el);
        }
        
        // render obstacles on the map
        for (var index in this.obstacleCollection.models) {
            var obstacleModel = this.obstacleCollection.models[index];
            var obstacleView = new ObstacleView({
                model: obstacleModel
            });
            
            this.battlefield.append(obstacleView.render().el);
        }
    }
});


var LevelOne = {
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
/*
{
    position: {
        x: 1,
        y: 8
    },
    type: 'unit-human-mg',
    armor: 1000,
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
            x: 0,
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
*/          
            
            
            
            
            
        {
            position: {
                x: 6,
                y: 3
            },
            type: 'unit-human-mg',
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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
            armor: 1000,
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