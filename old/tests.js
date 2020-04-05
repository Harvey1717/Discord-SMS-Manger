const Datastore = require('nedb');

db = new Datastore({
  filename: './database/db.db',
  autoload: true,
  onload: err => {
    if (err) console.log(err);
    else {
    }
  }
});

function myFunction() {
  db.insert(
    {
      originalTag: 'dmc#0001',
      discordUserID: 'randomUserID',
      sms: { mobileNumber: '+447825942533', signupDate: new Date() }
    },
    (err, newDoc) => {
      if (err) console.log(err);
      console.log(newDoc);
    }
  );
}
