var AiView = Backbone.View.extend({
    /**
     * All models of the enemies
     * 
     * @var array enemyModels
     */
    enemyModels : [],

    /**
     * All models of the computers units
     * 
     * @var array enemyModels
     */
    unitModels : [],

    /**
     * INIT
     */
    initialize: function () {
        console.log('**************');
        console.log('COMPUTERS TURN');
        console.log('**************');

        _.bind(this, 'nextUnit', 'doAction');

        var key, unitModel;
        for (key in mapView.unitCollection.models) {
            if (mapView.unitCollection.models.hasOwnProperty(key)) {
                unitModel = mapView.unitCollection.models[key];

                if (unitModel.get('isEnemy')) {
                    unitModel.setCurrentActionPoints(
                        unitModel.getTotalActionPoints()
                    );

                    this.unitModels.push(unitModel);
                    continue;
                }

                this.enemyModels.push(unitModel);
            }
        }

        this.nextUnit();
    },

    /**
     * This method resets the enemyModels array, because its possible that some
     * enemies died in the battle and the models had to be removed as well. 
     * With this method its possible to avoid unexpected doings.
     * 
     * @return void
     */
    resetEnemies: function () {
        this.enemyModels = [];

        var key, unitModel;
        for (key in mapView.unitCollection.models) {
            if (mapView.unitCollection.models.hasOwnProperty(key)) {
                unitModel = mapView.unitCollection.models[key];

                if (unitModel.get('isEnemy')) {
                    continue;
                }

                this.enemyModels.push(unitModel);
            }
        }
    },

    /**
     * This method dispatches whats happening next. That could be choosing a next
     * unit to search and attack enemies or to finish computers turn.
     * 
     * @return void
     */
    nextUnit: function () {
        if (this.unitModels.length === 0) {
            // collect enemies again because some could be dead allready
            this.resetEnemies();

            var i,
                selectedUnitId,
                selectedUnitModel;

            for (i in this.enemyModels) {
                if (this.enemyModels.hasOwnProperty(i)) {
                    this.enemyModels[i].setCurrentActionPoints(
                        this.enemyModels[i].getTotalActionPoints()
                    );
                }
            }
            selectedUnitId = mapView.model.getSelectedUnitId();
            if (selectedUnitId) {
                selectedUnitModel = mapView.unitCollection.get(selectedUnitId);
                actionPanelView.update(selectedUnitModel);
            }
            actionPanelView.showEndTurnLink();
            return;
        }

        console.log('-------------------------------------------------------');
        console.log('--------------------NEXT UNIT--------------------------');
        console.log('-------------------------------------------------------');

        var unitModel = this.unitModels.pop(),
            order = unitModel.get('order');

        // unit has no order, than search and destroy enemies
        if (!order) {
            // search and destroy
            this.nextUnit();
            return;
        }

        this.doAction(unitModel, order);
    },

    /**
     * This method is a wrapper to handel the moving and attacking event.
     * 
     * @param object unitModel - model of acting unit
     * @param object order - order of acting unit (protecting, attacking, ...)
     * @param array wayPoints - array of way point coordinates
     * @param object enemy - model of enemy
     * 
     * @retun void
     */
    _moveAndAttack: function (unitModel, order, wayPoints, enemy) {
        var _this = this;

        unitModel.unbind('movingFinished').bind('movingFinished', function () {
            unitModel.unbind('attackingFinished').bind('attackingFinished', function () {
                _this.doAction(unitModel, order);
            });

            unitModel.attack(enemy);
            // enemy attack as well
            enemy.attack(unitModel);
        });

        unitModel.move(wayPoints);
        return;
    },

    /**
     * This method is a wrapper to handel the moving event.
     * 
     * @param object unitModel - model of acting unit
     * @param object order - order of acting unit (protecting, attacking, ...)
     * @param array wayPoints - array of way point coordinates 
     * 
     * @retun void
     */
    _move: function (unitModel, order, wayPoints) {
        var _this = this;

        unitModel.unbind('movingFinished').bind('movingFinished', function () {
            _this.doAction(unitModel, order);
        });

        unitModel.move(wayPoints);
    },

    /**
     * This method is a wrapper to handel the attacking event.
     * 
     * @param object unitModel - model of acting unit
     * @param object order - order of acting unit (protecting, attacking, ...)
     * @param object enemy - model of enemy
     * 
     * @retun void
     */
    _attack: function (unitModel, order, enemy) {
        var _this = this;

        unitModel.unbind('attackingFinished').bind('attackingFinished', function () {
            _this.doAction(unitModel, order);
        });

        unitModel.attack(enemy);
        enemy.attack(unitModel);
    },

    /**
     * 
     * @param object unitModel - model of acting unit
     * @param object order - order of acting unit
     * @param array enemies - array of enemy models
     * @param string choose - {'weakest', 'closest', ...}
     *                        mode to decide from what list the unis select the enemy
     * @return void
     */
    _proceedDuty: function (unitModel, order, enemies, choose) {
        var index,
            choosenEnemy,
            choosenEnemyList,
            tmpEnemyModels = [],
            wayPointsHelper = {},
            wayPoints;

        // we need a "normal" array
        for (index in enemies) {
            if (enemies.hasOwnProperty(index)) {
                tmpEnemyModels.push(enemies[index].model);
                wayPointsHelper[enemies[index].model.get('id')] = enemies[index].wayPoints;
            }
        }

        if (choose === 'weakest') {
            // sort destroyable enemies by weakness
            choosenEnemyList = this.options.facade.getWeakestEnemies(tmpEnemyModels);
            // attack the strongest enemy
            choosenEnemy = choosenEnemyList.pop();
        } else if (choose === 'closest') {
            // get attackable enemies sorted by distance - ASC
            choosenEnemyList = this.options.facade.getClosestEnemies(unitModel, tmpEnemyModels);
            // attack the closest
            choosenEnemy = choosenEnemyList.shift();
        }

        wayPoints = wayPointsHelper[choosenEnemy.get('id')];

        // move and attack
        if (wayPoints.length > 0) {
            this._moveAndAttack(unitModel, order, wayPoints, choosenEnemy);
            return;
        }

        // direct attack
        this._attack(unitModel, order, choosenEnemy);
        return;
    },

    /**
     * This method decide what the unit has to do.
     * Actions are:
     * - move closer to enemy
     * - move back to position to protect
     * - attack enemy in fire range
     * - move and attack enemy
     * - do nothing if it is to risky to leave position
     * 
     * @param object unitModel - current model of acting unit
     * @param object order - all order details (protecting, attacking, ...)
     * 
     * @return void
     */
    doAction: function (unitModel, order) {
        this.resetEnemies();

        // unit is out of action points
        if (unitModel.getCurrentActionPoints() === 0 || unitModel.getCurrentArmor() <= 0) {
            this.nextUnit();
            return;
        }

        var destroyableEnemies = this.options.facade.getDestroyableEnemies(unitModel, this.enemyModels),
            unitPosition = unitModel.getPosition(),
            attackableEnemies,
            wayPoints;

        // unit is able to destroy enemies
        if (destroyableEnemies.length > 0) {
            this._proceedDuty(unitModel, order, destroyableEnemies, 'weakest');
            return;
        }

        // collect all attackable enemies
        attackableEnemies = this.options.facade.getAttackableEnemies(unitModel, this.enemyModels);

        // unit is able to attack enemies
        if (attackableEnemies.length > 0) {
            this._proceedDuty(unitModel, order, attackableEnemies, 'closest');
            return;
        }

        // the order is to protect position
        if (order.action === 'protect') {
            // do nothing if no enemy is available to attack and unit is in protected position
            if (true === this.options.facade.inPosition(unitPosition, order.positionToProtect, order.protectionRange)) {
                this.nextUnit();
                return;
            }

            // move back to the position the unit has to protect
            wayPoints = mapView.model.getWayPoints(
                mapView.obstacleCollection,
                mapView.unitCollection,
                unitPosition,
                order.positionToProtect
            );

            // if no way points are found -> switch to other unit
            if (!wayPoints || wayPoints.length === 0) {
                this.nextUnit();
                return;
            }

            this._move(unitModel, order, wayPoints);
            return;
        }

        this.nextUnit();
        return;
    }
});