/**
 * @author Juan Luis Gutiérrez Blanco < juanluis.gutierrez.contractor@bbva.com >
 * @copyright 13/02/17 - BBVA GCP Team < gcp.team@bbva.com >
 */

import fs from "fs";

let readJSON = ( filename ) => JSON.parse( fs.readFileSync( filename ) );


export {

	readJSON
}