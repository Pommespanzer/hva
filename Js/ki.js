var ki = function(unitFacade, map) {
    var _map = map;
    var _units = [];
    var _enemies = [];
    var _tmp = 0;
    var _unitFacade = unitFacade;
    var _mapObj = null;
    this.init = function() {
    	_mapObj = _map.getHtmlObject();
    	_mapObj.trigger('lock.userEvents');
    	
        if (_tmp == 0) {
            for (var i = 0; i < 20; i++) { 
                this.addEnemy();
                _tmp++;
            }
        }
        var allUnits = _map.getAllUnits();
        for (var i in allUnits) {
            var unit = allUnits[i];
            
            if (unit.isEnemy === true) {
                _units.push(unit);
                unit.resetCurrentActionPoints();
            }
        }
        
        _startTurn();
    };
    
    var _startTurn = function() {
        _enemies = [];
        
        var allUnits = _map.getAllUnits();
        
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
            var allUnits = _map.getAllUnits();
            
            for (var i in allUnits) {
                var unit = allUnits[i];
                
                if (unit.isEnemy === true) {
                    continue;
                }
                
                unit.resetCurrentActionPoints();
            }
            _mapObj.trigger('unlock.userEvents');
            alert('Du bist dran.');
            return;
        }
        
        var unit = _units.pop();
        
        _begin(unit);
    };
    
    var _begin = function(unit) {
        var unitHtmlObject = unit.getHtmlEntity();
        var selectedWeapon = unit.getSelectedWeapon();
        
        var enemiesInAttackRange = _unitFacade.getEnemiesInAttackRange(unit, _enemies);
        
        if (enemiesInAttackRange.length > 0) {
            var weakestEnemy = _unitFacade.getWeakestEnemy(enemiesInAttackRange);
            
            unitHtmlObject.unbind('stopFiring').bind('stopFiring', function() {
                if (unit.getCurrentActionPoints() < selectedWeapon.actionPoints || 
                    weakestEnemy.getAmmo() <= 0
                ) {
                    _startTurn();
                } else {
                    _begin(unit);
                }
            });
            
            unit.attack(weakestEnemy);
            weakestEnemy.attack(unit);
            return;
        }
        
        
        
        
        
        
        
        
        
        
        var attackableEnemies = [];
        var notAttackableEnemies = [];
        
        var reachableEnemies = _unitFacade.getReachableEnemies(unit, _enemies);
        
        if (reachableEnemies.enemies.length > 0) {
            var attackableEnemies = _unitFacade.getAttackableEnemies(unit, reachableEnemies.enemies);
            
            if (attackableEnemies.length > 0) {
                var enemies = [];
                var helper = {};
                for (var key in attackableEnemies) {
                    var enemy = attackableEnemies[key].enemy;
                    var wp = attackableEnemies[key].waypoints;
                    enemies.push(enemy);
                    helper[enemy.getId()] = wp;
                }
                
                var weakestEnemies = _unitFacade.getWeakestEnemies(enemies);
                var closestWeakestEnemy = _unitFacade.getClosestEnemy(unit, weakestEnemies);
                
                var waypoints = helper[closestWeakestEnemy.getId()];
                waypoints = _unitFacade.cutWaypoint(closestWeakestEnemy, waypoints);

                unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
                    unitHtmlObject.unbind('stopFiring').bind('stopFiring', function() {
                        if (unit.getCurrentActionPoints() < selectedWeapon.actionPoints || 
                            closestWeakestEnemy.getAmmo() <= 0
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
                return;
            }
            
            var closestEnemy = _unitFacade.getClosestEnemy(unit, reachableEnemies.enemies);
            var wayPointsClosestEnemy = reachableEnemies.waypoints[closestEnemy.getId()];
            
            var halfway = Math.floor(wayPointsClosestEnemy.length / 2);
            var splitedWayPoints = wayPointsClosestEnemy.splice(0, halfway);
            
            splitedWayPoints = _unitFacade.cutWaypoint(closestEnemy, splitedWayPoints);
            
            unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
                _startTurn();
            });
            
            unit.move(splitedWayPoints);
            return;
        }
        
        
        
        
        
        
        
        
        var closestEnemy = _unitFacade.getClosestEnemy(unit, _enemies);
        
        var position = unit.getPosition();
        var enemyPosition = closestEnemy.getPosition();
        
        unitHtmlObject.unbind('goalReached').bind('goalReached', function() {
            _startTurn();
        });
        
        var wayPoints = _unitFacade.getWaypoints(position.x, position.y, enemyPosition.x, enemyPosition.y);
        wayPoints = _unitFacade.cutWaypoint(closestEnemy, wayPoints);
        
        if (false === wayPoints) {
            _startTurn();
            return;
        }
        unit.move(wayPoints);
    };
    
    this.addEnemy = function() {
        var x = Math.random() * 20;
        var y = Math.random() * 20;
        
        var id = Math.floor(Math.random() * 9999999999 + Math.random() * 9999999999);
        var enemy = new Unit(id, id, _map, _unitFacade);
        enemy.setType('unit-human-mg');
        enemy.setAmmo(1000);
        enemy.setActionPoints(15);
        enemy.isEnemy = true;
        enemy.setSpeed(100);
        enemy.addWeapon({
        	selected: true,
        	name: 'MG',
        	range: 5,
        	actionPoints: 2,
        	firepower: 100,
        	firespeed: 200
        });
        
        if (_map.addUnit(enemy, x, y)) {
            //var htmlObj = enemy.getHtmlEntity();
            //htmlObj.css('background-color', 'red');
            return;
        }
        
        this.addEnemy();
    };
};