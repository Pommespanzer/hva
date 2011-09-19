var UnitView = Backbone.View.extend({
    /**
     * Tag of the unit
     */
    tagName: 'div',
    
    /**
     * init
     */
    initialize: function () {
        _.bindAll(
            this, 
            'render', 
            'select', 
            'move', 
            'attack', 
            'addFirerange',
            'updateFirerange',
            'removeFirerange',
            'destroy'
        );
        
        this.model.bind('change:select', this.select);
        this.model.bind('change:wayPoints', this.move);
        this.model.bind('attack', this.attack);
        this.model.bind('change:destroyed', this.destroy);
    },
    
    /**
     * This method displays the fire range of the current selected unit.
     *  
     * @return void
     */
    addFirerange: function () {
        var weapon = this.model.get('weapons')[0],
            padding = weapon.range * 50,
            position = this.model.getPosition(),
            x = (position.x * 50 - padding),
            y = (position.y * 50 - padding);

        $('#battlefield').append('<div id="fr-' + this.model.get('id') + '" class="firerange" style="top: ' + y + 'px; left: ' + x + 'px; padding: ' + padding + 'px"></div>');
    },
    
    /**
     * This method updates (repaint) the fire range of the current selected unit.
     * This happens if an unit moves or unit change the current weapon.
     * 
     * @param integer x
     * @param integer y
     * 
     * @return void
     */
    updateFirerange: function (x, y) {
        var weapon = this.model.get('weapons')[0],
            padding = weapon.range * 50;
            
        $('#fr-' + this.model.get('id')).css({left: (x - padding), top: (y - padding)});
    },
    
    /**
     * This method removes the fire range of the current selected unit.
     * This happens if the unit dies or the user select an other unit.
     *  
     * @return void
     */
    removeFirerange: function () {
        $('#fr-' + this.model.get('id')).remove();
    },
    
    /**
     * This method removes the unit from battlefield.
     * This happens if the unit dies.
     *  
     * @return void
     */
    destroy: function () {
        $(this.el).remove();
        
        if (this.model.isSelected()) {
            this.removeFirerange();
            actionPanelView.update(this.model);
        }
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
            // mark unit as selected
            $(this.el).addClass('selected');
            
            // render fire range
            this.addFirerange();
                        
            // update the action panel
            actionPanelView.update(unitModel);
            return;
        }
        
        $(this.el).removeClass('selected');
        this.removeFirerange();
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
            this.model.isBusy(false);
            unitModel.trigger('movingFinished');
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
                step: function (now, fx) {
                    var x = parseInt(fx.elem.style.left, 10),
                        y = parseInt(fx.elem.style.top, 10);
                    
                    _this.updateFirerange(x, y);
                },
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
     * This method animates the attack of two units.
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
            unit = $(this.el),
            angle = Mathematic.getAngle(position, enemyPosition),
            distance = Mathematic.getDistance(position, enemyPosition),
            _this = this,
            shoot;
        
        // render shot
        $('#battlefield').append(
            '<div class="' + selectedWeapon.name + ' ' + unique + ' ' + (this.model.get('isEnemy') ? 'enemy' : '') + '" style="position: absolute; -moz-transform: rotate(' + angle + 'deg); -webkit-transform: rotate(' + angle + 'deg); top: ' + (position.y * 50 + randValue) + 'px; left: ' + (position.x * 50 + 12) + 'px;"></div>'
        );
        
        // rotate unit in right position
        unit.css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');
        unit.css('-moz-transform', 'rotate(' + (angle + 90) + 'deg)');
        
        shoot = $('.' + selectedWeapon.name + '.' + unique);
        shoot.animate(
            {
                left: (enemyPosition.x * 50) + 12,
                top: (enemyPosition.y * 50) + 25
            },
            {
                duration: (distance / selectedWeapon.firespeed) * 10000, // t = s/v
                easing: 'linear',
                complete: function () {
                    shoot.remove();
                    
                    // decrement units action points
                    _this.model.setCurrentActionPoints(
                        _this.model.getCurrentActionPoints() - selectedWeapon.actionPoints
                    );
                    
                    // the enemy is hit and the armor has to be decremented
                    enemy.setCurrentArmor(enemy.getCurrentArmor() - selectedWeapon.firepower);
                    
                    // update the action panel for users selected unit
                    if (false === _this.model.get('isEnemy')) {
                        actionPanelView.update(_this.model);
                    } else {
                        actionPanelView.update(enemy);
                    }
                    
                    _this.model.isBusy(false);
                    _this.model.trigger('attackingFinished');
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