'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    'users',
    {
      id: {
        type: 'int',
        unsigned: true,
        primaryKey: true,
        autoIncrement: true,
      },
      name: 'string',
      email: 'string',
      password: 'string',
      token: 'float',
      created_at: 'datetime',
      updated_at: 'datetime',
    },
    callback,
  );

  db.createTable(
    'requests',
    {
      id: {
        type: 'int',
        unsigned: true,
        primaryKey: true,
        autoIncrement: true,
      },
      users_id: {
        type: 'int',
        unsigned: true,
        foreignKey: {
          name: 'requests_user_id_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT',
          },
          mapping: 'id',
        },
      },
      created_at: 'datetime',
      updated_at: 'datetime',
    },
    callback,
  );
  return null;
};

exports.down = function (db, callback) {
  db.dropTable('users', callback);
  db.dropTable('requests', callback);
  return null;
};

exports._meta = {
  version: 1,
};
