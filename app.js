require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const limitter = require('./middlewares/limitter');
const errorsHandler = require('./middlewares/errorsHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const { PORT_SETTING, DB_SETTING } = require('./utils/settings');

const app = express();
app.use(bodyParser.json());
mongoose.connect(DB_SETTING);
app.use(requestLogger);
app.use(limitter);
app.use(helmet());
app.use(cors);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT_SETTING, () => {
  console.log(`App listening at port ${PORT_SETTING}`);
});
