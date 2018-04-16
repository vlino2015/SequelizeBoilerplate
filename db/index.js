var Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/seqClass');

const models = {
    post: sequelize.import('./post'),
    comment: sequelize.import('./comment'),
    users: sequelize.import('./users')
    
};


Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports =  models;
