const https        = require('https');
const url          = require('url');
const payload      = {};

exports.handler = (event, context) => {
  // Request options.
  const slack_req_opts   = url.parse(process.env.SLACK_WEBHOOK_URL);
  slack_req_opts.method  = 'POST';
  slack_req_opts.headers = {'Content-Type': 'application/json'};

  // Set the color according to the state.
  let color;
  switch (event.detail.state) {
    case 'SUCCEEDED':
      color = '#1b9932';
      break;
    case 'FAILED':
      color = '#cc3301';
      break;
    default:
      color = '#3388dd';
      break;
  }

  if (process.env.SLACK_USERNAME)   payload.username   = process.env.SLACK_USERNAME;
  if (process.env.SLACK_ICON_URL)   payload.icon_url   = process.env.SLACK_ICON_URL;
  if (process.env.SLACK_ICON_EMOJI) payload.icon_emoji = process.env.SLACK_ICON_EMOJI;
  if (process.env.CHANNEL)          payload.channel    = process.env.CHANNEL;

  payload.text = '*Pipeline state changed*';
  payload.attachments = [{
    title: event.resources.join(', '),
    text:  `${event.time}`,
    color: color,
    fields: [{
      title: 'State',
      value: `${event.detail.state}${event.detail.state == 'SUCCEEDED' ? ' :beer:' : ''}`,
      short: true
    }, {
      title: 'Stage',
      value: event.detail.stage,
      short: true
    }, {
      title: 'Execution ID',
      value: event.detail['execution-id'],
      short: false
    }]
  }];

  const req = https.request(slack_req_opts, (res) => {
    if (res.statusCode === 200) {
      context.succeed('Post to slack: SUCCESS');
    } else {
      context.fail('status code: ' + res.statusCode);
    }
  });

  req.on('error', (e) => {
    console.log('Post to slack: FAILED');
    context.fail(e.message);
  });

  req.write(JSON.stringify(payload));
  req.end();
};
