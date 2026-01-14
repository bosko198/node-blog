const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const methodOverride = require('method-override');

const postRoutes = require('./routes/postRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use('/', postRoutes);
app.use(errorHandler);

module.exports = app;