// Libs
var Promise = require("bluebird");
var utils = require('./utils');

// Start, End Time and Period Setup.
// Months and Days starts at Zero (0 = jan)
var startTime = new Date(2017, 2, 0);
var endTime = new Date(2017, 2, 7);
var periodInSeconds = 60*5;

// Desired Metrics to Extract
// You can find this data on CloudWatch
var metrics = [
  {
    MetricNames: ['Latency', 'RequestCount', 'HealthyHostCount', 'UnHealthyHostCount'],
    Namespace: 'AWS/ELB',
    DimensionName: 'LoadBalancerName',
    DimensionValue: 'awseb-e-w-AWSEBLoa-1XOAN655FLSB6',
  }
];

// Extract the Data from CloudWatch
Promise
  .resolve(utils.getTimePeriods(startTime, endTime, periodInSeconds))
  .then(dates => utils.getMetricParams(metrics, dates))
  .map(utils.requestMetricsForGroup)
  .map(utils.saveMetricData)
  .then((result) => {
    console.log('Çuçeço!');
  })
  .catch((err) => console.log(err))
