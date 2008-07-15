/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Martin Wittemann (martinwittemann)
     * Jonathan Rass (jonathan_rass)

************************************************************************ */

/**
 * @appearance tabview
 */
qx.Class.define("qx.ui.tabview.TabView",
{
  extend : qx.ui.core.Widget,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
  construct : function(barPosition)
  {
    this.base(arguments);

    this._createChildControl("bar");
    this._createChildControl("pane");

    // Create manager
    var mgr = this._manager = new qx.ui.form.RadioGroup;
    mgr.setWrap(false);
    mgr.addListener("changeValue", this._onRadioChangeValue, this);

    // Initialize bar position
    if (barPosition == null || barPosition === "top") {
      this.initBarPosition();
    } else if (barPosition) {
      this.setBarPosition(barPosition);
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "tabview"
    },

    /**
     * This property defines on which side of the TabView the bar should be positioned.
     */
    barPosition :
    {
      check : ["left", "right", "top", "bottom"],
      init : "top",
      apply : "_applyBarPosition"
    },

    /**
     * The selected page inside the TabView.
     */
    selected :
    {
      check : "qx.ui.tabview.Page",
      apply : "_applySelected",
      event : "changeSelected"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createChildControlImpl : function(id)
    {
      var control;

      switch(id)
      {
        case "bar":
          control = new qx.ui.container.SlideBar();
          control.setZIndex(10);
          this._add(control);
          break;

        case "pane":
          control = new qx.ui.container.Stack;
          control.setZIndex(5);
          this._add(control, {flex:1});
          break;
      }

      return control || this.base(arguments, id);
    },






    /*
    ---------------------------------------------------------------------------
      CHILDREN HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a page to the tabview including its needed button
     * (contained in the page). Every new added page will be automatically
     * checked and shown to the user.
     *
     * @param page {qx.ui.tabview.Page} The page which should be added.
     */
    add: function(page)
    {
      // Exclude page
      page.exclude();

      // Add the button to the bar
      this._getChildControl("bar").add(page.getButton());

      // Add the button to the radio manager
      this._manager.add(page.getButton());

      // Add the page to the pane
      this._getChildControl("pane").add(page);

      // Add state to pagev
      page.addState(this.__barPositionToState[this.getBarPosition()]);
    },


    /**
     * Removes a page (and its corresponding button) from the TabView.
     *
     * @param page {qx.ui.tabview.Page} The page to be removed.
     */
    remove: function(page)
    {
      var pane = this._getChildControl("pane");
      var bar = this._getChildControl("bar");
      var manager = this._manager;

      var index = pane.indexOf(page);
      var children = pane.getChildren();

      // Try to select next page
      if (index < children.length-1) {
        this.showPage(children[index+1]);
      } else if (index > 0) {
        this.showPage(children[index-1]);
      }

      // Remove the button from the bar
      bar.remove(page.getButton());

      // Remove the button from the radio manager
      manager.remove(page.getButton());

      // Remove state from page
      page.removeState(this.__barPositionToState[this.getBarPosition()]);
    },


    /**
     * Returns TabView's children widgets.
     *
     * @type member
     * @return {Array} List of children.
     */
    getChildren : function() {
      return this._getChildControl("bar").getChildren();
    },





    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    /** {Map} Maps the bar position to an appearance state */
    __barPositionToState :
    {
      top : "barTop",
      right : "barRight",
      bottom : "barBottom",
      left : "barLeft"
    },


    /**
     * Apply method for the placeBarOnTop-Property.
     *
     * Passes the desired value to the layout of the tabview so
     * that the layout can handle it.
     * It also sets the states to all buttons so they know the
     * position of the bar.
     *
     * @param value {boolean} The new value.
     * @param old {boolean} The old value.
     */
    _applyBarPosition : function(value, old)
    {
      var bar = this._getChildControl("bar");
      var pane = this._getChildControl("pane");

      var horizontal = value == "left" || value == "right";
      var reversed = value == "right" || value == "bottom";

      var layoutClass = horizontal ? qx.ui.layout.HBox : qx.ui.layout.VBox;

      var layout = this._getLayout();
      if (layout && layout instanceof layoutClass) {
        // pass
      } else {
        this._setLayout(layout = new layoutClass);
      }

      // Update reversed
      layout.setReversed(reversed);

      // Sync orientation to bar
      bar.setOrientation(horizontal ? "vertical" : "horizontal");

      // Read children
      var children = this.getChildren();

      // Toggle state to bar
      if (old)
      {
        var oldState = this.__barPositionToState[old];

        // Update bar
        bar.removeState(oldState);

        // Update pages
        for (var i=0, l=children.length; i<l; i++) {
          children[i].removeState(oldState);
        }
      }

      if (value)
      {
        var newState = this.__barPositionToState[value];

        // Update bar
        bar.addState(newState);

        // Update pages
        for (var i=0, l=children.length; i<l; i++) {
          children[i].addState(newState);
        }
      }
    },


    // property apply
    _applySelected : function(value, old)
    {
      this._getChildControl("pane").setSelected(value);
      this._manager.setSelected(value.getButton());
    },






    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for the change of the selected item of the radio group.
     * @param e {qx.event.type.Data} The data event
     */
    _onRadioChangeValue : function(e)
    {
      var pane = this._getChildControl("pane");
      var page = qx.core.ObjectRegistry.fromHashCode(e.getData());

      pane.setSelected(page);
    }
  }
});
