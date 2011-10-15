var UnitModel = Backbone.Model.extend({
    setId: function (id) {
        this.set({id: id});
    },

    setType: function (type) {
        this.set({type: type});
    },

    setPosition: function (x, y) {
        this.set({position: {x: x, y: y}});
    },

    setBackgroundPosition: function (x, y) {
        this.set({backgroundPosition: {x: x, y: y}});
    },

    getPosition: function () {
        return this.get('position');
    },

    setOrder: function (order) {
        this.set({order: order});
    },

    isEnemy: function (isEnemy) {
        this.set({isEnemy: isEnemy});
    },

    setSounds: function (sounds) {
        this.set({sounds: sounds});
    },

    setActionPoints: function (actionPoints) {
        this.set({totalActionPoints: actionPoints});
        this.set({currentActionPoints: actionPoints});
    },

    setCurrentActionPoints: function (actionPoints) {
        this.set({currentActionPoints: actionPoints});
    },

    getCurrentActionPoints: function () {
        return this.get('currentActionPoints');
    },

    getTotalActionPoints: function () {
        return this.get('totalActionPoints');
    },

    setArmor: function (armor) {
        this.set({totalArmor: armor});
        this.set({currentArmor: armor});
    },

    setCurrentArmor: function (armor) {
        this.set({currentArmor: armor});

        if (armor <= 0) {
            this.set({remove: true});
        }
    },

    getTotalArmor: function () {
        return this.get('totalArmor');
    },

    getCurrentArmor: function () {
        return this.get('currentArmor');
    },

    setWeapons: function (weapons) {
        if (weapons.length === 0) {
            return;
        }

        var i,
            weaponObj,
            weaponsArray = [];

        for (i = 0; i < weapons.length; i += 1) {
            weaponObj = new weapons[i]({
                model: new WeaponModel()
            });
            weaponsArray.push(weaponObj);
        }

        this.set({weapons: weaponsArray});
        this.setSelectedWeapon(weaponsArray[0]);
    },

    setSelectedWeapon: function (weapon) {
        this.set({selectedWeapon: weapon});
    },

    setSpeed: function (speed) {
        this.set({speed: speed});
    },

    select: function () {
        this.set({select: true});
    },

    unselect: function () {
        this.set({select: false});
    },

    isSelected: function () {
        return this.get('select');
    },

    move: function (wayPoints) {
        this.set({wayPoints: wayPoints});
    },

    attack: function (enemy) {
        this.set({enemy: enemy});
        this.trigger('attack');
    },

    isBusy: function (value) {
        this.set({isBusy: value});
    },

    addInventoryItem: function (inventoryModel) {
        var currentInventory = this.get('inventory');

        if (!currentInventory) {
            currentInventory = [];
        }

        currentInventory.push(inventoryModel);
        this.set({'inventory': currentInventory});
        actionPanelView.update(this);
    },

    useInventoryItem: function (inventoryItemId) {
        var inventory = this.get('inventory'),
            i;

        for (i = 0; i < inventory.length; i += 1) {
            if (inventory[i].get('id') !== inventoryItemId) {
                continue;
            }

            inventory[i].use(this);
            break;
        }
    },

    removeInventoryItem: function (inventoryItemId) {
        var inventory = this.get('inventory'),
            i;

        for (i = 0; i < inventory.length; i += 1) {
            if (inventory[i].get('id') === inventoryItemId) {
                inventory.splice(i, 1);
                break;
            }
        }

        this.set({'inventory': inventory});
        actionPanelView.update(this);
    },

    pickUp: function (inventoryModel) {
        this.addInventoryItem(inventoryModel);
        inventoryModel.remove();
    }
});
