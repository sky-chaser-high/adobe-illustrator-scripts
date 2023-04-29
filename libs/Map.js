/* ===============================================================================================================================================
   Map

   Description
   This script summarizes functions related to maps.

   Usage
   You can include this script or copy the function to use it.

   Notes
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */


/**
 * Re-maps a number from one range to another.
 * @param {number} value The incoming value to be converted.
 * @param {number} start1 Lower bound of the value's current range.
 * @param {number} stop1 Upper bound of the value's current range.
 * @param {number} start2 Lower bound of the value's target range.
 * @param {number} stop2 Upper bound of the value's target range.
 * @returns {number} Remapped number.
 */
function map(value, start1, stop1, start2, stop2) {
    var distance1 = stop1 - start1;
    var value1 = value - start1;

    var ratio = value1 / distance1;

    var distance2 = stop2 - start2;
    var value2 = distance2 * ratio;

    return start2 + value2;
}


/**
 * Normalizes a number from another range into a value between 0 and 1.
 * @param {number} value Incoming value to be normalized.
 * @param {number} start Lower bound of the value's current range.
 * @param {number} stop Upper bound of the value's current range.
 * @returns {number} Normalized number.
 */
function norm(value, start, stop) {
    var d = stop - start;
    var v = value - start;
    return v / d;
}


/**
 * Calculates a number between two numbers at a specific increment.
 * @param {number} start First value.
 * @param {number} stop Second value.
 * @param {number} amt The amount to interpolate between the two values.
 * @returns {number} Lerped value.
 */
function lerp(start, stop, amt) {
    var d = stop - start;
    var a = d * amt;
    return start + a;
}


/**
 * Constrains a value between a minimum and maximum value.
 * @param {number} n number to constrain.
 * @param {number} low minimum limit.
 * @param {number} high maximum limit.
 * @returns {number} constrained number.
 */
function constrain(n, low, high) {
    if (n < low) return low;
    if (n > high) return high;
    return n;
}
