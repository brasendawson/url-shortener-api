import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Url = sequelize.define('Url', {
  urlId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  tableName: 'urls'
});

export default Url;