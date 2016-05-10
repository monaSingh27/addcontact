
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');


app.use(morgan('dev')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = 8080;

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/addcontact'); // connect to our database
var Contact   = require('./app/models/contact');


var router = express.Router();

// router.use(function(req, res, next) {
	
// 	console.log('Something is happening.');
// 	next();
// });

router.get('/', function(req, res) {
	res.json({ message: 'hello! welcome to our api!' });	
});

router.route('/contacts')

	.post(function(req, res) {
		
		var contact = new Contact();
		contact.name = req.body.name;  
        contact.email = req.body.email;
        contact.mobileno = req.body.mobileno;

		contact.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'contact added!' });
		});

		
	})

	.get(function(req, res) {
		Contact.find(function(err, contacts) {
			if (err)
				res.send(err);

			res.json(contacts);
		});
	});

router.route('/contacts/:contact_id')

	// get the contact with that id
	.get(function(req, res) {
		Contact.findById(req.params.contact_id, function(err, contact) {
			if (err)
				res.send(err);
			res.json(contact);
		});
	})

	
	.put(function(req, res) {
		Contact.findById(req.params.contact_id, function(err, contact) {

			if (err)
				res.send(err);

			contact.name = req.body.name;
			contact.email=req.body.email;
			contact.mobileno = req.body.mobileno;
			contact.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'contact updated!' });
			});

		});
	})

	router.route('/contacts/:email')

	.delete(function(req, res) {
		Contact.remove({
			email: req.params.email
		}, function(err, contact) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


app.use('/api', router);


app.listen(port);
console.log('port starts on ' + port);
