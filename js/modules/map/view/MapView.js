'use strict';
var MapView = Backbone.View.extend({
    /**
     * Object where to bind the map.
     */
    el: $('body'),

    /**
     * All binded map events.
     */
    events: {
        'click #battlefield': 'dispatchClickEvent',
        'mousemove #battlefield:': 'dispatchMouseMoveEvent',
        'addInventoryItem': 'addInventoryItem'
    },

    /**
     * Object of the map.
     *
     * @var object
     */
    map: null,

    /**
     * contains all unit models
     */
    unitCollection: null,

    /**
     * contains all obstacle models
     */
    obstacleCollection: null,

    /**
     * contains all inventory item models
     */
    inventoryCollection: null,

    // todo: remove me later
    blockEvents: false,

    /**
     * INIT
     *
     * @return void
     */
    initialize: function () {
        _.bindAll(
            this,
            'dispatchClickEvent',
            'addUnits',
            'addObstacles',
            'addInventoryItem',
            'removeUnit',
            'removeInventoryItem',
            'selectUnitAction',
            'moveUnitAction',
            'attackEnemyAction',
            'dispatchMouseMoveEvent',
            'addMovingPath',
            'removeMovingPath',
            'render'
        );

        this.unitCollection = new UnitCollection();
        this.unitCollection.bind('change:remove', this.removeUnit);

        this.obstacleCollection = new ObstacleCollection();

        this.inventoryCollection = new InventoryCollection();
        this.inventoryCollection.bind('change:remove', this.removeInventoryItem);
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

                this.unitCollection.add(unitModel);
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

            this.obstacleCollection.add(obstacleModel);
        }
    },

    /**
     * This method removes an unit from the unit collection.
     * It happens if an unit dies on the battlefield.
     *
     * @param UnitModel unitModel
     *
     * @return void
     */
    removeUnit: function (unitModel) {
        if (unitModel.isSelected()) {
            this.model.setSelectedUnitId(null);
        }

        this.unitCollection.remove(unitModel, 'silent');
    },

    /**
     * This method adds an inventory item to the inventory collection.
     * It happens if an unit (not every unit) get killed an looses an
     * item on the map.
     *
     * @param object event
     * @param InventoryItemModel inventoryItemModel
     *
     * @return void
     */
    addInventoryItem: function (event, inventoryItemModel) {
        this.inventoryCollection.add(inventoryItemModel);
    },

    /**
     * This method removes an inventory item from the inventory collection.
     * It happens if an unit collects an item.
     *
     * @param InventoryItemModel inventoryItemModel
     *
     * @return void
     */
    removeInventoryItem: function (inventoryItemModel) {
        this.inventoryCollection.remove(inventoryItemModel, 'silent');
    },

    /**
     * This method dispatches the click event on the map.
     * It analyses the element which the user clicked and decide what action
     * has to be done.
     *
     * @param object event
     *
     * @return void
     */
    dispatchClickEvent: function (event) {
        // todo: remove from this class!!!
        // block until computers turn is over
        if (true === this.blockEvents) {
            return;
        }

        var targetObject = $(event.target),
            selectedUnitId = this.model.getSelectedUnitId();

        // select obstacle
        if (targetObject.hasClass('obstacle')) {
            console.info('Selecting an obstacle is not implemented yet.');
            // this.selectObstacleAction();
            return;
        }

        // attack enemy
        if (targetObject.hasClass('enemy') && selectedUnitId) {
            this.attackEnemyAction(selectedUnitId, targetObject[0].id);
            return;
        }

        // select unit
        if (targetObject.hasClass('unit') && false === targetObject.hasClass('enemy')) {
            this.selectUnitAction(targetObject[0].id);
            return;
        }

        // select enemy
        if (targetObject.hasClass('unit') && targetObject.hasClass('enemy')) {
            console.info('Selecting an enemy is not implemented yet.');
            //this.selectEnemyAction();
            return;
        }

        // move unit
        if (selectedUnitId) {
            this.moveUnitAction(event.clientX, event.clientY);
            return;
        }
    },

    /**
     * This method is called if an user clicked an unit.
     * It marks the clicked unit as selected.
     *
     * @param integer clickedUnitId
     *
     * @return void
     */
    selectUnitAction: function (clickedUnitId) {
        var currentSelectedUnitId = this.model.getSelectedUnitId(),
            currentSelectedUnitModel,
            clickedUnitModel;

        // clicked unit is the same as the current selected unit -> exit;
        if (currentSelectedUnitId && (currentSelectedUnitId === clickedUnitId)) {
            return;
        }

        // unselect current selected unit
        if (currentSelectedUnitId) {
            currentSelectedUnitModel = this.unitCollection.get(currentSelectedUnitId);
            currentSelectedUnitModel.unselect();
        }

        // publish the new selected unit to the map
        this.model.setSelectedUnitId(clickedUnitId);

        // mark clicked unit as selected
        clickedUnitModel = this.unitCollection.get(clickedUnitId);
        clickedUnitModel.select();
    },

    /**
     * This method is called if an unit is selected and the user clicked
     * somewhere on the map to move this selected unit to this position.
     *
     * @param integer coordX - current mouse position (X) on map
     * @param integer coordY - current mouse position (Y) on map
     *
     * @return void
     */
    moveUnitAction: function (coordX, coordY) {
        var currentSelectedUnitId = this.model.getSelectedUnitId(),
            currentSelectedUnitModel = this.unitCollection.get(currentSelectedUnitId),
            currentPosition = currentSelectedUnitModel.getPosition(),
            goalPosition = Position.byCoordinates(coordX, coordY),
            wayPoints;

        if (currentSelectedUnitModel.get('isBusy')) {
            return;
        }

        wayPoints = this.model.getWayPoints(
            this.obstacleCollection,
            this.unitCollection,
            currentPosition,
            goalPosition
        );

        // no path to clicked position
        if (!wayPoints) {
            return;
        }

        currentSelectedUnitModel.move(wayPoints);
    },

    /**
     * This method is called if the user has a selected unit an
     * clicked on an enemy to attack them. It starts the battle.
     *
     * @param integer selectedUnitId
     * @param integer enemyId
     *
     * @return void
     */
    attackEnemyAction: function (selectedUnitId, enemyId) {
        var selectedUnitModel = this.unitCollection.get(selectedUnitId),
            enemyModel = this.unitCollection.get(enemyId);

        if (selectedUnitModel.get('isBusy')) {
            return;
        }

        selectedUnitModel.attack(enemyModel);

        // enemy will protect them self
        enemyModel.attack(selectedUnitModel);
    },

    /**
     * This method dispatches the mouse move event.
     * It decides if an existing moving path of the unit has to be removed
     * or a new one has to be added.
     *
     * @param object event
     *
     * @retun void
     */
    dispatchMouseMoveEvent: function (event) {
        var currentSelectedUnitId = this.model.getSelectedUnitId(),
            currentSelectedUnitModel,
            hoveredElement,
            currentPosition,
            goalPosition;

        // no selected unit -> no way -> exit
        if (!currentSelectedUnitId) {
            this.model.setGoalMovingPath(null);
            this.removeMovingPath();
            return;
        }

        currentSelectedUnitModel = this.unitCollection.get(currentSelectedUnitId);

        if (currentSelectedUnitModel.get('isBusy')) {
            this.model.setGoalMovingPath(null);
            this.removeMovingPath();
            return;
        }

        hoveredElement = $(event.target);

        // no free position on battefield -> exit
        if (hoveredElement.hasClass('obstacle') || hoveredElement.hasClass('unit')) {
            this.model.setGoalMovingPath(null);
            this.removeMovingPath();
            return;
        }

        currentPosition = currentSelectedUnitModel.getPosition();
        goalPosition = Position.byCoordinates(event.clientX, event.clientY);

        if (currentPosition.x === goalPosition.x && currentPosition.y === goalPosition.y) {
            return;
        }

        // goal position is same like previous one -> exit
        if (this.model.get('goalMovingPath') === goalPosition) {
            return;
        }

        this.model.setGoalMovingPath(goalPosition);

        this.removeMovingPath();
        this.addMovingPath(currentPosition, goalPosition, currentSelectedUnitModel.get('currentActionPoints'));
    },

    /**
     * This method adds the moving path on the map to show the way the
     * unit wants move.
     *
     * @param object currentPosition - current position of selected unit {x: ?, y: ?}
     * @param object goalPosition - position where the units wants to move {x: ?, y: ?}
     * @param integer currentActionPoints - to restrict the moving path to max action points of the unit
     *
     * @return void
     */
    addMovingPath: function (currentPosition, goalPosition, currentActionPoints) {
        var html = [],
            count = 0,
            wayPoints,
            currentWayPoint,
            index;

        wayPoints = this.model.getWayPoints(
            this.obstacleCollection,
            this.unitCollection,
            currentPosition,
            goalPosition
        );

        // no way point -> exit
        if (!wayPoints) {
            return;
        }

        html.push('<div class="js-moving-path moving-path" style="left: ' + (currentPosition.x * 50) + 'px; top: ' + (currentPosition.y * 50) + 'px;"></div>');
        for (index in wayPoints) {
            if (wayPoints.hasOwnProperty(index)) {
                if (count === currentActionPoints) {
                    break;
                }
                currentWayPoint = wayPoints[index];
                html.push('<div class="js-moving-path moving-path" style="left: ' + (currentWayPoint.row * 50) + 'px; top: ' + (currentWayPoint.col * 50) + 'px;"></div>');

                count += 1;
            }
        }

        this.map.append(html.join(''));
    },

    /**
     * This method removes the rendered way of the unit.
     * It happens if a new way point is set or an other unit is clicked, ...
     *
     * @return void
     */
    removeMovingPath: function () {
        var movingPathObjs = $('.js-moving-path', this.map);

        if (movingPathObjs.length > 0) {
            movingPathObjs.remove();
        }
    },

    /**
     * This method renders the map and all containing elements (units, obstacles , ...)
     *
     * @return void
     */
    render: function () {
        // render map
        this.el.append('<div id="battlefield"></div>');

        this.map = $('#battlefield');

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

                this.map.append(unitView.render().el);
            }
        }

        // render obstacles on the map
        for (index in this.obstacleCollection.models) {
            if (this.obstacleCollection.models.hasOwnProperty(index)) {
                obstacleModel = this.obstacleCollection.models[index];
                obstacleView = new ObstacleView({
                    model: obstacleModel
                });

                this.map.append(obstacleView.render().el);
            }
        }
    }
});
