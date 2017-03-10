# CloudWatch Metrics Dumper

This is a simple metric Dumper created to extract data.

## Usage

I'm very lazy so I this is basically a script.

On index.js file there is 4 variables to set as the example bellow.

```js
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
```

'startTime', 'endTime', 'periodInSeconds' is pretty self explanatory.

Metrics is a little trickier, you can find these informations on CloudWatch on the Metrics Tab.

## Improvements

Lots, but I'm lazy.