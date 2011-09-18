var AiFacade = Backbone.Model.extend({
    inPosition: function (currentPosition, goalPosition, positionRange) {
        var rangeRight = currentPosition.x + positionRange,
            rangeLeft  = currentPosition.x - positionRange,
            rangeDown  = currentPosition.y + positionRange,
            rangeUp    = currentPosition.y - positionRange;
            
        if (((goalPosition.x >= currentPosition.x && rangeRight >= goalPosition.x) || 
             (goalPosition.x <= currentPosition.x && rangeLeft <= goalPosition.x)) && 
             ((goalPosition.y >= currentPosition.y && rangeDown >= goalPosition.y) || 
             (goalPosition.y <= currentPosition.y && rangeUp <= goalPosition.y))) {
            
            return true;
        }
        
        return false;
    },
    
    inFirerange: function (unitPosition, enemyPosition, firerange) {
        return this.inPosition(unitPosition, enemyPosition, firerange);
    },
    
    getEnemiesInFirerange: function (unitModel, enemyModels) {
        var unitPosition = unitModel.getPosition(),
            weapon = unitModel.get('weapons')[0],
            enemiesInFirerange = [],
            enemyModel,
            enemyPosition,
            key;
            
        for (key in enemyModels) {
            if (enemyModels.hasOwnProperty(key)) {
                enemyModel = enemyModels[key];
                enemyPosition = enemyModel.getPosition();
                
                if (false === this.inFirerange(unitPosition, enemyPosition, weapon.range)) {
                    continue;
                }
                
                if (false === mapView.model.isShootingPossible(mapView.obstacleCollection, unitPosition, enemyPosition)) {
                    continue;
                }
               
                enemiesInFirerange.push(enemyModel);
            }
        }
        
        return enemiesInFirerange;
    },
    
    _getWeakestEnemy: function (enemyModels) {
        var weakestEnemy = null,
            enemy, i;
            
        for (i = 0; i < enemyModels.length; i += 1) {
            enemy = enemyModels[i];
            
            if (i === 0) {
                weakestEnemy = enemy;
                continue;
            }

            if (enemy.getCurrentArmor() > weakestEnemy.getCurrentArmor()) {
                continue;
            }
            
            weakestEnemy = enemy;
        }
        
        return weakestEnemy;
    },
    
    _getClosestEnemy: function (unitModel, enemyModels) {
        var position = unitModel.getPosition(),
            tmpHelper = 0,
            closestEnemy = null,
            enemy,
            enemyPosition,
            distanceX,
            distanceY,
            i;
        
        for (i in enemyModels) {
            if (enemyModels.hasOwnProperty(i)) {
                enemy = enemyModels[i];
                enemyPosition = enemy.getPosition();
                
                distanceX = 0;
                distanceY = 0;
                
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
                    tmpHelper = newDistance;
                    continue;
                }
                
                if (tmpHelper < newDistance) {
                    continue;
                }
                
                tmpHelper = newDistance;
                closestEnemy = enemy;
            }
        }
        
        return closestEnemy;
    },
    
    getEnemiesNearby: function (unitModel, enemyModels) {
        var unitPosition = unitModel.getPosition(),
            weapon = unitModel.get('weapons')[0],
            battlefieldSize = 19,
            enemiesNearby = [],
            enemy,
            enemyPosition,
            goalPosition = {x: 0, y: 0},
            wayPoints,
            key;
        
        for (key in enemyModels) {
            if (enemyModels.hasOwnProperty(key)) {
                enemy = enemyModels[key];
                enemyPosition = enemy.getPosition();
                
                // get the way points to enemy
                wayPoints = mapView.model.getWayPoints(
                    mapView.obstacleCollection,
                    mapView.unitCollection,
                    unitPosition, 
                    enemyPosition
                );
                
                if (!wayPoints) {
                    continue;
                }
                
                var len = wayPoints.length - weapon.range;
                if (len <= 2) {
                    continue;
                }
                
                // -2 because cut the position from enemy as well
                wayPoints = wayPoints.slice(0, len - 2);
                if ((unitModel.getCurrentActionPoints() - weapon.actionPoints) >= wayPoints.length) {
                    enemiesNearby.push({enemy: enemy, wayPoints: wayPoints});
                }        
            }
        }
        return enemiesNearby;
    },
    
    getAttackableEnemies: function (unitModel, enemyModels) {
        console.log('[info] ############## ATTACKABLE ENEMIES ##############');
        
        var unitPosition = unitModel.getPosition(),
            weapon = unitModel.get('weapons')[0],
            enemyModel,
            enemyPosition,
            wayPoints,
            attackableEnemies = [],
            slicePosition,
            key,
            i,
            currentWayPoint,
            startPosition = {};
        
        for (key in enemyModels) {
            if (enemyModels.hasOwnProperty(key)) {
                enemyModel = enemyModels[key];
                enemyPosition = enemyModel.getPosition();
                
                // enemy is in fire range and in shoot position
                if (this.inFirerange(unitPosition, enemyPosition, weapon.range) &&
                    mapView.model.isShootingPossible(mapView.obstacleCollection, unitPosition, enemyPosition) &&
                    unitModel.getCurrentActionPoints() > weapon.actionPoints
                ) {
                    console.log('[info] - ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ') IS IN FIRERANGE AND PROPER ATTACK POSITION');
                    attackableEnemies.push({
                        wayPoints: [], 
                        model: enemyModel
                    });
                    continue;
                }
                
                // way points to enemy
                wayPoints = mapView.model.getWayPoints(
                    mapView.obstacleCollection,
                    mapView.unitCollection,
                    unitPosition, 
                    enemyPosition
                );
                
                // no way points
                if (!wayPoints) {
                    console.log('[info] - NO WAY POINTS TO ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                    continue;
                }
                
                // not reachable
                if ((wayPoints.length - weapon.range) > unitModel.getCurrentActionPoints()) {
                    console.log('[info] - ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ') TO FAR AWAY');
                    continue;
                }
                
                slicePosition = null;
                // look for a proper fire position
                for (i = 0; i < (wayPoints.length - 1); i += 1) {
                    currentWayPoint = wayPoints[i];
                    startPosition = {x: currentWayPoint.row, y: currentWayPoint.col};
                    
                    // not in range and not in proper fire position
                    if (false === this.inFirerange(startPosition, enemyPosition, weapon.range) ||
                        false === mapView.model.isShootingPossible(mapView.obstacleCollection, startPosition, enemyPosition)
                    ) {
                        continue;
                    }
                    
                    slicePosition = i;
                    break;
                }
                
                // no way point is a proper fire position
                if (null === slicePosition) {
                    console.log('[info] - NO PROPER FIRE POSITION FOUND TO ATTACK ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                    continue
                }
                
                wayPoints = wayPoints.slice(0, slicePosition + 1);
                
                // reachable, but not enough action points to attack after moving
                if ((unitModel.getCurrentActionPoints() - wayPoints.length) < weapon.actionPoints) {
                    console.log('[info] - NOT ENOUGHT ACTION POINTS TO MOVE AND THAN ATTACK THE ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                    continue;
                }
                
                console.log('[info] - CAN ATTACK THE ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                attackableEnemies.push({
                    wayPoints: wayPoints, 
                    model: enemyModel
                });
            }
        }
        
        return attackableEnemies;
    },
    
    getDestroyableEnemies: function (unitModel, enemyModels) {
        console.log('[info] ############## DESTROYABLE ENEMIES ##############');
        var destroyableEnemies = [],
            unitPosition = unitModel.getPosition(),
            weapon = unitModel.get('weapons')[0],
            enemyModel,
            enemyPosition,
            weaponPower,
            index,
            wayPoints,
            currentWayPoint,
            startPosition = {};
        
        for (index in enemyModels) {
            enemyModel = enemyModels[index];
            enemyPosition = enemyModel.getPosition();
            
            // enemy is in fire range and in shoot position
            if (this.inFirerange(unitPosition, enemyPosition, weapon.range) &&
                mapView.model.isShootingPossible(mapView.obstacleCollection, unitPosition, enemyPosition)
            ) {
                weaponPower = Math.floor(unitModel.getCurrentActionPoints() / weapon.actionPoints) * weapon.firepower;    
                if (enemyModel.getCurrentArmor() <= weaponPower) {
                    console.log('[info] - ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ') IS IN FIRERANGE AND PROPER ATTACK POSITION AND DESTROYABLE');
                    destroyableEnemies.push({
                        wayPoints: [], 
                        model: enemyModel
                    });
                    continue;                    
                }
            }
            
            // way points to enemy
            wayPoints = mapView.model.getWayPoints(
                mapView.obstacleCollection,
                mapView.unitCollection,
                unitPosition, 
                enemyPosition
            );
            
            // no way points
            if (!wayPoints) {
                console.log('[info] - NO WAY POINTS TO ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                continue;
            }
            
            // not reachable
            if ((wayPoints.length - weapon.range) > unitModel.getCurrentActionPoints()) {
                console.log('[info] - ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ') TO FAR AWAY');
                continue;
            }
            
            slicePosition = null;
            // look for a proper fire position
            for (i = 0; i < (wayPoints.length - 1); i += 1) {
                currentWayPoint = wayPoints[i];
                startPosition = {x: currentWayPoint.row, y: currentWayPoint.col};
                
                // not in range and not in proper fire position
                if (false === this.inFirerange(startPosition, enemyPosition, weapon.range) ||
                    false === mapView.model.isShootingPossible(mapView.obstacleCollection, startPosition, enemyPosition)
                ) {
                    continue;
                }
                
                slicePosition = i;
                break;
            }
            
            // no way point is a proper fire position
            if (null === slicePosition) {
                console.log('[info] - NO PROPER FIRE POSITION FOUND TO ATTACK ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                continue
            }
            
            wayPoints = wayPoints.slice(0, slicePosition + 1);
            
            // reachable, but not enough action points to attack after moving
            if ((unitModel.getCurrentActionPoints() - wayPoints.length) < weapon.actionPoints) {
                console.log('[info] - NOT ENOUGHT ACTION POINTS TO MOVE AND THAN ATTACK THE ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
                continue;
            }
            
            weaponPower = Math.floor((unitModel.getCurrentActionPoints() - wayPoints.length) / weapon.actionPoints) * weapon.firepower;    
            
            if (enemyModel.getCurrentArmor() > weaponPower) {
                console.log('[info] - ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ') IS REACHABLE AND ATTACKABLE BUT CAN NOT BE DESTROYED');
                continue;                    
            }
            
            console.log('[info] - CAN DESTROY THE ENEMY (' + enemyPosition.x + ', ' + enemyPosition.y + ')');
            destroyableEnemies.push({
                wayPoints: wayPoints, 
                model: enemyModel
            });
        }
        
        return destroyableEnemies;
    },
    
    getClosestEnemies: function (unitModel, enemyModels) {
        console.log('[info] ############## CLOSEST ENEMIES ##############');
        var closestEnemies = [],
            closestEnemy,
            enemyModel,
            closestEnemyPosition,
            i,
            index,
            len = enemyModels.length,
            helperArray = enemyModels;
        
        
        // look through all enemies which one is the closest
        for (i = 0; i < len; i += 1) {
            // get the closest enemy from stack
            closestEnemy = this._getClosestEnemy(unitModel, helperArray);
            
            helperArray = [];
            for (index in enemyModels) {
                enemyModel = enemyModels[index];
                
                // remove closest enemy from stack to check the next closest enemy
                if (enemyModel.get('id') === closestEnemy.get('id')) {
                    continue;
                }
                
                helperArray.push(enemyModel);
            }
            
            // just for debugging
            closestEnemyPosition = closestEnemy.getPosition();
            console.log('[info] - ' + (i + 1) + '. ENEMY (' + closestEnemyPosition.x + ', ' + closestEnemyPosition.y + ') WITH CLOSEST DISTANCE.');
            
            closestEnemies.push(closestEnemy);
        }
        
        return closestEnemies;
    },
    
    getWeakestEnemies: function (enemyModels) {
        console.log('[info] ############## WEAKEST ENEMIES ##############');
        var weakestEnemies = [],
            weakestEnemy,
            enemyModel,
            weakestEnemyPosition,
            i,
            index,
            len = enemyModels.length,
            helperArray = enemyModels;
        
        // look through all enemies which one is the weakest
        for (i = 0; i < len; i += 1) {
            // get the weakest enemy from stack
            weakestEnemy = this._getWeakestEnemy(helperArray);
            
            helperArray = [];
            for (index in enemyModels) {
                enemyModel = enemyModels[index];
                
                // remove closest enemy from stack to check the next closest enemy
                if (enemyModel.get('id') === weakestEnemy.get('id')) {
                    continue;
                }
                
                helperArray.push(enemyModel); 
            }
            
            // just for debugging
            weakestEnemyPosition = weakestEnemy.getPosition();
            console.log('[info] - ' + (i + 1) + '. WEAKEST ENEMY (' + weakestEnemyPosition.x + ', ' + weakestEnemyPosition.y + ').');
            
            weakestEnemies.push(weakestEnemy);
        }
        
        return weakestEnemies;
    }
});
