var MapView = Backbone.View.extend({
    /**
     * Object where to bind the map.
     */
    el: $('body'),

    /**
     * All binded map events.
     */
    events: {
        'click .unit:not(.enemy)': 'selectUnit',
        'click #battlefield': 'battlefieldAction'
    },

    /**
     * Object of the map.
     *
     * @var object
     */
    battlefield: null,

    /**
     * contains all unit models
     */
    unitCollection: null,

    /**
     * contains all obstacle models
     */
    obstacleCollection: null,

    /**
     * Block the events if the computer does its turn
     */
    blockEvents: false,

    /**
     * INIT
     *
     * @return void
     */
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
    },

    /**
     * This method adds all units to the map.
     *
     * @param array units - array of all units
     *
     * @return void
     */
    addUnits: function (units) {
        var i,
            x,
            y,
            id,
            unitModel;

        for (i in units) {
            if (units.hasOwnProperty(i)) {
                x = units[i].position.x;
                y = units[i].position.y;
                id = x + '_' + y;

                unitModel = new UnitModel();
                unitModel.setId(id);
                unitModel.setPosition(x, y);
                unitModel.setType(units[i].type);
                unitModel.setArmor(units[i].armor);
                unitModel.setActionPoints(units[i].actionPoints);
                unitModel.isEnemy(units[i].isEnemy);
                unitModel.setSpeed(units[i].speed);
                unitModel.setWeapons(units[i].weapons);
                unitModel.setOrder(units[i].order);
                unitModel.setSounds(units[i].sounds);
                unitModel.setBackgroundPosition(-100, 0);

                this.unitCollection.add(unitModel, {at: id});
            }
        }
    },

    /**
     * This method adds all obstacles to the map.
     *
     * @param array obstacles - array of all obstacles
     *
     * @return void
     */
    addObstacles: function (obstacles) {
        var i,
            x,
            y,
            id,
            obstacleModel;

        for (i = 0; i < obstacles.length; i += 1) {
            x = obstacles[i].x;
            y = obstacles[i].y;
            id = x + '_' + y;

            obstacleModel = new ObstacleModel();
            obstacleModel.setId(id);
            obstacleModel.setPosition(x, y);

            this.obstacleCollection.add(obstacleModel, {at: id});
        }
    },

    /**
     * This method is called if an user clicked an unit.
     * It marks the unit as selected and updates the action panel.
     *
     * @param event
     *
     * @return void
     */
    selectUnit: function (event) {
console.log('+++ user clicked on an unit +++');
        event.stopPropagation();
        var selectedUnitId = this.model.getSelectedUnitId(),
            selectedUnitModel,
            unitModel,
            id;

        // unselect current selected unit
        if (selectedUnitId) {
console.log('OK. Deselect current selected unit');
            selectedUnitModel = this.unitCollection.get(selectedUnitId);
            selectedUnitModel.unselect();
        }
console.log('OK. Select unit');
        id = event.target.id;
        this.model.setSelectedUnitId(id);

        unitModel = this.unitCollection.get(id);
        unitModel.select();
    },

    /**
     * This method dispatches all events on the map.
     * Events could be - click an unit - move an unit - attack an enemy - ...
     *
     * @param event
     *
     * @return void
     */
    battlefieldAction: function (event) {
console.log('+++ user clicked on battlefield +++');
        // block until computers turn is over
        if (true === this.blockEvents) {
console.log('FAIL. Events are blocked');
            return;
        }
console.log('OK. Events are not blocked');
        var selectedUnitId = this.model.getSelectedUnitId(),
            selectedUnitModel,
            clickedElement,
            startPosition,
            goalPosition,
            enemyModel,
            wayPoints;

        // no selected unit found
        if (!selectedUnitId) {
console.log('FAIL. No selected unit found');
            return;
        }
console.log('OK. Found selected unit');
        selectedUnitModel = this.unitCollection.get(selectedUnitId);

        // unit is busy -> quit
        if (selectedUnitModel.get('isBusy')) {
console.log('FAIL. Selected unit is busy');
            return;
        }
console.log('OK. Selected unit is not busy');
        clickedElement = $(event.target);

        // avoid moving over an obstacle
        if (clickedElement.hasClass('obstacle')) {
console.log('FAIL. User clicked on an obstacle');
            return;
        }
console.log('OK. User does not clicked on an obstacle');
        startPosition = selectedUnitModel.getPosition();
        goalPosition = Position.byCoordinates(event.clientX, event.clientY);

        // user wants to attack an enemy
        if (clickedElement.hasClass('enemy')) {
console.log('OK. User click on an enemy to attack them');
            enemyModel = this.unitCollection.get(event.target.id);

            // enemy out of range? -> quit
            if (false === this.model.isEnemyInRange(selectedUnitModel, enemyModel)) {
console.log('FAIL. Enemy is to far away');
                return false;
            }

            // check if unit has a free shot line
            if (false === this.model.isShootingPossible(this.obstacleCollection, startPosition, goalPosition)) {
console.log('FAIL. Something is in the way');
                return false;
            }

            selectedUnitModel.attack(enemyModel);
            // enemy will protect them self
            enemyModel.attack(selectedUnitModel);
console.log('OK. Attack enemy.');
            return;
        }
console.log('OK. User wants to move the unit');
        wayPoints = this.model.getWayPoints(
            this.obstacleCollection,
            this.unitCollection,
            startPosition,
            goalPosition
        );

        // no path to clicked position
        if (!wayPoints) {
console.log('FAIL. No way points to clicked position');
            return;
        }

        selectedUnitModel.move(wayPoints);
    },

    /**
     * This method removes an unit model from collection. That happens if
     * an unit is destroyed.
     *
     * @param object unitModel - model of (i.e. destroyed) unit
     *
     * @return void
     */
    removeUnitFromCollection: function (unitModel) {
        if (unitModel.isSelected()) {
            this.model.setSelectedUnitId(null);
        }

        this.unitCollection.remove(unitModel);
    },

    /**
     * This method renders the map and all containing elements (units, obstacles , ...)
     *
     * @return void
     */
    render: function () {
        // render map
        this.el.append('<div id="battlefield"></div>');

        this.battlefield = $('#battlefield');

        var index,
            unitModel,
            unitView,
            obstacleModel,
            obstacleView;

        // render units on the map
        for (index in this.unitCollection.models) {
            if (this.unitCollection.models.hasOwnProperty(index)) {
                unitModel = this.unitCollection.models[index];

                unitView = new UnitView({
                    model: unitModel
                });

                this.battlefield.append(unitView.render().el);
            }
        }

        // render obstacles on the map
        for (index in this.obstacleCollection.models) {
            if (this.obstacleCollection.models.hasOwnProperty(index)) {
                obstacleModel = this.obstacleCollection.models[index];
                obstacleView = new ObstacleView({
                    model: obstacleModel
                });

                this.battlefield.append(obstacleView.render().el);
            }
        }
    }
});

var LevelOne = {
    obstacles: [
{y: 0,x:8},
{y: 0,x:9},
{y: 0,x: 10},
{y: 0,x: 11},
{y: 0,x: 12},
{y: 0,x: 33},
{y: 0,x: 34},
{y: 0,x: 35},
{y: 0,x: 36},
{y: 0,x: 37},
{y: 0,x: 38},
{y: 0,x: 39},
{y: 1,x: 8},
{y: 1,x: 9},
{y: 1,x: 10},
{y: 1,x: 11},
{y: 1,x: 12},
{y: 1,x: 18},
{y: 1,x: 30},
{y: 1,x: 31},
{y: 1,x: 32},
{y: 1,x: 33},
{y: 1,x: 34},
{y: 1,x: 35},
{y: 1,x: 36},
{y: 1,x: 37},
{y: 1,x: 38},
{y: 1,x: 39},
{y: 2,x: 8},
{y: 2,x: 9},
{y: 2,x: 10},
{y: 2,x: 11},
{y: 2,x: 12},
{y: 2,x: 13},
{y: 2,x: 14},
{y: 2,x: 17},
{y: 2,x: 18},
{y: 2,x: 19},
{y: 2,x: 20},
{y: 2,x: 21},
{y: 2,x: 30},
{y: 2,x: 31},
{y: 2,x: 32},
{y: 2,x: 33},
{y: 2,x: 34},
{y: 2,x: 35},
{y: 2,x: 36},
{y: 2,x: 37},
{y: 2,x: 38},
{y: 2,x: 39},
{y: 3,x: 0},
{y: 3,x: 3},
{y: 3,x: 4},
{y: 3,x: 5},
{y: 3,x: 6},
{y: 3,x: 7},
{y: 3,x: 8},
{y: 3,x: 9},
{y: 3,x: 10},
{y: 3,x: 11},
{y: 3,x: 12},
{y: 3,x: 13},
{y: 3,x: 14},
{y: 3,x: 17},
{y: 3,x: 18},
{y: 3,x: 19},
{y: 3,x: 20},
{y: 3,x: 21},
{y: 3,x: 23},
{y: 3,x: 24},
{y: 3,x: 27},
{y: 3,x: 28},
{y: 3,x: 29},
{y: 3,x: 30},
{y: 3,x: 31},
{y: 3,x: 32},
{y: 3,x: 33},
{y: 3,x: 34},
{y: 3,x: 35},
{y: 3,x: 36},
{y: 3,x: 37},
{y: 3,x: 38},
{y: 3,x: 39},
{y: 4,x: 0},
{y: 4,x: 8},
{y: 4,x: 9},
{y: 4,x: 10},
{y: 4,x: 11},
{y: 4,x: 12},
{y: 4,x: 13},
{y: 4,x: 14},
{y: 4,x: 17},
{y: 4,x: 18},
{y: 4,x: 19},
{y: 4,x: 20},
{y: 4,x: 23},
{y: 4,x: 24},
{y: 4,x: 27},
{y: 4,x: 28},
{y: 4,x: 29},
{y: 4,x: 30},
{y: 4,x: 31},
{y: 4,x: 32},
{y: 4,x: 33},
{y: 4,x: 34},
{y: 4,x: 35},
{y: 4,x: 36},
{y: 4,x: 37},
{y: 4,x: 38},
{y: 4,x: 39},
{y: 5,x: 0},
{y: 5,x: 1},
{y: 5,x: 2},
{y: 5,x: 3},
{y: 5,x: 8},
{y: 5,x: 9},
{y: 5,x: 10},
{y: 5,x: 11},
{y: 5,x: 13},
{y: 5,x: 14},
{y: 5,x: 17},
{y: 5,x: 18},
{y: 5,x: 19},
{y: 5,x: 20},
{y: 5,x: 21},
{y: 5,x: 28},
{y: 5,x: 29},
{y: 5,x: 30},
{y: 5,x: 31},
{y: 5,x: 32},
{y: 5,x: 33},
{y: 5,x: 34},
{y: 5,x: 35},
{y: 5,x: 36},
{y: 5,x: 37},
{y: 5,x: 38},
{y: 5,x: 39},
{y: 6,x: 0},
{y: 6,x: 1},
{y: 6,x: 2},
{y: 6,x: 3},
{y: 6,x: 4},
{y: 6,x: 5},
{y: 6,x: 6},
{y: 6,x: 17},
{y: 6,x: 18},
{y: 6,x: 19},
{y: 6,x: 20},
{y: 6,x: 21},
{y: 6,x: 30},
{y: 6,x: 31},
{y: 6,x: 32},
{y: 6,x: 33},
{y: 6,x: 34},
{y: 6,x: 35},
{y: 6,x: 36},
{y: 6,x: 37},
{y: 6,x: 38},
{y: 6,x: 39},
{y: 7,x: 0},
{y: 7,x: 1},
{y: 7,x: 2},
{y: 7,x: 3},
{y: 7,x: 4},
{y: 7,x: 5},
{y: 7,x: 6},
{y: 7,x: 9},
{y: 7,x: 11},
{y: 7,x: 12},
{y: 7,x: 13},
{y: 7,x: 14},
{y: 7,x: 15},
{y: 7,x: 16},
{y: 7,x: 17},
{y: 7,x: 18},
{y: 7,x: 19},
{y: 7,x: 20},
{y: 7,x: 21},
{y: 7,x: 34},
{y: 7,x: 35},
{y: 7,x: 36},
{y: 7,x: 37},
{y: 7,x: 38},
{y: 7,x: 39},
{y: 8,x: 0},
{y: 8,x: 1},
{y: 8,x: 2},
{y: 8,x: 3},
{y: 8,x: 4},
{y: 8,x: 5},
{y: 8,x: 9},
{y: 8,x: 10},
{y: 8,x: 11},
{y: 8,x: 12},
{y: 8,x: 13},
{y: 8,x: 14},
{y: 8,x: 15},
{y: 8,x: 16},
{y: 8,x: 17},
{y: 8,x: 28},
{y: 8,x: 29},
{y: 8,x: 34},
{y: 8,x: 35},
{y: 8,x: 36},
{y: 8,x: 37},
{y: 8,x: 38},
{y: 8,x: 39},
{y: 9,x: 0},
{y: 9,x: 1},
{y: 9,x: 2},
{y: 9,x: 3},
{y: 9,x: 4},
{y: 9,x: 5},
{y: 9,x: 6},
{y: 9,x: 9},
{y: 9,x: 10},
{y: 9,x: 11},
{y: 9,x: 12},
{y: 9,x: 13},
{y: 9,x: 14},
{y: 9,x: 15},
{y: 9,x: 16},
{y: 9,x: 17},
{y: 9,x: 28},
{y: 9,x: 29},
{y: 9,x: 37},
{y: 9,x: 38},
{y: 9,x: 39},
{y: 10,x: 0},
{y: 10,x: 1},
{y: 10,x: 2},
{y: 10,x: 3},
{y: 10,x: 4},
{y: 10,x: 5},
{y: 10,x: 9},
{y: 10,x: 10},
{y: 10,x: 11},
{y: 10,x: 12},
{y: 10,x: 13},
{y: 10,x: 14},
{y: 10,x: 15},
{y: 10,x: 16},
{y: 10,x: 17},
{y: 10,x: 21},
{y: 10,x: 22},
{y: 10,x: 23},
{y: 10,x: 33},
{y: 10,x: 34},
{y: 10,x: 37},
{y: 10,x: 38},
{y: 10,x: 39},
{y: 11,x: 0},
{y: 11,x: 1},
{y: 11,x: 2},
{y: 11,x: 3},
{y: 11,x: 7},
{y: 11,x: 8},
{y: 11,x: 9},
{y: 11,x: 10},
{y: 11,x: 11},
{y: 11,x: 13},
{y: 11,x: 14},
{y: 11,x: 15},
{y: 11,x: 17},
{y: 11,x: 21},
{y: 11,x: 22},
{y: 11,x: 23},
{y: 11,x: 33},
{y: 11,x: 34},
{y: 12,x: 0},
{y: 12,x: 1},
{y: 12,x: 2},
{y: 12,x: 3},
{y: 12,x: 21},
{y: 12,x: 22},
{y: 12,x: 23},
{y: 12,x: 24},
{y: 12,x: 25},
{y: 12,x: 33},
{y: 12,x: 34},
{y: 13,x: 0},
{y: 13,x: 1},
{y: 13,x: 2},
{y: 13,x: 3},
{y: 13,x: 4},
{y: 13,x: 5},
{y: 13,x: 6},
{y: 13,x: 9},
{y: 13,x: 10},
{y: 13,x: 11},
{y: 13,x: 12},
{y: 13,x: 13},
{y: 13,x: 14},
{y: 13,x: 15},
{y: 13,x: 16},
{y: 13,x: 17},
{y: 13,x: 18},
{y: 13,x: 19},
{y: 13,x: 20},
{y: 13,x: 21},
{y: 13,x: 22},
{y: 13,x: 23},
{y: 13,x: 24},
{y: 13,x: 25},
{y: 13,x: 26},
{y: 13,x: 27},
{y: 13,x: 30},
{y: 13,x: 31},
{y: 13,x: 32},
{y: 13,x: 33},
{y: 14,x: 0},
{y: 14,x: 1},
{y: 14,x: 2},
{y: 14,x: 3},
{y: 14,x: 4},
{y: 14,x: 5},
{y: 14,x: 6},
{y: 14,x: 19},
{y: 14,x: 20},
{y: 14,x: 21},
{y: 14,x: 22},
{y: 14,x: 23},
{y: 14,x: 24},
{y: 14,x: 25},
{y: 14,x: 26},
{y: 14,x: 27},
{y: 14,x: 30},
{y: 14,x: 31},
{y: 14,x: 32},
{y: 14,x: 36},
{y: 14,x: 37},
{y: 14,x: 38},
{y: 14,x: 39},
{y: 15,x: 0},
{y: 15,x: 1},
{y: 15,x: 2},
{y: 15,x: 3},
{y: 15,x: 4},
{y: 15,x: 5},
{y: 15,x: 6},
{y: 15,x: 7},
{y: 15,x: 10},
{y: 15,x: 11},
{y: 15,x: 17},
{y: 15,x: 18},
{y: 15,x: 19},
{y: 15,x: 20},
{y: 15,x: 21},
{y: 15,x: 22},
{y: 15,x: 23},
{y: 15,x: 24},
{y: 15,x: 25},
{y: 15,x: 26},
{y: 15,x: 27},
{y: 15,x: 30},
{y: 15,x: 31},
{y: 16,x: 0},
{y: 16,x: 1},
{y: 16,x: 2},
{y: 16,x: 3},
{y: 16,x: 4},
{y: 16,x: 5},
{y: 16,x: 6},
{y: 16,x: 7},
{y: 16,x: 10},
{y: 16,x: 11},
{y: 16,x: 12},
{y: 16,x: 13},
{y: 16,x: 17},
{y: 16,x: 18},
{y: 16,x: 19},
{y: 16,x: 20},
{y: 16,x: 21},
{y: 16,x: 27},
{y: 16,x: 30},
{y: 16,x: 31},
{y: 17,x: 0},
{y: 17,x: 1},
{y: 17,x: 2},
{y: 17,x: 3},
{y: 17,x: 4},
{y: 17,x: 5},
{y: 17,x: 6},
{y: 17,x: 7},
{y: 17,x: 10},
{y: 17,x: 11},
{y: 17,x: 12},
{y: 17,x: 13},
{y: 17,x: 14},
{y: 17,x: 17},
{y: 17,x: 18},
{y: 17,x: 19},
{y: 17,x: 20},
{y: 17,x: 21},
{y: 17,x: 22},
{y: 17,x: 27},
{y: 17,x: 30},
{y: 17,x: 31},
{y: 17,x: 32},
{y: 17,x: 33},
{y: 17,x: 36},
{y: 17,x: 37},
{y: 18,x: 3},
{y: 18,x: 4},
{y: 18,x: 5},
{y: 18,x: 6},
{y: 18,x: 7},
{y: 18,x: 10},
{y: 18,x: 11},
{y: 18,x: 12},
{y: 18,x: 13},
{y: 18,x: 14},
{y: 18,x: 19},
{y: 18,x: 20},
{y: 18,x: 21},
{y: 18,x: 22},
{y: 18,x: 26},
{y: 18,x: 27},
{y: 18,x: 30},
{y: 18,x: 31},
{y: 18,x: 32},
{y: 18,x: 33},
{y: 18,x: 36},
{y: 18,x: 37},
{y: 19,x: 3},
{y: 19,x: 4},
{y: 19,x: 5},
{y: 19,x: 6},
{y: 19,x: 7},
{y: 19,x: 11},
{y: 19,x: 12},
{y: 19,x: 13},
{y: 19,x: 14},
{y: 19,x: 30},
{y: 19,x: 31},
{y: 19,x: 32},
{y: 19,x: 36},
{y: 19,x: 37},
{y: 20,x: 3},
{y: 20,x: 4},
{y: 20,x: 6},
{y: 20,x: 7},
{y: 20,x: 10},
{y: 20,x: 11},
{y: 20,x: 12},
{y: 20,x: 13},
{y: 20,x: 14},
{y: 20,x: 15},
{y: 20,x: 16},
{y: 20,x: 17},
{y: 20,x: 18},
{y: 20,x: 19},
{y: 20,x: 31},
{y: 20,x: 32},
{y: 20,x: 33},
{y: 20,x: 36},
{y: 20,x: 37},
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
{y: 21,x: 21},
{y: 21,x: 22},
{y: 21,x: 23},
{y: 21,x: 26},
{y: 21,x: 27},
{y: 21,x: 28},
{y: 21,x: 29},
{y: 21,x: 30},
{y: 21,x: 31},
{y: 21,x: 32},
{y: 21,x: 33},
{y: 21,x: 37},
{y: 21,x: 38},
{y: 21,x: 39},
{y: 22,x: 3},
{y: 22,x: 4},
{y: 22,x: 5},
{y: 22,x: 6},
{y: 22,x: 7},
{y: 22,x: 8},
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
{y: 22,x: 26},
{y: 22,x: 27},
{y: 22,x: 28},
{y: 22,x: 29},
{y: 22,x: 30},
{y: 22,x: 36},
{y: 22,x: 37},
{y: 22,x: 38},
{y: 22,x: 39},
{y: 23,x: 0},
{y: 23,x: 2},
{y: 23,x: 3},
{y: 23,x: 4},
{y: 23,x: 5},
{y: 23,x: 6},
{y: 23,x: 7},
{y: 23,x: 8},
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
{y: 23,x: 26},
{y: 23,x: 27},
{y: 23,x: 28},
{y: 23,x: 29},
{y: 23,x: 30},
{y: 23,x: 36},
{y: 23,x: 37},
{y: 23,x: 38},
{y: 23,x: 39},
{y: 24,x: 0},
{y: 24,x: 1},
{y: 24,x: 2},
{y: 24,x: 3},
{y: 24,x: 4},
{y: 24,x: 5},
{y: 24,x: 6},
{y: 24,x: 7},
{y: 24,x: 8},
{y: 24,x: 9},
{y: 24,x: 10},
{y: 24,x: 11},
{y: 24,x: 12},
{y: 24,x: 13},
{y: 24,x: 14},
{y: 24,x: 15},
{y: 24,x: 16},
{y: 24,x: 17},
{y: 24,x: 18},
{y: 24,x: 19},
{y: 24,x: 20},
{y: 24,x: 21},
{y: 24,x: 22},
{y: 24,x: 23},
{y: 24,x: 24},
{y: 24,x: 25},
{y: 24,x: 26},
{y: 24,x: 27},
{y: 24,x: 28},
{y: 24,x: 29},
{y: 24,x: 30},
{y: 24,x: 36},
{y: 24,x: 37},
{y: 24,x: 38},
{y: 24,x: 39}
],
    units: [
        {
            position: {
                x: 29,
                y: 2
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
                x: 29,
                y: 6
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
                x: 30,
                y: 20
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
                x: 26,
                y: 16
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
                x: 36,
                y: 9
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
                x: 18,
                y: 8
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
        {
            position: {
                x: 39,
                y: 15
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: true,
            speed: 200,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            }],
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
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
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
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 6,
                y: 0
            },
            type: 'unit-human-bazooka',
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 7,
                y: 0
            },
            type: 'unit-human-bazooka',
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 10,
                y: 19
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        },
        {
            position: {
                x: 5,
                y: 20
            },
            type: 'unit-human-mg',
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'mg',
                range: 5,
                actionPoints: 2,
                firepower: 100,
                firespeed: 200
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
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
            type: 'unit-human-bazooka',
            armor: 1000,
            actionPoints: 15,
            isEnemy: false,
            speed: 500,
            weapons: [{
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
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
            weapons: [{
                name: 'bazooka',
                range: 7,
                actionPoints: 5,
                firepower: 400,
                firespeed: 300
            },
            {
                name: 'p9',
                range: 3,
                actionPoints: 1,
                firepower: 70,
                firespeed: 150
            }],
            order: null,
            sounds: {
                move: 'audio/unit/soldierMG/move.wav',
                attack: 'audio/unit/soldierMG/attack.wav',
                die: 'audio/unit/soldierMG/die.wav'
            }
        }
    ]
};
