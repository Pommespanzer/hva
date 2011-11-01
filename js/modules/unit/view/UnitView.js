var UnitView = Backbone.View.extend({
    /**
     * Tag of the unit
     */
    tagName: 'div',

    /**
     * Move-Sprite-Action to simulate moving
     */
    movingSpriteAction: null,

    /**
     * Attack-Sprite-Action to simulate attacking
     */
    attackingSpriteAction: null,

    /**
     * Node list of the audio player
     */
    audioplayer: null,

    /**
     * map object
     */
    battlefield: null,

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
            'changeWeapon',
            'destroy',
            'changeArmor'
        );

        this.battlefield = $('#battlefield');

        this.model.bind('change:select', this.select);
        this.model.bind('change:wayPoints', this.move);
        this.model.bind('attack', this.attack);
        this.model.bind('change:remove', this.destroy);
        this.model.bind('change:selectedWeapon', this.changeWeapon);
        this.model.bind('change:currentArmor', this.changeArmor);

        this.audioplayer = $('#js-sound-' + (this.model.get('isEnemy') ? 'enemy' : 'unit'));
    },

    /**
     * This method is called if the user changes the weapon of an unit.
     *
     * @param Object UnitModel
     * @param Object newWeapon - new selected weapon
     *
     * @return void
     */
    changeWeapon: function (unitModel, newWeapon) {
        var prevWeapon = unitModel.get('previousWeapon');
        prevWeapon.model.backToHolster();

        newWeapon.model.setPosition(unitModel.getPosition());
        newWeapon.model.use();

        actionPanelView.update(unitModel);
    },

    /**
     * This method removes the unit from battlefield.
     * This happens if the unit dies.
     *
     * @return void
     */
    destroy: function () {
        var audiofiles = this.model.get('sounds'),
            currentWeapon = this.model.get('selectedWeapon'),
            medipackModel,
            medipackView;

        this.audioplayer[0].src = audiofiles.die;

        $(this.el).remove();

        if (this.model.isSelected()) {
            currentWeapon.model.backToHolster();
            actionPanelView.update(this.model);
        }

        medipackModel = new InventoryItemModel();
        medipackModel.generateId(this.model.getPosition());
        medipackModel.setName('medipack');
        medipackView = new MedipackView({
            model: medipackModel
        });

        medipackView.render();

        this.battlefield.trigger('addInventoryItem', [medipackModel]);
    },

    /**
     * This method add or remove a class to highlight the unit as selected.
     *
     * @param object unitModel - UnitModel
     * @param bool value - true (selected) or false (unselected)
     *
     * @return void
     */
    select: function (unitModel, value) {
        var currentWeapon = this.model.get('selectedWeapon');

        if (true === value) {
            // mark unit as selected
            $('.unit', this.el).addClass('selected');

            // load weapon
            currentWeapon.model.setPosition(this.model.getPosition());
            currentWeapon.model.use();

            // update the action panel
            actionPanelView.update(unitModel);
            return;
        }

        $('.unit', this.el).removeClass('selected');
        // remove weapon
        currentWeapon.model.backToHolster();
    },

    /**
     * Start the moving sprite in an interval to simulate moving feeling.
     *
     * @return void
     */
    startMovingSprite: function () {
        // sprite already in progress
        if (null !== this.movingSpriteAction) {
            return;
        }

        var value = 25,
            currentPosition = -50,
            unit = $('.unit', this.el),
            audiofiles = this.model.get('sounds'),
            _this = this;

        this.movingSpriteAction = window.setInterval(function () {
            if (currentPosition === -100) {
                // play the audio file here, because of the good delay
                _this.audioplayer[0].src = audiofiles.move;
                value = 25;
            }

            if (currentPosition === 0) {
                // play the audio file here, because of the good delay
                _this.audioplayer[0].src = audiofiles.move;
                value = -25;
            }

            currentPosition += value;

            unit.css('background-position', currentPosition + 'px 0');
        }, 100);
    },

    /**
     * This method is called after ending moving.
     *
     * @return void
     */
    stopMovingSprite: function () {
        if (this.movingSpriteAction === null) {
            return;
        }

        var unit = $('.unit', this.el);
        unit.css('background-position', '-100px 0');
        this.model.setBackgroundPosition(-100, 0);

        window.clearInterval(this.movingSpriteAction);
        this.movingSpriteAction = null;
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
        // interruption by user
        if (true === unitModel.get('interrupted')) {
            unitModel.setInterrupted(false);
            unitModel.isBusy(false);
            unitModel.move(false);
            this.stopMovingSprite();
            return;
        }

        // REMOVE ME
        if (unitModel.get('type') === 'defense-tower') {
            unitModel.isBusy(false);
            unitModel.trigger('movingFinished');
            return;
        }

        unitModel.isBusy(true);

        this.startMovingSprite();

        // goal reached or not enough action points for moving -> quit
        if (!wayPoints || wayPoints.length === 0 || unitModel.getCurrentActionPoints() === 0) {
            unitModel.isBusy(false);
            this.stopMovingSprite();
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
            inventoryModel,
            angle = Mathematic.getAngle(startPosition, goalPosition),
            currentWeapon = unitModel.get('selectedWeapon');

        // rotate unit in right position
        $('.unit', unit).css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');
        $('.unit', unit).css('-moz-transform', 'rotate(' + (angle + 90) + 'deg)');

        unit.animate(
            {
                'left': (x * 25),
                'top': (y * 25)
            },
            {
                duration: unitModel.get('speed'),
                easing: 'linear',
                step: function (now, fx) {
                    var x = parseInt(fx.elem.style.left, 10),
                        y = parseInt(fx.elem.style.top, 10);

                    currentWeapon.model.setPosition({x: x, y: y});
                },
                complete: function () {
                    // set new position
                    unitModel.setPosition(x, y);

                    // decrement units action points
                    unitModel.setCurrentActionPoints(
                        unitModel.getCurrentActionPoints() - 1
                    );

                    // update the action panel for users selected unit
                    actionPanelView.update(unitModel);

                    // repeat until no way points are left
                    _this.move(unitModel, wayPoints);

                    // check if unit stands on an inventory
                    inventoryModel = mapView.inventoryCollection.get('inventory-' + x + '_' + y);
                    if (inventoryModel) {
                        unitModel.pickUp(inventoryModel);
                    }
                }
            }
        );
    },

    /**
     * This method is called to transform unit in to attack position via sprites.
     * Than attack the enemy by calling the private method _attack().
     *
     * @return void
     */
    attack: function () {
console.log('+++ attack animation +++');
        // sprite already in progress
        if (null !== this.attackingSpriteAction) {
console.log('FAIL. Attack animation still in progress');
            return;
        }

        var value = 25,
            unit = $(this.el),
            backgroundPosition = this.model.get('backgroundPosition'),
            position = this.model.getPosition(),
            enemy = this.model.get('enemy'),
            enemyPosition = enemy.getPosition(),
            angle = Mathematic.getAngle(position, enemyPosition);

        // rotate unit in right position
        $('.unit', unit).css('-webkit-transform', 'rotate(' + (angle + 90) + 'deg)');
        $('.unit', unit).css('-moz-transform', 'rotate(' + (angle + 90) + 'deg)');

        // enemy out of range? -> quit
        if (false === mapView.model.isEnemyInRange(this.model, enemy)) {
            this.model.isBusy(false);
            this.model.trigger('attackingFinished');
            return;
        }

        // check if unit has a free shot line
        if (false === mapView.model.isShootingPossible(mapView.obstacleCollection, position, enemyPosition)) {
            this.model.isBusy(false);
            this.model.trigger('attackingFinished');
            return;
        }

        // REMOVE ME LATER IN CHILD CLASS OR WHAT EVER
        if (this.model.get('type') === 'defense-tower') {
            return this._attack();
        }

        this.attackingSpriteAction = window.setInterval($.proxy(function () {
console.log('OK. Attacking sprite change');

            if (backgroundPosition.x === -175) {
console.log('OK. Now start shooting');
                window.clearInterval(this.attackingSpriteAction);
                this.attackingSpriteAction = null;

                this._attack();
                return;
            }
            backgroundPosition.x -= value;
            this.model.setBackgroundPosition(backgroundPosition.x, backgroundPosition.y);
            $('.unit', unit).css('background-position', backgroundPosition.x + 'px ' + backgroundPosition.y + 'px');
        }, this), 100);
    },

    /**
     * This method animates the attack of two units.
     *
     * @return void
     */
    _attack: function () {
        var selectedWeapon = this.model.get('selectedWeapon'),
            unique,
            randValue,
            position,
            enemy,
            enemyPosition,
            angle,
            distance,
            _this,
            audiofiles,
            shoot;

        // not enough action points -> quit
        if ((this.model.getCurrentActionPoints() - selectedWeapon.model.get('actionPoints')) < 0) {
            this.model.isBusy(false);
            this.model.trigger('attackingFinished');
            return;
        }

        // if unit dies while attacking process -> quit
        if (this.model.get('currentArmor') <= 0) {
            this.model.isBusy(false);
            this.model.trigger('attackingFinished');
            return;
        }

        this.model.isBusy(true);

        unique = Math.ceil(new Date().getMilliseconds() * Math.random() * 99999999999);
        randValue = 25;
        position = this.model.getPosition();
        enemy = this.model.get('enemy');
        enemyPosition = enemy.getPosition();
        angle = Mathematic.getAngle(position, enemyPosition);
        distance = Mathematic.getDistance(position, enemyPosition);
        _this = this;
        audiofiles = this.model.get('sounds');
        shoot = selectedWeapon.renderShot(position, angle, this.model.get('isEnemy'));

        this.audioplayer[0].src = audiofiles.attack;

        shoot.animate(
            {
                left: (enemyPosition.x * 25) + 6,
                top: (enemyPosition.y * 25) + 12
            },
            {
                duration: selectedWeapon.model.get('firespeed'),
                easing: 'linear',
                complete: function () {
                    shoot.remove();

                    // decrement units action points
                    _this.model.setCurrentActionPoints(
                        _this.model.getCurrentActionPoints() - selectedWeapon.model.get('actionPoints')
                    );

                    // the enemy is hit and the armor has to be decremented
                    enemy.setCurrentArmor(enemy.getCurrentArmor() - selectedWeapon.model.get('firepower'));

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

    changeArmor: function (unitModel) {
        var armorQuotient = 100 / unitModel.getTotalArmor(),
            newWidthArmor = unitModel.getCurrentArmor() * armorQuotient;

        $('.js-current-armor', $('#' + unitModel.get('id')).parent()).css('width', newWidthArmor + '%');
    },

    /**
     * This method renders the unit on the battlefield.
     *
     * @return void
     */
    render: function () {
        //this.el.id = this.model.get('id');
        this.el.className = 'foo';
        //this.el.className = this.model.get('type') + ' unit';
        /*
        if (this.model.get('isEnemy')) {
            this.el.className += ' enemy';
        }
        */

        var position = this.model.getPosition(),
            className = this.model.get('type') + ' unit';

        if (this.model.get('isEnemy')) {
            className += ' enemy';
        }

        this.el.style.left = (position.x * 25) + 'px';
        this.el.style.top = (position.y * 25) + 'px';

        $(this.el).html('<div id="' + this.model.get('id') + '" class="' + className + '"></div><div class="js-max-armor max-armor"><div class="js-current-armor current-armor"></div></div>');

        return this;
    }
});
