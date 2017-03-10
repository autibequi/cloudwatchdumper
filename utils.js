'use strict';

// Libs
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var AWS = require('aws-sdk');
var _ = require('lodash');

// AWS Setup
AWS.config.setPromisesDependency(require('bluebird'));
var cloudWatch = new AWS.CloudWatch();

// Consts
const SAMPLE_PER_REQUEST = 1440;

module.exports = {};

// Creates periods of time based on the SAMPLE_PER_REQUEST limit.
module.exports.getTimePeriods = (startTime, endTime, periodInSeconds) => {
  let currentTime = startTime;
  let timePeriods = [];
  let previousCurrentTime;

  while (currentTime < endTime) {
    previousCurrentTime = currentTime;
    currentTime = new Date(currentTime.getTime() + SAMPLE_PER_REQUEST*periodInSeconds*1000);

    if (currentTime > endTime) currentTime = endTime;

    timePeriods.push({ StartTime: previousCurrentTime, EndTime: currentTime, Period: periodInSeconds })
  };

  return timePeriods;
}

// Create the Params Dictionary that will be used on the AWS SDK
// return array of arrays. Each array contains the params that will be sent to
// to the AWSSDK.
module.exports.getMetricParams = (metrics, dates) => {
  let metricResult = [];
  metrics.forEach((metric) => {
    metric.MetricNames.forEach((metricName) => {
      let metricGroup = [];
      dates.forEach((period) => {
        metricGroup.push({
          StartTime: period.StartTime,
          EndTime: period.EndTime,
          Period: period.Period,
          MetricName: metricName,
          Namespace: metric.Namespace,
          Statistics: ['Average'],
          Dimensions: [
            {
              Name: metric.DimensionName,
              Value: metric.DimensionValue,
            },
          ],
        });
      });
      metricResult.push(metricGroup);
    });
  });
  return metricResult;
}

// Make the request to cloudwatch and join the results in a single object.
module.exports.requestMetricsForGroup = (metricGroup) => {
  let metricsPromisse = metricGroup.map(params => cloudWatch.getMetricStatistics(params).promise());
  return Promise
    .all(metricsPromisse)
    .map(metric => metric.Datapoints)
    .then(_.flatten)
    .then(Datapoints => {
      let metricGroupOne = metricGroup[0]
      return {
        Datapoints,
        MetricName: metricGroupOne.MetricName,
        Namespace: metricGroupOne.Namespace,
        Identifier: metricGroupOne.Dimensions[0].Name,
        IdentifierValue: metricGroupOne.Dimensions[0].Value,
      }
    })
}

module.exports.saveMetricData = (metrics) => {
  let filename = metrics.Identifier +'_'+ metrics.IdentifierValue +'_'+ metrics.MetricName +'.json';
  let filepath = path.join(__dirname, filename);
  return fs.writeFile(filepath, JSON.stringify(metrics, null, ' '));
}