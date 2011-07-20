var UserInterface = function() {
    var _map = null;
    var _selectedUnit = null;
    var _battlefieldMap = $('#battlefield');
    var _unitFacade = null;

    var _addUnits = function() {
    	for (var i = 0; i < 6; i++) {
	        var date = new Date();
	        var orderId = Math.floor(Math.random() * 9999999999) + 'MG-Unit';

	        var unit = new Unit(orderId, 'MG-Unit', _map, _unitFacade);
	        unit.setType('unit-human-mg');
	        unit.setAmmo(1000);
	        unit.setActionPoints(15);
	        unit.setSpeed(500);
	        unit.addWeapon({
	        	selected: true,
	        	name: 'MG',
	        	range: 5,
	        	actionPoints: 2,
	        	firepower: 100,
	        	firespeed: 200
	        });

	        _map.addUnit(unit, i, 0);
        }
    };

    var _handleClickOnBattlefield = function(event) {
        var coordinates = _map.getPosition(event.clientX, event.clientY);

        var unit = _map.getUnit(coordinates.x, coordinates.y);
        var hindrance = _map.getHindrance(coordinates.x, coordinates.y);

        if (hindrance) {
        	return;
        }

        if (unit !== false && unit.isEnemy === true) {
            // user wants to attack an enemy
            if (_selectedUnit !== null) {
                _battlefieldMap.trigger('attack', [unit]);
            }

            return;
        }

        // free place on battlefield
        if (false === unit) {
            if (_selectedUnit !== null) {
                _battlefieldMap.trigger('move', [coordinates]);
            }
            return;
        }

        // remove all selections on battlefield
        var selectedUnit = $('.selected', _battlefieldMap);
        if (selectedUnit.length !== 0) {
            selectedUnit.removeClass('selected');
            selectedUnit.css('background-position', '');
        }

        _selectedUnit = unit;

        // mark clicked unit on battlefield
        $('#' + unit.getId()).addClass('selected');

        _selectedUnit.renderFirerange(coordinates.x, coordinates.y);

    };

    this.initEventListeners = function () {
    	_battlefieldMap.bind('lock.userEvents', function() {
    		$('.finish-turn').hide();
        	_battlefieldMap.unbind('click.bf');
        });

        _battlefieldMap.bind('unlock.userEvents', function() {
        	// to avoid multi bindings
        	_battlefieldMap.trigger('lock.userEvents');

        	_battlefieldMap.bind('click.bf', _handleClickOnBattlefield);
        	$('.finish-turn').show();
        });

        $('.finish-turn').bind('click', $.proxy(_ki.init, _ki));

        _battlefieldMap.bind('move', function(event, coordinates) {
    		var position  = _selectedUnit.getPosition();
    		var wayPoints = _unitFacade.getWaypoints(position.x, position.y, coordinates.x, coordinates.y);

    		if (!wayPoints) {
    			return false;
    		}

    		_selectedUnit.move(wayPoints);
        });

        _battlefieldMap.bind('attack', function(event, enemy) {
        	_selectedUnit.attack(enemy);
        });
    };

    this.init = function() {
    	// MAP
        _map = new Map();
        _map.init();

        _unitFacade = new UnitFacade(_map);

        // KI
        _ki = new ki(_unitFacade, _map);

        // add users units...
        _addUnits();

        this.initEventListeners();

        // add hindrances
        for (var i = 0; i < 100; i++) {
        	var x = Math.random() * 20;
            var y = Math.random() * 20;

        	_map.addHindrance(x, y);
        }

        _battlefieldMap.trigger('unlock.userEvents');
    };
};
