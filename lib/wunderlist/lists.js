'use strict';

var Promise = require('bluebird');
var request = require('request');
var async = require('async');
var natural = require('natural');

var secrets = require('../../.secrets');

var nounInflector = new natural.NounInflector();
nounInflector.attach();

module.exports = {
  getListByName: function (listName) {
    var listNameLower = listName.toLowerCase();
    var listNameLowerSingular = listName.toLowerCase().singularizeNoun();

    return new Promise(function (resolve, reject) {
      request({
        method: 'GET',
        uri: 'https://a.wunderlist.com/api/v1/lists',
        headers: secrets.wunderlist
      }, function (error, response, body) {
        if (error) {
          console.error(error);
          reject(error);
        }

        var theList = {};

        async.each(JSON.parse(body), function (list, callback) {
          var listTitleLower = list.title.toLowerCase();
          var listTitleLowerSingular = list.title.toLowerCase().singularizeNoun();

          if (listTitleLower === listNameLower || listNameLowerSingular === listTitleLowerSingular || natural.JaroWinklerDistance(listTitleLower, listNameLower) > 0.9) {
            theList = list;
          }

          callback();
        }, function (err) {
          resolve(theList);
        });
      });
    });
  }
};