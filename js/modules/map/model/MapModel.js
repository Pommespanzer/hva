var MapModel = Backbone.Model.extend({
    /**
     * Set the id of current selected unit.
     *
     * @param integer unitModelId - id of current selected unit
     *
     * @return void
     */
    setSelectedUnitId: function (unitModelId) {
        this.set({selectedUnitId: unitModelId});
    },

    /**
     * Get the id of the current selected unit.
     *
     * @return integer selectedUnitId
     */
    getSelectedUnitId: function () {
        return this.get('selectedUnitId');
    },

    /**
     * Checks if an enemy is in range to attack.
     *
     *  @param object unit - UnitModel
     *  @param object enemy - UnitModel
     *
     *  @return bool - true if enemy is in range
     *               - false if enemy is not in range
     */
    isEnemyInRange: function (unit, enemy) {
        var position = unit.getPosition(),
            enemyPosition = enemy.getPosition(),
            selectedWeapon = unit.get('selectedWeapon'),
            range = selectedWeapon.model.get('range'),
            rangeRight = position.x + range;
            rangeLeft  = position.x - range;
            rangeDown  = position.y + range;
            rangeUp    = position.y - range;

        if (((enemyPosition.x >= position.x && rangeRight >= enemyPosition.x) || (enemyPosition.x <= position.x && rangeLeft <= enemyPosition.x)) && ((enemyPosition.y >= position.y && rangeDown >= enemyPosition.y) || (enemyPosition.y <= position.y && rangeUp <= enemyPosition.y))) {
            return true;
        }

        return false;
    },

    /**
     * This method checks if shooting an other unit is possible.
     * It checks if something is in the way.
     *
     * @param array obstacleCollection - all obstacle models
     * @param object startPosition
     * @param object goalPosition
     *
     * @return bool true || false
     */
    isShootingPossible: function (obstacleCollection, startPosition, goalPosition) {
        var value = 0.5,
            unitPosX = startPosition.x + value,
            unitPosY = startPosition.y + value,
            enemyPosX = goalPosition.x + value,
            enemyPosY = goalPosition.y + value,
            ascent = 0,
            n = 0;

        if (unitPosX !== enemyPosX) {
            ascent = (enemyPosY - unitPosY) / (enemyPosX - unitPosX);
            n = enemyPosY - (ascent * enemyPosX);
        }

        var key,
            obstaclePosition;
        for (key in obstacleCollection.models) {
            if (obstacleCollection.models.hasOwnProperty(key)) {
                obstaclePosition = obstacleCollection.models[key].getPosition();

                if (unitPosX === enemyPosX && obstaclePosition.x === (unitPosX - value)) {
                    if (unitPosY > enemyPosY && obstaclePosition.y >= (enemyPosY - value) && obstaclePosition.y <= (unitPosY - value)) {
                        return false;
                    }

                    if (unitPosY < enemyPosY && obstaclePosition.y <= (enemyPosY - value) && obstaclePosition.y >= (unitPosY - value)) {
                        return false;
                    }

                    continue;
                }

                if (unitPosY === enemyPosY && obstaclePosition.y === (unitPosY - value)) {
                    if (unitPosX > enemyPosX && obstaclePosition.x >= (enemyPosX - value) && obstaclePosition.x <= (unitPosX - value)) {
                        return false;
                    }

                    if (unitPosX < enemyPosX && obstaclePosition.x <= (enemyPosX - value) && obstaclePosition.x >= (unitPosX - value)) {
                        return false;
                    }

                    continue;
                }

                //var xEingang = obstaclePosition.x;
                var yEingang = ascent * obstaclePosition.x + n;
                //var xAusgang = obstaclePosition.x + 1;
                //var yAusgang = ascent * (obstaclePosition.x + 1) + n;

                var xE = (obstaclePosition.y - n) / ascent;
                //var yE = obstaclePosition.y;
                //var xA = (obstaclePosition.y - n) / ascent - 1;
                //var yA = obstaclePosition.y + 1;

                // 3.1666666666666665 7.75 1.5 8.5 3.5 5.5 2 6
                // console.log(xE, yEingang, enemyPosX, enemyPosY, unitPosX, unitPosY, obstaclePosition.x, obstaclePosition.y);
                if ((yEingang >= obstaclePosition.y && yEingang <= (obstaclePosition.y + 1)) || (xE >= obstaclePosition.x && xE <= (obstaclePosition.x + 1))) {

                    if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                        if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                            return false;
                        }

                        if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                            return false;
                        }
                    }

                    if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                        if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                            return false;
                        }

                        if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                            return false;
                        }
                    }

                    if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                        if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                            return false;
                        }

                        if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                            return false;
                        }
                    }

                    if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                        if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                            return false;
                        }

                        if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                            return false;
                        }
                    }
                }

              //var xEingang = obstaclePosition.x;
                yEingang = ascent * obstaclePosition.x + 1 + n;
                //var xAusgang = obstaclePosition.x + 1;
                //var yAusgang = ascent * (obstaclePosition.x + 1) + n;

                xE = (obstaclePosition.y + 1 - n) / ascent;
                //var yE = obstaclePosition.y;
                //var xA = (obstaclePosition.y - n) / ascent - 1;
                //var yA = obstaclePosition.y + 1;

                // 3.1666666666666665 7.75 1.5 8.5 3.5 5.5 2 6
                // console.log(xE, yEingang, enemyPosX, enemyPosY, unitPosX, unitPosY, obstaclePosition.x, obstaclePosition.y);
                if ((yEingang >= obstaclePosition.y && yEingang <= (obstaclePosition.y + 1)) || (xE >= obstaclePosition.x && xE <= (obstaclePosition.x + 1))) {

                    if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                        if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                            return false;
                        }

                        if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                            return false;
                        }
                    }

                    if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                        if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                            return false;
                        }

                        if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                            return false;
                        }
                    }

                    if (enemyPosY > unitPosY && obstaclePosition.y >= (unitPosY - value) && obstaclePosition.y <= (enemyPosY - value)) {
                        if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                            return false;
                        }

                        if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                            return false;
                        }
                    }

                    if (enemyPosY < unitPosY && obstaclePosition.y <= (unitPosY - value) && obstaclePosition.y >= (enemyPosY - value)) {
                        if (enemyPosX > unitPosX && obstaclePosition.x >= (unitPosX - value) && obstaclePosition.x <= (enemyPosX - value)) {
                            return false;
                        }

                        if (enemyPosX < unitPosX && obstaclePosition.x <= (unitPosX - value) && obstaclePosition.x >= (enemyPosX - value)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },

    /**
     * This method calculates the way points to a given goal position.
     * Of course all obstacles (units, building, what ever) will be checked.
     *
     * @param array obstacles - array of all obstacle models
     * @param array units - array of all unit models
     * @param object startPosition
     * @param object goalPosition
     *
     * @return void
     */
    getWayPoints: function (obstacles, units, startPosition, goalPosition) {
        var mapWidth  = 39,
            mapHeight = 24,
            matrix = [],
            unit,
            currentPosition = [],
            x;

        for (x = 0; x <= mapWidth; x += 1) {
            currentPosition = [];
            var y;
            for (y = 0; y <= mapHeight; y += 1) {
                // start position
                if (x === startPosition.x && y === startPosition.y) {
                    currentPosition.push('s');
                    continue;
                }

                // goal position
                if (x === goalPosition.x && y === goalPosition.y) {
                    currentPosition.push('g');
                    continue;
                }

                unit = _.detect(units.models, function(unitModel){
                    var position = unitModel.getPosition();
                    if (position.x === x && position.y === y) {
                        return true;
                    }
                });

                // nothing is in the way
                if (!obstacles.get(x + '_' + y) && !unit) {
                    currentPosition.push('w');
                    continue;
                }

                currentPosition.push('u');
            }

            matrix.push(currentPosition);
        }

        var wayPoints = astar(matrix, 'manhattan', false);

        if (!wayPoints || wayPoints.length <= 1) {
            return false;
        }

        var trash = wayPoints.shift();
        trash = null;

        return wayPoints;
    }
});
