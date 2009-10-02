/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's left-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * This class has been moved to {@link qx.ui.core.scroll.ScrollBar}
 * 
 * @deprecated This class has been moved to qx.ui.core.scroll.ScrollBar
 */
qx.Class.define("qx.ui.core.ScrollBar",
{
  extend : qx.ui.core.scroll.ScrollBar,

  construct : function(orientation)
  {
    this.base(arguments, orientation);
    qx.log.Logger.deprecatedClassWarning(
      qx.ui.core.ScrollBar,
      "This class has been moved to qx.ui.core.scroll.ScrollBar"
    );
  }
});