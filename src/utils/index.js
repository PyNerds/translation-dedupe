/**
 * @author Juan Luis Gutiérrez Blanco < juanluis.gutierrez.contractor@bbva.com >
 * @copyright 13/02/17 - BBVA GCP Team < gcp.team@bbva.com >
 */

import merge from "deepmerge";

let changeRepresentation = ( obj, key, acc ) => [ { key : [ ...acc, key ].join( "." ), value : obj[ key ] } ];


let parseProperty = ( obj, key, acc ) =>
	( typeof obj[ key ] === "string" ) ?
		changeRepresentation( obj, key, acc )
		: stringObject2Array( obj[ key ], [ ...acc, key ] );


let stringObject2Array = ( obj, acc = [], i = Object.keys( obj ).length - 1 ) =>
	(i > 0) ?
		[ ...stringObject2Array( obj, acc, i - 1 ), ...parseProperty( obj, Object.keys( obj )[ i ], acc ) ]
		: parseProperty( obj, Object.keys( obj )[ i ], acc );

let simpleObject2Array = ( obj, i = Object.keys( obj ).length - 1 ) =>
	(i > 0) ?
		[ ...simpleObject2Array( obj, i - 1 ), ...changeRepresentation( obj, Object.keys( obj )[ i ], [] ) ]
		: changeRepresentation( obj, Object.keys( obj )[ i ], [] );

let findDuplicates = ( obj ) =>
	simpleObject2Array(
		stringObject2Array( obj ).reduce( ( acc, curr ) => {

			if ( acc.hasOwnProperty( curr.value ) ) {

				acc[ curr.value ].push( curr.key );
			} else {

				acc[ curr.value ] = [ curr.key ];
			}

			return acc;
		}, {} ) );


let findMinKey = ( arr, min = null, restKeys = [], i = 0 ) =>
	(i < arr.length - 1) ?
		findMinKey(
			arr,
			(min === null || arr[ i ].length < min.length) ? arr[ i ] : min,
			(min === null) ? [] : [ ...restKeys, ((arr[ i ].length < min.length) ? min : arr[ i ]) ],
			i + 1 )
		: {
			min : (min === null || arr[ i ].length < min.length) ? arr[ i ] : min,
			rest : (min === null) ? [] : [ ...restKeys, ((arr[ i ].length < min.length) ? min : arr[ i ]) ]
		};

let generateStruct = ( keys, value, i = 0 ) =>
	( i < keys.length - 1 ) ?
		{ [keys[ i ]] : generateStruct( keys, value, i + 1 ) }
		: { [keys[ i ]] : value };


let generateTranslation = ( keys, newKey, i = 0 ) =>
	(i < keys.length - 1) ?
		Object.assign( generateTranslation( keys, newKey, i + 1 ), { [keys[ i ]] : newKey } )
		: { [keys[ i ]] : newKey };

let generateEntry = ( minKeyObject, value ) => {
	return {
		res : generateStruct( minKeyObject.min.split( "." ), value ),
		translations : generateTranslation( minKeyObject.rest, minKeyObject.min )
	}
};


let generateFinalObject = ( dups, i = 0 ) =>
	(i < dups.length - 1) ?
		merge.all( [ generateFinalObject( dups, i + 1 ),
			generateEntry( findMinKey( dups[ i ].value ), dups[ i ].key ) ] )
		: generateEntry( findMinKey( dups[ i ].value ), dups[ i ].key );


let dedupe = ( obj ) => generateFinalObject( findDuplicates( obj ) );

export {
	dedupe
}