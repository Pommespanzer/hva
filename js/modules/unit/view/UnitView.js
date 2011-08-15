var UnitView = Backbone.View.extend({
    /**
     * Tag of the unit
     */
    tagName: 'div',
    
    /**
     * init
     */
    initialize: function () {
        _.bindAll(this, 'render', 'select', 'move', 'attack');
        this.model.bind('change:select', this.select);
        this.model.bind('change:wayPoints', this.move);
        this.model.bind('attack', this.attack);
    },
    
    /**
     * This method add or remove a class to highlight the unit as selected.
     * 
     * @param object unitModel - UnitModel
     * @param bool value - true or false
     * 
     * @return void
     */
    select: function (unitModel, value) {
        if (true === value) {
            $(this.el).addClass('selected');
            actionPanelView.update(unitModel);
            return;
        }
        
        $(this.el).removeClass('selected');
    },
    
    /**
     * This method animates the moving of an unit.
     * 
     * @param object unitModel - UnitModel
     * @param array wayPoints - array of position objects
     * 
     * @return void
     */
    move: function (unitModel, wayPoints) {
        unitModel.isBusy(true);
        
        // goal reached or not enough action points for moving -> quit
        if (wayPoints.length === 0 || unitModel.getCurrentActionPoints() === 0) {
            unitModel.isBusy(false);
            return;
        }
        
        var coordinates = wayPoints.shift(),
            x = coordinates.row,
            y = coordinates.col,
            _this = this,
            unit = $(this.el),
            startPosition = unitModel.getPosition(),
            goalPosition = {x: x, y: y},
            angle = Mathematic.getAngle(startPosition, goalPosition);
        
        // rotate unit in right position
        unit.css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');
        unit.css('-moz-transform', 'rotate(' + (angle + 90) + 'deg)');
        
        unit.animate({
                left: (x * 50),
                top: (y * 50)
            },
            {
                duration: unitModel.get('speed'),
                easing: 'linear',
                complete: function () {
                    // set new position
                    unitModel.setPosition(x, y);
                    
                    // decrement units action points
                    unitModel.setCurrentActionPoints(
                        unitModel.getCurrentActionPoints() - 1
                    );
            
                    // update the action panel
                    actionPanelView.update(unitModel);
                    
                    // repeat until no way points are left
                    _this.move(unitModel, wayPoints);
                }
            }
        );
    },
    
    /**
     * This method animates the attack of two units
     * 
     * @return void
     */
    attack: function () {
        var selectedWeapon = this.model.get('weapons')[0];
        
        // not enough action points -> quit
        if ((this.model.getCurrentActionPoints() - selectedWeapon.actionPoints) < 0) {
            return;
        }
        
        this.model.isBusy(true);        
        
        var unique = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999),
            randValue = 25,
            position = this.model.getPosition(),
            enemy = this.model.get('enemy'),
            enemyPosition = enemy.getPosition(),
            angle = Mathematic.getAngle(position, enemyPosition),
            _this = this;
        
        // render shot
        $('#battlefield').append(
            '<div class="' + selectedWeapon.name + ' ' + unique + ' ' + (this.model.get('isEnemy') ? 'enemy' : '') + '" style="position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + randValue) + 'px; left: ' + (position.x * 50 + 12) + 'px;"></div>'
        );
        
        var shoot = $('.' + selectedWeapon.name + '.' + unique);
        shoot.animate(
            {
                left: (enemyPosition.x * 50) + 12,
                top: (enemyPosition.y * 50) + 25
            },
            {
                duration: selectedWeapon.firespeed,
                easing: 'linear',
                complete: function () {
                    shoot.remove();
                    
                    // decrement units action points
                    _this.model.setCurrentActionPoints(
                        _this.model.getCurrentActionPoints() - selectedWeapon.actionPoints
                    );
                    
                    // update the action panel
                    actionPanelView.update(_this.model);
                    
                    _this.model.isBusy(false);
                }
            }
        );
    },
    
    /**
     * This method renders the unit on the battlefield.
     * 
     * @return void
     */
    render: function () {
        this.el.id = this.model.get('id');
        this.el.className = this.model.get('type') + ' unit';
        
        if (this.model.get('isEnemy')) {
            this.el.className += ' enemy';
        }

        var position = this.model.getPosition();
        this.el.style.left = (position.x * 50) + 'px';
        this.el.style.top = (position.y * 50) + 'px';

        $(this.el).html('&nbsp;');
        
        return this;
    }
});