let urls = []
let limits = []

var MAX_URLS = 25

const clamp = ( num, min, max ) => Math.min( Math.max( num, min ), max );

app.get( "/urlpacker", ( req, res ) => {
    var url = req.query.url
    var time = req.query.duration || 60

    //

    if ( Object.keys( urls ) > 200 ) return res.sendStatus( 502 )
    if ( !url ) return res.sendStatus( 400 )
    url = url.trim()

    if ( url.length <= 0 ) return res.sendStatus( 400 )
    if ( url.toLowerCase().indexOf( "http" ) == -1 ) return res.sendStatus( 400 )
    if ( url.toLowerCase().indexOf( "script" ) != -1 ) return res.sendStatus( 403 )

    //

    var ip = req.headers["cf-connecting-ip"]
    
    limits[ ip ] = ( limits[ ip ] || 0 ) + 1

    if ( limits[ ip ] > MAX_URLS ) return res.sendStatus( 400 )

    //

    var id = ( Math.random() + 1 ).toString( 36 ).substring( 2 )
    urls[ id ] = url

    setTimeout( () => {
        limits[ ip ] = limits[ ip ] - 1

        urls[id] = null
    }, clamp( time * 1000, 5 * 1000, 3600 * 1000 ) )

    res.end( "http://localhost:8080/links?id=" + id );
} );

app.get( "/links", ( req, res ) => {
    var id = req.query.id

    if ( !urls[id] ) {
        return res.end( "unknown-id" );
    };

    // res.redirect( urls[id] )
    var url = urls[id]

    // Почему я это сделал?
    res.send( `
    Redirecting to <u>${ url }</u>..<br>
    <b>This site was made just for fun and experience. Internet users themselves create urls here, not the creator of the site </b>
    Created by https://yamirka.ru/

    <script>
        setTimeout( function() {
            window.location.replace( "${url}" );
        }, 50 )
    </script>

    <noscript><p>Scripts are disabled</p></noscript> 
    ` )
} );
