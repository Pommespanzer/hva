var UnitFacade = function (mapClass) {
    "use strict";

    /**
     * Map - Class
     * 
     * @var object Map
     */
    var _map = mapClass;

    /**
     * Checks if an enemy is in range to attack.
     * 
     *  @param object unit - attacker
     *  @param object enemy - defender
     *  
     *  @return bool - true if enemy is in range
     *               - false if enemy is not in range
     */
    this.inRange = function (unit, enemy) {
        var position = unit.getPosition();
        var enemyPosition = enemy.getPosition();
        
        var selectedWeapon = unit.getSelectedWeapon();
        var range = selectedWeapon.range; 
        
        var rangeRight = position.x + range;
        var rangeLeft  = position.x - range;
        var rangeDown  = position.y + range;
        var rangeUp    = position.y - range;
        
        if (((enemyPosition.x >= position.x && rangeRight >= enemyPosition.x) || (enemyPosition.x <= position.x && rangeLeft <= enemyPosition.x)) && ((enemyPosition.y >= position.y && rangeDown >= enemyPosition.y) || (enemyPosition.y <= position.y && rangeUp <= enemyPosition.y))) {
            
            return true;
        }
        
        return false;
    };

    /**
     * Checks if an enemy is in range to attack via positions.
     * 
     * @param unitPosX  - x-position of unit
     * @param unitPosY  - y-position of unit
     * @param enemyPosX - x-position of enemy
     * @param enemyPosY - y-position of enemy
     * @param range - fire range of the weapon
     * 
     * @return bool - true if enemy is in range
     *              - false if enemy is not in range
     */
    this.inRangeByPosition = function (unitPosX, unitPosY, enemyPosX, enemyPosY, range) {
        var rangeRight = unitPosX + range;
        var rangeLeft  = unitPosX - range;
        var rangeDown  = unitPosY + range;
        var rangeUp    = unitPosY - range;
            
        if (((enemyPosX >= unitPosX && rangeRight >= enemyPosX) || (enemyPosX <= unitPosX && rangeLeft <= enemyPosX)) && ((enemyPosY >= unitPosY && rangeDown >= enemyPosY) || (enemyPosY <= unitPosY && rangeUp <= enemyPosY))) {
            
            return true;
        }
        
        return false;
    };

    /**
     * Checks if unit has a fireposition to attack the enemy.
     * 
     * @param unitPosX  - x-position of unit
     * @param unitPosY  - y-position of unit
     * @param enemyPosX - x-position of enemy
     * @param enemyPosY - y-position of enemy
     * 
     * @return bool - true if unit has a free fire position
     *              - false if unit has not a free fire position
     */
    this.inFireposition = function (unitPosX, unitPosY, enemyPosX, enemyPosY) {
        var value = 0.5;
        
        unitPosX += value;
        unitPosY += value;
        enemyPosX += value;
        enemyPosY += value;
        
        var ascent = 0;
        var n = 0;
        if (unitPosX !== enemyPosX) {
            ascent = (enemyPosY - unitPosY) / (enemyPosX - unitPosX);
            n = enemyPosY - (ascent * enemyPosX);
        }
        
        var obstacles = _map.getHindrances();
        var key;
        for (key in obstacles) {
            if (obstacles.hasOwnProperty(key)) {
                var obstaclePosition = obstacles[key];
            
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
    };

    /**
     * Get all way points to a given position.
     * 
     * @param unitPosX  - x-position of unit
     * @param unitPosY  - y-position of unit
     * @param enemyPosX - x-position of enemy
     * @param enemyPosY - y-position of enemy
     * 
     * @return array wayPoints - array of way points to the goal
     */
    this.getWaypoints = function (unitPosX, unitPosY, enemyPosX, enemyPosY) {
        var mapWidth  = 19;//map.getWidth();
        var mapHeight = 19;//map.getHeight();
        
        var matrix = [];
        var x;
        for (x = 0; x <= mapWidth; x += 1) {
            var currentPosition = [];
            var y;
            for (y = 0; y <= mapHeight; y += 1) {
                // start position
                if (x === unitPosX && y === unitPosY) {
                    currentPosition.push('s');
                    continue;
                }
                
                // goal position
                if (x === enemyPosX && y === enemyPosY) {
                    currentPosition.push('g');
                    continue;
                }
                
                // free position
                if (false === _map.getUnit(x, y) && false === _map.getHindrance(x, y)) {
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
    };

    /**
     * Return the closest enemy of a given enemy list.
     * 
     * @param object unit
     * @param array enemies
     * 
     * @return object closestEnemy - the closest enemy
     */
    this.getClosestEnemy = function (unit, enemies) {
        var position = unit.getPosition();
        
        var _tmpHelper = 0;
        var closestEnemy = null;
        var i;
        for (i in enemies) {
            if (enemies.hasOwnProperty(i)) {
                var enemy = enemies[i];
                
                var enemyPosition = enemy.getPosition();
                
                var distanceX = 0;
                var distanceY = 0;
                
                if (enemyPosition.x >= position.x) {
                    distanceX = enemyPosition.x - position.x;  
                } else {
                    distanceX = position.x - enemyPosition.x;
                }
                
                if (enemyPosition.y >= position.y) {
                    distanceY = enemyPosition.y - position.y;  
                } else {
                    distanceY = position.y - enemyPosition.y;
                }
                
                var newDistance = distanceX + distanceY;
                
                if (closestEnemy === null) {
                    closestEnemy = enemy;
                    _tmpHelper = newDistance;
                    continue;
                }
                
                if (_tmpHelper < newDistance) {
                    continue;
                }
                
                _tmpHelper = newDistance;
                closestEnemy = enemy;
            }
        }
        
        return closestEnemy;
    };

    /**
     * Return the weakest enemy of a given enemy list.
     * 
     * @param object enemies
     * 
     * @return object weakestEnemy - the weakest enemy
     */
    this.getWeakestEnemy = function (enemies) {
        var weakestEnemy = null;
        var i;
        for (i = 0; i < enemies.length; i += 1) {
            var enemy = enemies[i];
            
            if (i === 0) {
                weakestEnemy = enemy;
                continue;
            }

            if (enemy.getAmmo() > weakestEnemy.getAmmo()) {
                continue;
            }
            
            weakestEnemy = enemy;
        }
        
        return weakestEnemy;
    };

    /**
     * Return a list of the weakest enemies of a given enemy list.
     * The result of the weakest enemies have all the same ammo!
     * 
     * @param object enemies
     * 
     * @return array weakestEnemies - a list of the weakest enemy objects
     */
    this.getWeakestEnemies = function (enemies) {
        var weakestEnemy = this.getWeakestEnemy(enemies);
        
        var weakestEnemies = [];
        var i;
        for (i = 0; i < enemies.length; i += 1) {
            var enemy = enemies[i];
            
            if (enemy.getAmmo() === weakestEnemy.getAmmo()) {
                weakestEnemies.push(enemy);
            }
        }
        
        return weakestEnemies;
    };

    /**
     * Return a list of attackable enemies without moving closer or other actions.
     * 
     * @param object unit
     * @param array enemies
     * 
     * @return array enemiesInRange - a list of attackable enemy objects
     */
    this.getEnemiesInAttackRange = function (unit, enemies) {
        var position = unit.getPosition();
        
        var enemiesInRange = [];
        var key;
        for (key in enemies) {
            if (enemies.hasOwnProperty(key)) {
                var enemy = enemies[key];
                var enemyPosition = enemy.getPosition();
                
                if (false === this.inRange(unit, enemy)) {
                    continue;
                }
                
                if (false === this.inFireposition(position.x, position.y, enemyPosition.x, enemyPosition.y)) {
                    continue;
                }
               
                enemiesInRange.push(enemy);
            }
        }
        
        return enemiesInRange;
    };

    /**
     * Return a list of reachable enemies.
     * 
     * @param object unit
     * @param array enemies
     * 
     * @return array reachableEnemies - a list of reachable enemy objects
     */
    this.getReachableEnemies = function (unit, enemies) {
        var position = unit.getPosition();
        var battlefieldSize = 20;
        
        var reachableEnemies = {
            enemies: [],
            waypoints : {}
        };
        
        var key;
        for (key in enemies) {
            if (enemies.hasOwnProperty(key)) {
                var enemy = enemies[key];
                var enemyPosition = enemy.getPosition();
                var selectedWeapon = enemy.getSelectedWeapon();
                var range = selectedWeapon.range;
                
                var goalPositionX = 0;
                var goalPositionY = 0;
                
                if (enemyPosition.x >= position.x) {
                    goalPositionX = enemyPosition.x - range;
                } else {
                    goalPositionX = enemyPosition.x + range;
                }
            
                if (enemyPosition.y >= position.y) {
                    goalPositionY = enemyPosition.y - range;  
                } else {
                    goalPositionY = enemyPosition.y + range;
                }
            
                if (goalPositionX < 0) {
                    goalPositionX = 0;
                }
    
                if (goalPositionY < 0) {
                    goalPositionY = 0;
                }
                
                if (goalPositionX > battlefieldSize) {
                    goalPositionX = battlefieldSize;
                }
                
                if (goalPositionY > battlefieldSize) {
                    goalPositionY = battlefieldSize;
                }
    
                // if an other unit is on this position than get the next free position
                if (false !== _map.getUnit(goalPositionX, goalPositionY) || false !== _map.getHindrance(goalPositionX, goalPositionY)) {
                    
                    var freePosition = this.getFreePositionToEnemy(unit, enemy);
                    
                    if (null === freePosition) {
                        continue;
                    }
                    
                    goalPositionX = freePosition.x;
                    goalPositionY = freePosition.y;
                }
            
                var wayPoints = this.getWaypoints(position.x, position.y, goalPositionX, goalPositionY);
                
                if (false === wayPoints) {
                    continue;
                }
                
                var neededMovingPoints = wayPoints.length;
                
                // unit can't reach the enemy
                if (neededMovingPoints > unit.getCurrentActionPoints()) {
                    continue;
                }
                reachableEnemies.enemies.push(enemy);
                reachableEnemies.waypoints[enemy.getId()] = wayPoints;
            }
        }
        return reachableEnemies;
    };

    /**
     * Return a list of reachable and attackable enemies.
     * 
     * @param object unit
     * @param array enemies
     * 
     * @return array attackableEnemies - a list of reachable and attackable enemy objects
     */
    this.getAttackableEnemies = function (unit, enemies) {
        var position = unit.getPosition();
        
        var selectedWeapon = unit.getSelectedWeapon();
        var range = selectedWeapon.range; 
        
        var attackableEnemies = [];
        var key;
        for (key in enemies) {
            if (enemies.hasOwnProperty(key)) {
                var enemy = enemies[key];
                var enemyPosition = enemy.getPosition();
                
                var wayPoints = this.getWaypoints(position.x, position.y, enemyPosition.x, enemyPosition.y);
                
                if (false === wayPoints) {
                    continue;
                }
                
                var helper = [];
                var i;
                var len = wayPoints.length;
                for (i = 0; i < len; i += 1) {
                    var wayPoint = wayPoints.shift(); 
                    var x = wayPoint.row;
                    var y = wayPoint.col;
                    
                    helper.push({row: x, col: y});
                    
                    
                    if (false === this.inRangeByPosition(x, y, enemyPosition.x, enemyPosition.y, range)) {
                        continue;
                    }
                    
                    if (false === this.inFireposition(x, y, enemyPosition.x, enemyPosition.y)) {
                        continue;
                    }
                    
                    if (helper.length > unit.getCurrentActionPoints()) {
                        break;
                    }
                    
                    var rest = unit.getCurrentActionPoints() - helper.length;
                    if (rest < selectedWeapon.actionPoints) {
                        break;
                    }
                    
                    attackableEnemies.push({
                        enemy: enemy,
                        waypoints: helper
                    });
                    break;
                }
            }
        }
        
        return attackableEnemies;
    };

    /**
     * Return coordinates of a free (in range) position close to the enemy.
     * 
     * @param object unit
     * @param object enemy
     * 
     * @return object - coordinates to enemy
     *         false - if no coordinates are found
     */
    this.getFreePositionToEnemy = function (unit, enemy) {
        var enemyPosition = enemy.getPosition();
        var position = unit.getPosition();
        
        var selectedWeapon = unit.getSelectedWeapon();
        var range = selectedWeapon.range; 
        var x;
        var freePosition = null;
        for (x = (-1 * range); x <= range; x += 1) {
            var y;
            for (y = (-1 * range); y <= range; y += 1) {
                var newX = 0;
                var newY = 0;
                
                if (position.x < enemyPosition.x) {
                    newX = enemyPosition.x + x;
                } else if (position.x > enemyPosition.x) {
                    newX = enemyPosition.x - x;
                }
                
                if (position.y < enemyPosition.y) {
                    newY = enemyPosition.y + y;
                } else if (position.y > enemyPosition.y) {
                    newY = enemyPosition.y - y;
                }
                
                if (newX < 0) {
                    newX = 0;
                }
                
                if (newY < 0) {
                    newY = 0;
                }
                
                if (newX > 20) {
                    newX = 20;
                }
                
                if (newY > 20) {
                    newY = 20;
                }
                
                if (false === _map.getUnit(newX, newY) && false === _map.getHindrance(newX, newY)) {
                    freePosition = {
                        x: newX,
                        y: newY
                    };
                    
                    return freePosition;
                }
            }
        }
        return freePosition;
    };

    /**
     * Return way points to a possible attack position. It doesn't mean the
     * unit is able to attack the enemy.
     * 
     * @param object unit
     * @param object enemy
     * 
     * @return array - array of way points
     */
    this.getWaypointsToAttackPosition = function (unit, enemy) {
        var enemyPosition = enemy.getPosition();
        var position = unit.getPosition();
        var selectedWeapon = unit.getSelectedWeapon();
        var range = selectedWeapon.range; 
        
        var wayPoints = this.getWaypoints(position.x, position.y, enemyPosition.x, enemyPosition.y);
        
        var helper = [];
        var i;
        var len = wayPoints.length;
        for (i = 0; i < len; i += 1) {
            var wayPoint = wayPoints.shift();
            var x = wayPoint.row;
            var y = wayPoint.col;
            
            helper.push({row: x, col: y});
            
            if (false === this.inRangeByPosition(x, y, enemyPosition.x, enemyPosition.y, range)) {
                continue;
            }
            
            if (false === this.inFireposition(x, y, enemyPosition.x, enemyPosition.y)) {
                continue;
            }
            
            if (helper.length > unit.getCurrentActionPoints()) {
                helper = [];
                return helper;
            }
            
            return helper;
        }
        return helper;
    };
    
    /**
     * Cut the last way point if unit wants to move to the same position like the enemy.
     * 
     * @param object enemy
     * @param array wayPointsToEnemy
     * 
     * @return wayPointsToEnemy;
     */
    this.cutWaypoint = function (enemy, wayPointsToEnemy) {
    	var enemyPosition = enemy.getPosition();
    	
    	if (!wayPointsToEnemy) {
    		return wayPointsToEnemy;
    	}
    	
    	var len = wayPointsToEnemy.length;
    	
    	if (len === 0) {
    		return wayPointsToEnemy;
    	}
    	
    	var endWayPoint = wayPointsToEnemy[len - 1];
		if (endWayPoint.col === enemyPosition.x && endWayPoint.row === enemyPosition.y) {
			var trash = wayPointsToEnemy.pop();
			trash = null;
		}
		
		return wayPointsToEnemy;
    };
};