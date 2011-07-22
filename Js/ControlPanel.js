var ControlPanel = new function () {
    var _ammoSection = null;
    var _actionPointSection = null;
    var _weaponSection = null;
    
    this.init = function () {
        _ammoSection = $('.ammo', $('#control-panel'));
        _actionPointSection = $('.actionPoints', $('#control-panel'));
        _weaponSection = $('.weapon', $('#control-panel'));
    };
    
    this.displayAll = function (unit) {
        var selectedUnit = Map.getSelectedUnit();
        
        if (null === selectedUnit || selectedUnit.getId() !== unit.getId()) {
            return;
        }
        
        this.displayAmmo(unit);
        this.displayMove(unit);
    };
    
    this.displayAmmo = function (unit) {
        if (unit.getAmmo() <= 0) {
            _ammoSection.addClass('hide');
            _actionPointSection.addClass('hide');
            _weaponSection.addClass('hide');
            return;
        }
        _ammoSection.removeClass('hide');
        _actionPointSection.removeClass('hide');
        _weaponSection.removeClass('hide');
        
        var newWidth = unit.getAmmo() * unit.getAmmoQuotient();
        
        var currentAmmo = $('.current-ammo', _ammoSection);
        currentAmmo.css('width', newWidth + '%');
    };
    
    this.displayMove = function (unit) {
        var onePercent = 100 / unit.getTotalActionPoints();
        var newWidth = onePercent * unit.getCurrentActionPoints();
        
        var currentMove = $('.current-actionPoints', _actionPointSection);
        currentMove.css('width', newWidth + '%');
    };
}();