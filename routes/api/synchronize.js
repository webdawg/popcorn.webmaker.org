module.exports = function( Project, metrics ) {

  return function( req, res ) {

    var projectData = req.body;

    if ( req.body.id ) {

      Project.update( { email: req.session.email, id: req.body.id, data: projectData },
                      function( err, doc ) {
        if ( err ) {
          res.json( { error: err }, 500 );
          return;
        }

        res.json( { error: 'okay', project: doc } );
        metrics.increment( 'project.save' );
      });
    } else {

      Project.create( { email: req.session.email, data: projectData }, function( err, doc ) {
        if ( err ) {
          res.json( { error: err }, 500 );
          metrics.increment( 'error.save' );
          return;
        }

        // Send back the newly added row's ID
        res.json( { error: 'okay', projectId: doc.id } );
        metrics.increment( 'project.create' );
        if ( doc.remixedFrom ) {
          metrics.increment( 'project.remix' );
        }
      });
    }
  };
};

