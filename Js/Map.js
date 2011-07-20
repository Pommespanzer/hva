var Map = function() {
    var _map = null;
    var _units = {};
    var _selectedUnit = null;
    var _hindrances = {};
    var _blockedWaypoints = [];

    this.init = function() {
        _map = $('#battlefield');
    };
    this.getHtmlObject = function() {
        return _map;
    };

    this.blockWaypoints = function (waypoints) {
    	_blockedWaypoints.concat(waypoints);
    };

    this.getBlockedWaypoint = function (x, y) {
    	for (var i in _blockedWaypoints) {
			var blockedWp = _blockedWaypoints[i];

			if (blockedWp.col === x && blockedWp.row === y) {
				return _blockedWaypoints[i];
			}
    	}
    	return false;
    };

    this.removeBlockedWaypoints = function (waypoints) {
    	for (var i in waypoints) {
    		var wp = waypoints[i];
    		for (var j in _blockedWaypoints) {
    			var blockedWp = _blockedWaypoints[j];

    			if (blockedWp.col === wp.col && blockedWp.row === wp.row) {
    				delete _blockedWaypoints[j];
    			}
        	}
    	}
    };

    this.addUnit = function(unit, x, y) {
        if (typeof unit !== 'object') {
            throw Error('Map: Unit object is missing.');
        }

        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (coordinates in _units || coordinates in _hindrances) {
            return false;
        }

        unit.setPosition(x, y);
        _units[coordinates] = unit;

        unit.render();

        return true;
    };

    this.updateUnitPosition = function(unit, x, y) {
        if (typeof unit !== 'object') {
            throw Error('Map: Unit object is missing.');
        }

        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var oldPosition = unit.getPosition();
        var oldCoordinates = oldPosition.x + '-' + oldPosition.y;

        if (! (oldCoordinates in _units)) {
        	return;
        }

        var coordinates = x + '-' + y;
        if (coordinates in _units) {
            throw Error('Map: Goal position already set.');
        }

        delete _units[oldCoordinates];

        unit.setPosition(x, y);
        _units[coordinates] = unit;
    };

    this.getUnit = function(x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (! (coordinates in _units)) {
            return false;
        }

        return _units[coordinates];
    };

    this.removeUnit = function(x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (! (coordinates in _units)) {
            return false;
        }

        var unit = _units[coordinates];

        var htmlObj = $('#' + unit.getId(), _map);
        // stop any animation on this object
        htmlObj.stop();

        if (htmlObj.length > 0) {
            htmlObj.remove();
        }

        delete _units[coordinates];


        return true;
    };

    this.getPosition = function(x, y) {
        var pageX = window.pageXOffset;
        var pageY = window.pageYOffset;

        var mapOffset = _map.offset();

        var positionX = x - mapOffset.left + pageX;
        var positionY = y - mapOffset.top + pageY;

        x = Math.floor(positionX / 50);
        y = Math.floor(positionY / 50);

        return {
        	x: x,
        	y: y
        };
    };

    this.setSelectedUnit = function(unit) {
        if (typeof unit !== 'object') {
            throw Error('Map: Unit object is missing.');
        }

        _selectedUnit = unit;
    };

    this.addHindrance = function (x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (coordinates in _units || coordinates in _hindrances) {
            return false;
        }

        _hindrances[coordinates] = {x: x, y: y};

        var html = [];
        html.push('<div class="obstacle" ' +
                       'style="position: absolute; top: ' + (y * 50) + 'px; left: ' + (x * 50) + 'px;">') +
        html.push('</div>');

        _map.append(html.join(''));
        return true;
    };

    this.getHindrance = function(x, y) {
    	x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (! (coordinates in _hindrances)) {
            return false;
        }

        return _hindrances[coordinates];
    };

    this.getHindrances = function() {
    	return _hindrances;
    };

    this.getAllUnits = function() {
        return _units;
    };
};
