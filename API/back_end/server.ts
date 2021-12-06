import db from './models';
import App from './app'

const app = new App;
const port = process.env.APP_PORT || 8000;

db.sequelize.sync().then(() => {
    app.express.listen(port, () => {
        console.log(`App listening on port ${port}`);
    })
}) 

