/* ===============================================================================================================================================
   Vector

   Description
   This script summarizes functions related to vectors.

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
 * Creates a new vector object.
 * @param {number} x x component of the vector.
 * @param {number} y y component of the vector.
 * @returns {{x: number, y: number}}
 */
function vector(x, y) {
    return {
        x: x,
        y: y
    };
}


/**
 * Gets a copy of the vector.
 * @param {{x: number, y: number}} v vector.
 * @returns {{x: number, y: number}}
 */
function clone(v) {
    return {
        x: v.x,
        y: v.y
    };
}


/**
 * Adds two independent vectors together.
 * @param {{x: number, y: number}} a vector to add.
 * @param {{x: number, y: number}} b vector to add.
 * @returns {{x: number, y: number}}
 */
function add(a, b) {
    var v = clone(a);
    v.x += b.x;
    v.y += b.y;
    return v;
}


/**
 * Subtracts two independent vectors.
 * @param {{x: number, y: number}} a vector to subtract from.
 * @param {{x: number, y: number}} b vector to subtract.
 * @returns {{x: number, y: number}}
 */
function sub(a, b) {
    var v = clone(a);
    v.x -= b.x;
    v.y -= b.y;
    return v;
}


/**
 * Multiplies the x and y components of two independent vectors.
 * @param {{x: number, y: number}} a vector.
 * @param {{x: number, y: number}} b vector.
 * @returns {{x: number, y: number}}
 */
function mult(a, b) {
    var v = clone(a);
    v.x *= b.x;
    v.y *= b.y;
    return v;
}


/**
 * Divides the x and y components of two vectors against each other.
 * @param {{x: number, y: number}} a vector.
 * @param {{x: number, y: number}} b vector.
 * @returns {{x: number, y: number}}
 */
function div(a, b) {
    var v = clone(a);
    v.x /= b.x;
    v.y /= b.y;
    return v;
}


/**
 * Calculates the magnitude (length) of the vector.
 * @param {{x: number, y: number}} v vector.
 * @returns {number}
 */
function mag(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}


/**
 * Normalize the vector to length 1
 * @param {{x: number, y: number}} v vector.
 * @returns {{x: number, y: number}}
 */
function normalize(v) {
    var l = 1 / mag(v);
    var n = vector(l, l);
    return mult(v, n);
}


/**
 * Set the magnitude of this vector to the value used for the len parameter.
 * @param {{x: number, y: number}} v vector.
 * @param {number} len the new length for this vector.
 * @returns {{x: number, y: number}}
 */
function setMag(v, len) {
    var n = normalize(v);
    n.x *= len;
    n.y *= len;
    return n;
}


/**
 * Limit the magnitude of this vector to the value used for the max parameter.
 * @param {{x: number, y: number}} v vector.
 * @param {number} max the maximum magnitude for the vector.
 * @returns {{x: number, y: number}}
 */
function limit(v, max) {
    var min = Math.min(max, mag(v));
    return setMag(v, min);
}


/**
 * Calculate the angle of rotation for this vector.
 * @param {{x: number, y: number}} v vector.
 * @returns {number}
 */
function heading(v) {
    return Math.atan2(v.y, v.x);
}


/**
 * Calculates the dot product of two vectors.
 * @param {{x: number, y: number}} a the first vector.
 * @param {{x: number, y: number}} b the second vector.
 * @returns {number}
 */
function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}


/**
 * Calculates the Euclidean distance between two points (considering a point as a vector object).
 * @param {{x: number, y: number}} a the first vector.
 * @param {{x: number, y: number}} b the second vector.
 * @returns {number}
 */
function dist(a, b) {
    var s = sub(a, b);
    return mag(s);
}
