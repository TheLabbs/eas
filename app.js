const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false, limit: '1024kb' }));
app.use(bodyParser.json());

//Index Route
app.get('/', (req, res) => {
  const title = 'Välkommen';
  res.render('index', {
    title: title
  });
});

//About Route

app.get('/about', (req, res) => {
  res.render('about');
});

//Random Route

app.get('/random/new', (req, res) => {
  res.render('random/new');
});

//Process random

app.post('/random', (req, res) => {
  let errors = [];
  let areaLines = [];
  let randomLines = [];
  let randomPost = req.body.precentage;

  if (!req.body.random) {
    errors.push({ text: 'Var god klistra in sökresultat innan du trycker Ok' });
  }
  if (!req.body.precentage) {
    errors.push({ text: 'Ange procentsats innan du trycker Ok' });
  }

  if (errors.length > 0) {
    res.render('random/new', {
      errors: errors,
      random: req.body.random,
      precentage: req.body.precentage
    });
  } else {
    // lines is an array of strings
    let lines = req.body.random.split('\n');
    // Loop through all lines
    for (let i = 0; i < lines.length; i++) {
      areaLines.push(lines[i]);
    }
    // Get %-value from inputform
    randomPost = (randomPost / 100) * areaLines.length;

    for (let j = 0; j < randomPost; j++) {
      randomLines.push({ line: getRandomPost(areaLines) });
    }

    res.render('random/result', {
      randomlines: randomLines
    });
  }
});

function getRandomPost(collection) {
  let keys = Array.from(collection);
  return keys[Math.floor(Math.random() * keys.length)];
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server körs på port: ${port}`);
});
