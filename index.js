//////

global.express = require( "express" );
global.app = express();
global.http = require( "http" );

const bodyParser = require( "body-parser" );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

//

require( "./urlpacker.js" )

//

const static = require( "node-static" );
const fileServer = new static.Server( "./static" );
app.use( ( req, res ) => fileServer.serve( req, res ) );

//

let port = 8080
let httpServer = http.createServer( app )

httpServer.listen( port )
process.on( "uncaughtException", function( err ){ console.error( err ) } ) 

//

console.log( "Started" )