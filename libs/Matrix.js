/* ===============================================================================================================================================
   Matrix

   Description
   These functions get the object's scale, rotation, or shear value from the matrix.

   Usage
   You can include this script or copy the function to use it.

   Notes
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */


/**
 * Get horizontal scale.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {number} Horizontal scale.
 */
function getHorizontalScale(matrix) {
    var ma = matrix.mValueA;
    var mb = matrix.mValueB;
    return Math.sqrt(Math.pow(ma, 2) + Math.pow(mb, 2));
}


/**
 * Get vertical scale.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {number} Vertical scale.
 */
function getVerticalScale(matrix) {
    var mc = matrix.mValueC;
    var md = matrix.mValueD;
    return Math.sqrt(Math.pow(mc, 2) + Math.pow(md, 2));
}


/**
 * Get rotation value.
 * @param {Object} item Object with matrix property.
 * @returns {number} Rotation value.
 */
function getRotation(item) {
    var rx = getRotationX(item.matrix);
    return (item.typename == 'PlacedItem') ? rx * -1 : rx;
}


/**
 * Get rotation value.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {number} Rotation value.
 */
function getRotationX(matrix) {
    var ma = matrix.mValueA;
    var mb = matrix.mValueB;
    var rad = Math.atan2(mb, ma);
    var deg = rad * 180 / Math.PI;
    return deg;
}


/**
 * Get rotation value.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {number} Rotation value.
 */
function getRotationY(matrix) {
    var mc = matrix.mValueC;
    var md = matrix.mValueD;
    var rad = Math.atan2(mc, md);
    var deg = rad * 180 / Math.PI;
    return deg;
}


/**
 * Get shear value.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {number} Shear value.
 */
function getShear(matrix) {
    var rx = getRotationX(matrix);
    var ry = getRotationY(matrix);
    var total = rx + ry;
    var shear = (total > 0) ? total - 180 : total + 180;
    return shear;
}


/**
 * Determine the inversion in the x-axis direction.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {boolean} If true, it is inverted in the x-axis direction.
 */
function isReflectedX(matrix) {
    var ma = matrix.mValueA;
    return ma > 0 ? false : true;
}


/**
 * Determine the inversion in the y-axis direction.
 * @param {Matrix} matrix The transformation matrix object.
 * @returns {boolean} If true, it is inverted in the y-axis direction.
 */
function isReflectedY(matrix) {
    var md = matrix.mValueD;
    return md > 0 ? true : false;
}
