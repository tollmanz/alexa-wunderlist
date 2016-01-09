'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('wunderlist');

var request = require('request');
var async = require('async');
var express = require('express');

var listRequest = require('./lib/wunderlist/lists');
var taskRequest = require('./lib/wunderlist/tasks');

app.dictionary = {
  listItems: [
    "peppers",
    "doritos",
    "dish soap",
    "dog food",
    "hot enchilada sauce",
    "golden delicious apples",
    "chunky campbell's beef soup",
    "nails for hanging pictures",
    "bouncy ball for our dog",
    "floatation device for the river"
  ],
  lists: [
    "groceries",
    "private",
    "work"
  ]
};

app.intent('wunderlistAddTaskIntent',
  {
    slots: {
      TASK: 'AMAZON.LITERAL',
      LIST: 'AMAZON.LITERAL'
    },
    'utterances': [
      'to add {listItems|TASK} to {lists|LIST}',
      'to add {listItems|TASK} to the {lists|LIST} list'
    ]
  },
  function (alexaRequest, alexaResponse) {
    var task = alexaRequest.slot('TASK');
    var list = alexaRequest.slot('LIST');

    var foundList = listRequest.getListByName(list);

    foundList
      .then(function (theList) {
        return taskRequest.postTaskToList(task, theList);
      })
      .then(function (response) {
        // Not using .say() in order to respond with an SSML output
        alexaResponse.response.response.outputSpeech = {
          type: 'SSML',
          ssml: '<speak>Added ' + response.task.title + ' to the ' + response.list.title + ' Wunderlist</speak>'
        };

        alexaResponse
          .send();
      });

    // Return false immediately so alexa-app doesn't send the response; The send() method will send it.
    return false;
  }
);

module.exports = {
  app: app,
  handler: app.lambda()
};