var UserInterface = function() {
    var _battlefieldMap = $('#battlefield');

    var _addUnits = function() {
        for (var i = 0; i < 6; i++) {
            var date = new Date();
            var orderId = Math.floor(Math.random() * 9999999999) + 'MG-Unit';

            if (i === 3) {
                var unit = new Unit(orderId, 'Bazooka-Unit');
                unit.setType('unit-human-bazooka');
                unit.setAmmo(1000);
                unit.setActionPoints(15);
                unit.setSpeed(500);
                unit.addWeapon({
                    selected: true,
                    name: 'Bazooka',
                    range: 7,
                    actionPoints: 5,
                    firepower: 400,
                    firespeed: 300
                });
            } else {
                var unit = new Unit(orderId, 'MG-Unit');
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
            }                
                unit.setSounds({
                    move: 'move.wav',
                    attack: 'ak47.wav',
                    die: 'aaaaagh.wav'
                });

            Map.addUnit(unit, i, 0);
        }
    };
    
    var _addObstacles = function () {
        for (var i = 0; i < 100; i++) {
            var x = Math.random() * 20;
            var y = Math.random() * 20;

            Map.addObstacle(x, y);
        }
    };

    var _handleClickOnBattlefield = function(event) {
        var coordinates = Map.getPosition(event.clientX, event.clientY);

        var selectedUnit = Map.getSelectedUnit();
        var unit = Map.getUnit(coordinates.x, coordinates.y);
        var hindrance = Map.getObstacle(coordinates.x, coordinates.y);

        if (hindrance) {
            return;
        }

        if (unit !== false && unit.isEnemy === true) {
            // user wants to attack an enemy
            if (selectedUnit !== null) {
                _battlefieldMap.trigger('attack', [unit]);
            }

            return;
        }

        // free place on battlefield
        if (false === unit) {
            if (selectedUnit !== null) {
                _battlefieldMap.trigger('move', [coordinates]);
            }
            return;
        }

        // remove all selections on battlefield
        var selectedUnitObject = $('.selected', _battlefieldMap);
        if (selectedUnitObject.length !== 0) {
            selectedUnitObject.removeClass('selected');
            selectedUnitObject.css('background-position', '');
        }

        Map.setSelectedUnit(unit);

        // mark clicked unit on battlefield
        $('#' + unit.getId()).addClass('selected');

        unit.renderFirerange(coordinates.x, coordinates.y);
        ControlPanel.displayAll(unit);
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

        $('.finish-turn').bind('click', $.proxy(Ai.init, Ai));

        _battlefieldMap.bind('move', function(event, coordinates) {
            var selectedUnit = Map.getSelectedUnit();
            var position  = selectedUnit.getPosition();
            var wayPoints = UnitFacade.getWaypoints(position.x, position.y, coordinates.x, coordinates.y);

            if (!wayPoints) {
                return false;
            }

            selectedUnit.move(wayPoints);
        });

        _battlefieldMap.bind('attack', function(event, enemy) {
            var selectedUnit = Map.getSelectedUnit();
            selectedUnit.attack(enemy);
        });
    };

    this.init = function() {
        // MAP
        Map.init();

        // Control Panel
        ControlPanel.init();

        // add users units...
        _addUnits();

        // add obstacles
        _addObstacles();

        this.initEventListeners();

        _battlefieldMap.trigger('unlock.userEvents');
    };
};
