const fn = function(){};
export const noop = fn;
export const callBind = func => fn.call.bind(func);
export const toFixed = callBind(Number.prototype.toFixed);
export const toString = callBind(Object.prototype.toString);
export const getKeys = Object.keys;
export const getValues = Object.values || function( obj ) {
	return getKeys( obj ).map( key => obj[ key ]);
}

const typeRegex = /\[object\s+(\w+)]/;
export const getType = obj => {
	return toString( obj ).replace( typeRegex, '$1' ).toLowerCase();
}

export const isArray = Array.isArray;
export const isPlainObject = obj => toString( obj ) === '[object Object]';
export const isNumeric = num => {
	return !/object|symbol/.test( typeof num ) && isFinite( parseInt(num) && +num );
}

/**
 * TODO: Experimental
 * Returns wheather the object contains valid content.
 * @param  {String|Array|Object} obj
 * @return {Boolean}
 */
export const isEmpty = obj => {
	if ( obj != null && typeof obj === 'object' ) {
		if ( isPlainObject( obj ) || isArray( obj ) ) {
			for ( var key in obj ) break;
			return !key;
		} else return 'N/A';
	}
	return !isNumeric( obj ) && ( !obj || +obj === 0 );
}

/**
 * TODO: Experimental
 * Returns a valid number with commas inserted.
 * @param  {String|Number} num
 * @return {String}
 */
export const commify = num => {
	if ( !isNumeric( num ) ) return num;
	let parts = String( num ).split( '.' );
	parts[ 0 ] = parts[ 0 ].replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
	return parts.join( '.' );
}

/**
 * TODO: Experimental
 * Cast as the type
 */
export const castNum = num => {
	num = typeof num === 'string' ? num.replace( /,/g, '' ) : num;
	return isNumeric( num ) ? +num : NaN;
}

// Korean Consonants
const koC = [ 0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143,
	0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314A, 0x314B, 0x314C, 0x314D, 0x314E ];

/**
 * TODO: Experimental
 * Returns regular expression for Korean
 * ( Korean unicode range: 0xAC00 ~ 0xD7A3 )
 * @param  {String} str
 * @param  {String} mod
 * @return {RegExp}
 */
export const RegexKo = ( str, mod ) => {
	if ( isEmpty( str ) ) return;
	let ucode, result = '';
	for ( let i = 0; i < str.length; i++ ) {
		ucode = str.charCodeAt( i );
		if ( ucode >= 0x3131 && ucode <= 0x314E ) {
			ucode = 0xAC00 + koC.indexOf( ucode ) * 588;
			result += '[\\u' + ( ucode ).toString( 16 ) + '-\\u' + ( ucode + 587 ).toString( 16 ) + ']';
		} else if ( ucode >= 0xAC00 && ucode <= 0xD7A3 && ( ucode - 0xAC00 ) % 28 === 0 ) {
			result += '[\\u' + ( ucode ).toString( 16 ) + '-\\u' + ( ucode + 27 ).toString( 16 ) + ']';
		} else {
			result += str.charAt( i ).replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
		}
	}
	return new RegExp( result, mod );
}

// Development Mode
export const visualizeData = data => {
	return /^(string|object|array|date)$/.test( getType(data) )
		? JSON.stringify( data ) : String( data );
}

export default {
	getKeys, getValues, getType, isArray, isPlainObject, isNumeric, isEmpty,
	commify, castNum, RegexKo,
// Development Mode
	visualizeData,
}