var ControlPanel = new function () {
    'use strict';
    
    /**
     * Ammo section of the unit-status-section.
     * 
     * @var object _ammoSection
     */
    var _ammoSection = null;
    
    /**
     * Action point section of the unit-status-section.
     * 
     * @var object _actionPointSection
     */
    var _actionPointSection = null;
    
    /**
     * HTML part of the current ammo of a selected unit.
     * 
     * @var object _currentAmmo
     */
    var _currentAmmo = null;
    
    /**
     * HTML part of the current action points of a selected unit.
     * 
     * @var object _currentActionPoints
     */
    var _currentActionPoints = null;
    
    /**
     * Init stuff
     */
    this.init = function () {
        _ammoSection = $('.ammo', $('#control-panel'));
        _actionPointSection = $('.actionPoints', $('#control-panel'));
        
        _currentAmmo = $('.current-ammo', _ammoSection);
        _currentActionPoints = $('.current-actionPoints', _actionPointSection);
    };
    
    /**
     * Hide the status section. It contains hiding the ammo and action point
     * section as well.
     * 
     * @return void
     */
    this.hideStatusSection = function () {
        _ammoSection.addClass('hide');
        _actionPointSection.addClass('hide');
    };
    
    /**
     * Show the status section. It contains showing the ammo and action point
     * section as well.
     * 
     * @return void
     */
    this.showStatusSection = function () {
        _ammoSection.removeClass('hide');
        _actionPointSection.removeClass('hide');
    };
    
    /**
     * Calculate and render the current status of the ammo and the action points
     * of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayAll = function (unit) {
        var selectedUnit = Map.getSelectedUnit();
        
        if (null === selectedUnit || selectedUnit.getId() !== unit.getId()) {
            return;
        }
        
        this.displayAmmo(unit);
        this.displayActionPoints(unit);
    };
    
    /**
     * Calculate and render the current ammo of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayAmmo = function (unit) {
        if (unit.getAmmo() <= 0) {
            this.hideStatusSection();
            return;
        }
        
        this.showStatusSection();
        
        var newWidth = unit.getAmmo() * unit.getAmmoQuotient();
        _currentAmmo.css('width', newWidth + '%');
    };
    
    /**
     * Calculate and render the current action points of the selected unit.
     * 
     * @param object unit - Unit-class
     * 
     * @return void
     */
    this.displayActionPoints = function (unit) {
        var onePercent = 100 / unit.getTotalActionPoints();
        var newWidth = onePercent * unit.getCurrentActionPoints();
        _currentActionPoints.css('width', newWidth + '%');
    };
}();