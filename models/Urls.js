import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import logger from '../utils/logger.js';  // Fixed import path

const Url = sequelize.define('Url', {
  urlId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  origUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customSlug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  qrCode: {
    type: DataTypes.TEXT('long'), 
    allowNull: true
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'urls',
  hooks: {
    beforeValidate: (url, options) => {
      if (!url.origUrl) {
        logger.error('URL validation failed', {
          error: 'Missing original URL',
          event: 'model_validation_failed'
        });
      }
    }
  }
});

// Define the association
Url.belongsTo(User, { foreignKey: 'username', targetKey: 'username' });
User.hasMany(Url, { foreignKey: 'username', sourceKey: 'username' });

export default Url;