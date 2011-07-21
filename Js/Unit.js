var Unit = function (id, name, map, unitFacade) {
    "use strict";

    /**
     * unique id of unit
     *
     * @var integer id
     */
    var _id = id;

    /**
     * name of unit
     *
     * @var string name
     */
    var _name = name;

    /**
     * UnitFacade - Class
     *
     * @var object UnitFacade
     */
    var _unitFacade = unitFacade;

    /**
     * Map - Class
     *
     * @var object Map
     */
    var _map = map;

    /**
     * Type of unit
     *
     * @var string _type
     */
    var _type = '';

    /**
     * Ammo of unit
     *
     * @var integer _ammo
     */
    var _ammo = 0;

    /**
     * Current position of unit in battlefield
     *
     * @var object _position
     */
    var _position = {
        x: 0,
        y: 0
    };

    /**
     * Total action points of unit
     *
     * @var integer _totalActionPoints
     */
    var _totalActionPoints = 0;

    /**
     * Current action points of unit
     *
     * @var integer _currentActionPoints
     */
    var _currentActionPoints = 0;

    /**
     * Moving speed of the unit.
     *
     * @var integer _speed
     */
    var _speed = 0;

    /**
     * JQuery HTML node of unit.
     *
     * @var object _htmlEntity
     */
    var _htmlEntity = null;

    /**
     * Array of all weapons of the unit.
     *
     * @var array of weapon objects
     */
    var _weapons = [];

    /**
     * Action of the moving sprite
     *
     * @var object _moveAction
     */
    var _moveAction = null;

    /**
     * Action of the firing sprite
     *
     * @var object _fireAction
     */
    var _fireAction = null;

    /**
     * Ammo quotient
     *
     * @var integer _ammoQuotient
     */
    var _ammoQuotient = 0;

    /**
     * Flag to avoid interaction errors
     *
     * @var bool _isAlreadyAttacking
     */
    var _isAlreadyAttacking = false;

    /**
     * Flag to avoid interaction errors
     *
     * @var bool _isAlreadyMoving
     */
    var _isAlreadyMoving = false;

    /**
     * Just a flag to decide between users units and computers units
     *
     * @var bool isEnemy
     */
    this.isEnemy = false;

    /**
     * Return the unique id of the unit.
     *
     * @return integer _id
     */
    this.getId = function () {
        return _id;
    };

    /**
     * Return the name of the unit.
     *
     * @return string _name
     */
    this.getName = function () {
        return _name;
    };

    /**
     * Set type of unit.
     *
     * @param string type
     *
     * @return void
     */
    this.setType = function (type) {
        _type = type;
    };

    /**
     * Get type of unit.
     *
     * @return string _type
     */
    this.getType = function () {
        return _type;
    };

    /**
     * Set the ammo of the unit.
     *
     * @param integer ammo
     *
     * @return void
     */
    this.setAmmo = function (ammo) {
        _ammo = ammo;

        if (_ammo < 0) {
            this._htmlEntity.remove();
            return;
        }
    };

    /**
     * Get the ammo of the unit.
     *
     * @return integer _ammo
     */
    this.getAmmo = function () {
        return _ammo;
    };
    
    /**
     * Get the ammo quotient of the unit.
     * 
     * @return integer _ammoQuotient
     */
    this.getAmmoQuotient = function () {
        return _ammoQuotient;
    };

    /**
     * Set the position of the unit.
     *
     * @param integer x - x-position in battlefield
     * @param integer y - y-position in battlefield
     *
     * @return void
     */
    this.setPosition = function (x, y) {
        _position.x = x;
        _position.y = y;
    };

    /**
     * Get the current position of unit in battlefield.
     *
     * @return object _position {x: ?, y: ?}
     */
    this.getPosition = function () {
        return _position;
    };

    /**
     * Set all needed action points (total action points and curren action points).
     *
     * @param integer actionPoints
     *
     * @return void
     */
    this.setActionPoints = function (actionPoints) {
        _totalActionPoints = actionPoints;
        this.setCurrentActionPoints(actionPoints);
    };

    /**
     * Set the current action points for the unit.
     *
     * @param integer actionPoints
     *
     * @return void
     */
    this.setCurrentActionPoints = function (actionPoints) {
        _currentActionPoints = actionPoints;
    };

    /**
     * Get the current action points for the unit.
     *
     * @return intger _currentActionPoints
     */
    this.getCurrentActionPoints = function () {
        return _currentActionPoints;
    };

    /**
     * Get the total action points for this unit.
     *
     * @return integer _totalActionPoints
     */
    this.getTotalActionPoints = function () {
        return _totalActionPoints;
    };

    /**
     * Reset the current action points to the total action points.
     *
     * @return void
     */
    this.resetCurrentActionPoints = function () {
        _currentActionPoints = this.getTotalActionPoints();
    };

    /**
     * Set the moving speed of the unit.
     *
     * @param integer speed
     *
     * @return void
     */
    this.setSpeed = function (speed) {
        _speed = speed;
    };

    /**
     * Get the moving speed of the unit.
     *
     * @return integer _speed
     */
    this.getSpeed = function () {
        return _speed;
    };

    /**
     * Set the html object of the unit.
     *
     * @param object unitObject
     *
     * @return void
     */
    this.setHtmlEntity = function (unitObject) {
        _htmlEntity = unitObject;
    };

    /**
     * Get the html object of the unit.
     *
     * @return object _htmlEntity
     */
    this.getHtmlEntity = function () {
        return _htmlEntity;
    };

    /**
     * Add a weapon to the unit.
     *
     * @param object weapon
     *    {
     *      selected: bool,
     *      name: string,
     *      range: integer,
     *      actionPoints: integer,
     *      firepower: integer,
     *      firespeed: integer
     *    }
     *
     * @return void
     */
    this.addWeapon = function (weapon) {
        _weapons.push(weapon);
    };

    /**
     * Get selected weapon of the unit.
     *
     * @return object _weapon
     */
    this.getSelectedWeapon = function () {
        var key;
        for (key in _weapons) {
            if (_weapons.hasOwnProperty(key)) {
                if (true === _weapons[key].selected) {
                    return _weapons[key];
                }
            }
        }

        throw new Error('Unit: no selected weapon found.');
    };

    /**
     * Start the moving sprite in an interval to simulate moving feeling.
     *
     * @return void
     */
    this.startMovingSprite = function () {
        var value = 50;
        var unitObject = this.getHtmlEntity();
        _moveAction = window.setInterval($.proxy(function () {
            var backgroundPositionString = unitObject.css('background-position');
            var backgroundPositionArray = backgroundPositionString.split(' ');
            var backgroundPositionX = parseInt(backgroundPositionArray[0], 10);
            var backgroundPositionY = parseInt(backgroundPositionArray[1], 10);

            if (backgroundPositionX === -200) {
                value = 50;
            }

            if (backgroundPositionX === 0) {
                value = -50;
            }

            backgroundPositionX += value;

            unitObject.css('background-position', backgroundPositionX + 'px ' + backgroundPositionY + 'px');
        }, this), 100);
    };

    /**
     * Stop the runing moving sprite to simulate that moving is over.
     *
     * @return void
     */
    this.stopMovingSprite = function () {
        if (_moveAction === null) {
            return;
        }

        var unitObject = this.getHtmlEntity();
        var backgroundPositionString = unitObject.css('background-position');
        var backgroundPositionArray = backgroundPositionString.split(' ');
        var backgroundPositionY = parseInt(backgroundPositionArray[1], 10);
        unitObject.css('background-position', '-100px ' + backgroundPositionY + 'px');

        window.clearInterval(_moveAction);
        _moveAction = null;
    };

    /**
     * Calculate the angle from the unit to the enemy.
     *
     * @param integer goalPositionX
     * @param integer goalPositionY
     *
     * @return integer angel
     */
    this.getAngle = function (goalPositionX, goalPositionY) {
        var position = this.getPosition();
        var angle = Math.acos((goalPositionY - position.y) / Math.sqrt((goalPositionX - position.x) * (goalPositionX - position.x) + (goalPositionY - position.y) * (goalPositionY - position.y)));

        if (goalPositionX >= position.x) {
            angle = -angle * 360 / (2 * Math.PI) - 90;
        } else {
            angle = angle * 360 / (2 * Math.PI) - 90;
        }

        return angle;
    };

    /**
     * This method removes all fireranges from units.
     *
     * @return void
     */
    this.removeFirerange = function () {
        $('.firerange').remove();
    };

    /**
     * This method renders a firerange circle around the unit.
     *
     * @param int x - current x-position of unit
     * @param int y - current y-position of unit
     *
     * @return void
     */
    this.renderFirerange = function (x, y) {
        if (this.isEnemy) {
            return;
        }

        var selectedWeapon = this.getSelectedWeapon();

        this.removeFirerange();

        var xPos = (x * 50 - (selectedWeapon.range * 50));
        var yPos = (y * 50 - (selectedWeapon.range * 50));
        var padding = selectedWeapon.range * 50;

        var mapObj = _map.getHtmlObject();
        mapObj.append('<div class="firerange" style="top: ' + yPos + 'px; left: ' + xPos + 'px; padding: ' + padding + 'px"></div>');
    };

    /**
     * Move the unit along the given way points.
     *
     * @param array wayPoints
     *
     * @return void
     */
    this.move = function (wayPoints) {
        if (true === _isAlreadyMoving) {
        	return;
        }

        _isAlreadyMoving = true;

    	this.stopMovingSprite();

        var unitObject = this.getHtmlEntity();
        if (this.getCurrentActionPoints() === 0) {
        	_isAlreadyMoving = false;
        	unitObject.trigger('goalReached');
            return false;
        }

        if (!wayPoints || wayPoints.length === 0) {
        	_isAlreadyMoving = false;
        	unitObject.trigger('goalReached');
            return false;
        }

        this.removeFirerange();

        this.startMovingSprite();

        var coordinates = wayPoints.shift();
        var x = coordinates.row;
        var y = coordinates.col;

        var angle = this.getAngle(x, y);
        unitObject.css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');

        unitObject.animate(
            {
                left: (x * 50),
                top: (y * 50)
            },
            this.getSpeed(),
            'linear',
            $.proxy(
                function () {
                    this.setCurrentActionPoints((this.getCurrentActionPoints() - 1));
                    
                    _map.updateUnitPosition(this, x, y);
                    
                    var mapObj = _map.getHtmlObject();
                    mapObj.trigger('updateControlPanel', [this]);
                    
                    _isAlreadyMoving = false;
                    this.renderFirerange(x, y);
                    
                    this.move(wayPoints);
                },
                this
            )
        );
    };

    /**
     * Start the attacking sprite in an interval to simulate attack feeling.
     *
     * @return void
     */
    this.startFiringSprite = function () {
        var value = 50;
        var unitObject = this.getHtmlEntity();

        _fireAction = window.setInterval(function () {
            var backgroundPositionString = unitObject.css('background-position');
            var backgroundPositionArray = backgroundPositionString.split(' ');
            var backgroundPositionX = parseInt(backgroundPositionArray[0], 10);
            var backgroundPositionY = parseInt(backgroundPositionArray[1], 10);

            if (backgroundPositionX === -350) {
                window.clearInterval(_fireAction);
                _fireAction = null;

                unitObject.trigger('attackEnemy');
                return;
            }

            backgroundPositionX -= value;

            unitObject.css('background-position', backgroundPositionX + 'px ' + backgroundPositionY +'px');
        }, 100);
    };

    /**
     * Attack an enemy.
     *
     * @param object enemy
     *
     * @return void
     */
    this.attack = function (enemy) {
    	if (true === _isAlreadyAttacking) {
        	return;
        }

    	_isAlreadyAttacking = true;

        var selectedWeapon = this.getSelectedWeapon();
        var unitObject = this.getHtmlEntity();

        if (this.getCurrentActionPoints() < selectedWeapon.actionPoints) {
        	_isAlreadyAttacking = false;
        	unitObject.trigger('stopFiring');
            return false;
        }

        if (false === _unitFacade.inRange(this, enemy)) {
        	_isAlreadyAttacking = false;
        	unitObject.trigger('stopFiring');
            return false;
        }

        var position = this.getPosition();
        var enemyPosition = enemy.getPosition();
        if (false === _unitFacade.inFireposition(position.x, position.y, enemyPosition.x, enemyPosition.y)) {
        	_isAlreadyAttacking = false;
        	unitObject.trigger('stopFiring');
            return false;
        }

        var angle = this.getAngle(enemyPosition.x, enemyPosition.y);
        unitObject.css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');

        this.startFiringSprite();

        var unique = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999);
        unitObject.unbind('attackEnemy').bind('attackEnemy', $.proxy(function () {
            var randValue = 25; //Math.floor(Math.random() * 40 + 10);
            var mapObj = _map.getHtmlObject();

            mapObj.append(
                '<div class="shot ' + unique + ' ' + (this.isEnemy ? 'enemy' : '') + '" style="position: absolute; -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + randValue) + 'px; left: ' + (position.x * 50 + randValue) + 'px;"></div>'
            );

            var shoot = $('.shot.' + unique, mapObj);
            shoot.animate(
                {
                    left: (enemyPosition.x * 50) + 25,
                    top: (enemyPosition.y * 50) + 25
                },
                selectedWeapon.firespeed,
                'linear',
                $.proxy(
                    function () {
                        shoot.remove();

                        enemy.setAmmo(enemy.getAmmo() - selectedWeapon.firepower);
                        if (enemy.getAmmo() <= 0) {
                            _map.removeUnit(enemyPosition.x, enemyPosition.y);
                        }
                        
                        this.setCurrentActionPoints(this.getCurrentActionPoints() - selectedWeapon.actionPoints);
                        
                        var mapObj = _map.getHtmlObject();
                        // if enemy attack user
                        mapObj.trigger('updateControlPanel', [enemy]);
                        // if user attack enemy
                        mapObj.trigger('updateControlPanel', [this]);
                        
                        _isAlreadyAttacking = false;
                        unitObject.trigger('stopFiring');
                    },
                    this
                )
            );
        }, this));
    };

    /**
     * Renders the unit on the map
     *
     * @return void
     */
    this.render = function () {
        _ammoQuotient = 100 / this.getAmmo();

        var position = this.getPosition();
        var html = [];
        html.push('<div id="' + this.getId() + '" ' +
                       'class="' + this.getType() + ' unit' + (this.isEnemy ? ' enemy' : '') + '" ' +
                       'style="top: ' + (position.y * 50) + 'px; left: ' + (position.x * 50) + 'px;">');
        html.push('</div>');

        var mapHtmlObject = _map.getHtmlObject();
        mapHtmlObject.append(html.join(''));

        var unitObject = $('#' + this.getId(), mapHtmlObject);
        this.setHtmlEntity(unitObject);
    };
};
