var Map = new function () {
    'use strict';
    
    /**
     * HTML - object of the battlefield
     * 
     * @var object _mapHtmlEntity
     */
    var _mapHtmlEntity = null;
    
    /**
     * Contains all units (enemies as well) from battlefield
     * 
     * @var object _units
     */
    var _units = {};
    
    /**
     * The current selected unit
     * 
     * @var object Unit - class
     */
    var _selectedUnit = null;
    
    /**
     * Contains all obstacles on battlefield
     * 
     * @var object _obstacles
     */
    var _obstacles = {};
    
    /**
     * Just do init stuff
     * 
     * @return void
     */
    this.init = function () {
        _mapHtmlEntity = $('#battlefield');
    };
    
    /**
     * Get the html entity object of the battlefield
     * 
     * @return object _mapHtmlEntity
     */
    this.getHtmlEntity = function () {
        return _mapHtmlEntity;
    };

    /**
     * Add a unit to battlefield with given coordinates.
     * 
     * @param object unit - unit to place on battlefield
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return void
     */
    this.addUnit = function (unit, x, y) {
        if (typeof unit !== 'object') {
            throw new Error('Map: Unit object is missing.');
        }

        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (_units.hasOwnProperty(coordinates) || _obstacles.hasOwnProperty(coordinates)) {
            return false;
        }

        unit.setPosition(x, y);
        _units[coordinates] = unit;

        unit.render();

        return true;
    };

    /**
     * Update the position of the unit (i.e. after moving)
     * 
     * @param object unit - unit to place on battlefield
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return void
     */
    this.updateUnitPosition = function (unit, x, y) {
        if (typeof unit !== 'object') {
            throw new Error('Map: Unit object is missing.');
        }

        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var oldPosition = unit.getPosition();
        var oldCoordinates = oldPosition.x + '-' + oldPosition.y;

        if (!_units.hasOwnProperty(oldCoordinates)) {
            return;
        }

        var coordinates = x + '-' + y;
        if (_units.hasOwnProperty(coordinates)) {
            throw new Error('Map: Goal position already set.');
        }

        delete _units[oldCoordinates];

        unit.setPosition(x, y);
        _units[coordinates] = unit;
    };

    /**
     * Get unit of a given position if found.
     * 
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return void
     */
    this.getUnit = function (x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (!_units.hasOwnProperty(coordinates)) {
            return false;
        }

        return _units[coordinates];
    };

    /**
     * Remove unit from battlefield (i.e. if unit was destroyed by enemy)
     * 
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return void
     */
    this.removeUnit = function (x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (!_units.hasOwnProperty(coordinates)) {
            return false;
        }

        var unit = _units[coordinates];

        var htmlObj = $('#' + unit.getId(), _mapHtmlEntity);
        // stop any animation on this object
        htmlObj.stop();

        if (htmlObj.length > 0) {
            htmlObj.remove();
        }

        delete _units[coordinates];


        return true;
    };

    /**
     * Get a useful mouse click position in battlefield to check what the
     * user wants to do.
     * 
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return object position - {x: ?, y: ?}
     */
    this.getPosition = function (x, y) {
        var pageX = window.pageXOffset;
        var pageY = window.pageYOffset;

        var mapOffset = _mapHtmlEntity.offset();

        var positionX = x - mapOffset.left + pageX;
        var positionY = y - mapOffset.top + pageY;

        x = Math.floor(positionX / 50);
        y = Math.floor(positionY / 50);

        return {
            x: x,
            y: y
        };
    };

    /**
     * Set the current clicked unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.setSelectedUnit = function (unit) {
        if (typeof unit !== 'object') {
            throw new Error('Map: Unit object is missing.');
        }

        _selectedUnit = unit;
    };
    
    /**
     * Get the current clicked unit.
     * 
     * @return object unit - Unit-class
     */
    this.getSelectedUnit = function () {
        return _selectedUnit;
    };

    /**
     * Add an obstacle to the battlefield on a given position
     * 
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return void
     */
    this.addObstacle = function (x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (_units.hasOwnProperty(coordinates) || _obstacles.hasOwnProperty(coordinates)) {
            return false;
        }

        _obstacles[coordinates] = {x: x, y: y};

        var html = [];
        html.push('<div class="obstacle" style="position: absolute; top: ' + (y * 50) + 'px; left: ' + (x * 50) + 'px;">');
        html.push('</div>');

        _mapHtmlEntity.append(html.join(''));
        return true;
    };

    /**
     * Get obstacle from a given position if possible.
     * 
     * @param integer x - x-position
     * @param integer y - y-position
     * 
     * @return object position - {x: ?, y: ?}
     */
    this.getObstacle = function (x, y) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);

        if (x < 0 || y < 0) {
            throw new Error('Map: Invalid coordinates.');
        }

        var coordinates = x + '-' + y;

        if (!_obstacles.hasOwnProperty(coordinates)) {
            return false;
        }

        return _obstacles[coordinates];
    };
    
    /**
     * Get all available obstacles from battlefield
     * 
     * @return array of obstacle-objects
     */
    this.getObstacles = function () {
        return _obstacles;
    };

    /**
     * Get all available units from battlefield
     * 
     * @return array of unit-objects
     */
    this.getAllUnits = function () {
        return _units;
    };
}();
