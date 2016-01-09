'use strict';

var Promise = require('bluebird');
var request = require('request');

var secrets = require('../../.secrets');

module.exports = {
  postTaskToList: function (task, list) {
    return new Promise(function (resolve, reject) {
      request({
        method: 'POST',
        uri: 'https://a.wunderlist.com/api/v1/tasks',
        headers: secrets.wunderlist,
        json: true,
        body: {
          list_id: list.id,
          title: task.charAt(0).toUpperCase() + task.slice(1)
        }
      }, function (error, response, body) {
        if (error) {
          console.error(error);
          reject(error);
        }

        resolve({
          task: body,
          list: list
        });
      });
    });
  }
};