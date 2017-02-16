/**
 * @author Juan Luis Gutiérrez Blanco < juanluis.gutierrez.contractor@bbva.com >
 * @copyright 13/02/17 - BBVA GCP Team < gcp.team@bbva.com >
 */

import process from "process";

import {readJSON} from "./filesystem";
import {dedupe} from "./utils";


let provisional = dedupe( readJSON( process.argv[ 2 ] ) );


console.info( JSON.stringify( provisional ) );