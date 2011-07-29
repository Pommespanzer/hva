var Ai = new function() {
    var _units = [];
    var _enemies = [];
    var _mapObj = null;
    this.init = function() {
        _mapObj = Map.getHtmlEntity();
        _mapObj.trigger('lock.userEvents');
        
        var allUnits = Map.getAllUnits();
        for (var i in allUnits) {
            var unit = allUnits[i];
            
            if (unit.isEnemy === true) {
                _units.push(unit);
                unit.resetCurrentActionPoints();
            }
        }
        
        if (_units.length === 0) {
            alert('Glückwunsch Level 1 geschafft.');
            return;
        }
        _startTurn();
    };
    
    var _startTurn = function() {
        _enemies = [];
        
        var allUnits = Map.getAllUnits();
        
        for (var i in allUnits) {
            var unit = allUnits[i];
            
            if (unit.isEnemy === true) {
                continue;
            }
            
            _enemies.push(unit);
        }
        
        if (_enemies.length === 0) {
            _mapObj.trigger('unlock.userEvents');
            alert('Du hast die Schlacht verloren');
            return;
        }
        
        if (_units.length === 0) {
            var allUnits = Map.getAllUnits();
            
            for (var i in allUnits) {
                var unit = allUnits[i];
                
                if (unit.isEnemy === true) {
                    continue;
                }
                
                unit.resetCurrentActionPoints();
            }
            _mapObj.trigger('unlock.userEvents');
            Status.usersTurn = true;
            ControlPanel.displayAll(Map.getSelectedUnit());
            alert('Du bist dran.');
            return;
        }
        
        var unit = _units.pop();
        
        var position = unit.getPosition();
        scrollTo(position.x * 50, position.y * 50);
        
        _begin(unit);
    };
    
    var _begin = function(unit) {
        var order = unit.getOrder();
        
        if (!order) {
            _searchAndDestroy(unit);
            return;
        }
        
        if (order.action === 'protect') {
            _protectPosition(unit, order);
            return;
        }
    };
    
    var _attack = function (unit, enemies) {
        var selectedWeapon = unit.getSelectedWeapon();
        var unitHtmlObject = unit.getHtmlEntity();
        var weakestEnemy = UnitFacade.getWeakestEnemy(enemies);
        unitHtmlObject.unbind('stopFiring').bind('stopFiring', function() {
            if (unit.getCurrentActionPoints() < selectedWeapon.actionPoints || 
                weakestEnemy.getAmmo() <= 0 || unit.getAmmo() <= 0
            ) {
                _startTurn();
            } else {
                _begin(unit);
            }
        });
        unit.attack(weakestEnemy);
        weakestEnemy.attack(unit);
    };
    
    var _moveAndAttack = function (unit, attackableEnemies) {
        var selectedWeapon = unit.getSelectedWeapon();
        var unitHtmlObject = unit.getHtmlEntity();
        
        var enemies = [];
        var helper = {};
        for (var key in attackableEnemies) {
            var enemy = attackableEnemies[key].enemy;
            var wp = attackableEnemies[key].waypoints;
            enemies.push(enemy);
            helper[enemy.getId()] = wp;
        }
        
        var weakestEnemies = UnitFacade.getWeakestEnemies(enemies);
        var closestWeakestEnemy = UnitFacade.getClosestEnemy(unit, weakestEnemies);
        
        var waypoints = helper[closestWeakestEnemy.getId()];
        waypoints = UnitFacade.cutWaypoint(closestWeakestEnemy, waypoints);

        unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
            unitHtmlObject.unbind('stopFiring').bind('stopFiring', function() {
                if (unit.getCurrentActionPoints() < selectedWeapon.actionPoints || 
                    closestWeakestEnemy.getAmmo() <= 0 || unit.getAmmo() <= 0
                ) {
                    _startTurn();
                } else {
                    _begin(unit);
                }
            });
            
            unit.attack(closestWeakestEnemy);
            closestWeakestEnemy.attack(unit);
        });
        
        unit.move(waypoints);
    };
    
    var _moveToPerimeter = function (unit, x, y, radius) {
        var unitHtmlObject = unit.getHtmlEntity();
        var position = unit.getPosition();
        var freePosition = UnitFacade.getPositionInPerimeter(x, y, radius);
        var waypoints = UnitFacade.getWaypoints(position.x, position.y, freePosition.x, freePosition.y);
        
        if (!waypoints) {
            _startTurn();
            return;
        }
        
        unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
            _startTurn();
        });
        
        unit.move(waypoints);
    };
    
    var _moveToBetterPosition = function (unit, enemies) {
        var unitHtmlObject = unit.getHtmlEntity();
        var closestEnemy = UnitFacade.getClosestEnemy(unit, enemies);
        var enemyPosition = closestEnemy.getPosition();
        var position = unit.getPosition();
        
        var waypoints = UnitFacade.getWaypoints(position.x, position.y, enemyPosition.x, enemyPosition.y);
        
        if (!waypoints) {
            _startTurn();
            return;
        }
        
        var halfway = Math.floor(waypoints.length / 2);
        var splitedWayPoints = waypoints.splice(0, halfway);
        
        splitedWayPoints = UnitFacade.cutWaypoint(closestEnemy, splitedWayPoints);
        
        unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
            _startTurn();
        });
        
        unit.move(splitedWayPoints);
    };
    
    var _protectPosition = function (unit, order) {
        var unitHtmlObject = unit.getHtmlEntity();
        unitHtmlObject.unbind('dead').bind('dead', function() {
            unitHtmlObject.unbind('dead');
            _startTurn();
        });
        
        var position = unit.getPosition();
        var targetPosition = order.positionToProtect;
        var range = order.protectionRange;
        
        // unit is in his protecting position
        if (true === UnitFacade.inRangeByPosition(position.x, position.y, targetPosition.x, targetPosition.y, range)) {
            var enemiesInAttackRange = UnitFacade.getEnemiesInAttackRange(unit, _enemies);
            if (enemiesInAttackRange.length > 0) {
                _attack(unit, enemiesInAttackRange);
                return;
            }
            
            var reachableEnemies = UnitFacade.getReachableEnemies(unit, _enemies);
            if (reachableEnemies.enemies.length > 0) {
                var attackableEnemies = UnitFacade.getAttackableEnemies(unit, reachableEnemies.enemies);
                
                if (attackableEnemies.length > 0) {
                    _moveAndAttack(unit, attackableEnemies);
                    return;
                }
            }
        }
        
        _moveToPerimeter(unit, targetPosition.x, targetPosition.y, range);
    };
    
    var _moveToClosestEnemy = function (unit, enemies) {
        var unitHtmlObject = unit.getHtmlEntity();
        var closestEnemy = UnitFacade.getClosestEnemy(unit, enemies);
        
        var position = unit.getPosition();
        var enemyPosition = closestEnemy.getPosition();
        
        unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
            _startTurn();
        });
        
        var wayPoints = UnitFacade.getWaypoints(position.x, position.y, enemyPosition.x, enemyPosition.y);
        wayPoints = UnitFacade.cutWaypoint(closestEnemy, wayPoints);
        
        if (false === wayPoints) {
            _startTurn();
            return;
        }
        unit.move(wayPoints);
    };
    
    var _searchAndDestroy = function (unit) {
        var unitHtmlObject = unit.getHtmlEntity();
        unitHtmlObject.unbind('dead').bind('dead', function() {
            unitHtmlObject.unbind('dead');
            _startTurn();
        });
        
        var enemiesInAttackRange = UnitFacade.getEnemiesInAttackRange(unit, _enemies);
        if (enemiesInAttackRange.length > 0) {
            _attack(unit, enemiesInAttackRange);
            return;
        }
        
        var reachableEnemies = UnitFacade.getReachableEnemies(unit, _enemies);
        if (reachableEnemies.enemies.length > 0) {
            var attackableEnemies = UnitFacade.getAttackableEnemies(unit, reachableEnemies.enemies);
            
            if (attackableEnemies.length > 0) {
                _moveAndAttack(unit, attackableEnemies);
                return;
            }
            
            _moveToBetterPosition(unit, reachableEnemies.enemies);
            return;
        }
        
        _moveToClosestEnemy(unit, _enemies);
    };
}();