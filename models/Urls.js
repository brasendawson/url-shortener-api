import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'urls'
});

// Define the association
Url.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Url, { foreignKey: 'userId' });

export default Url;