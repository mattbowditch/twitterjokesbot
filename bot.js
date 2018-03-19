console.log('Starting Bot');

var Snooper = require('reddit-snooper')
    snooper = new Snooper(
        {
            // credential information is not needed for snooper.watcher
            username: 'reddit_username',
            password: 'reddit password',
            app_id: 'reddit api app id',
            api_secret: 'reddit api secret',
            user_agent: 'OPTIONAL user agent for your bot',

            automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
            api_requests_per_minuite: 60 // api requests will be spread out in order to play nicely with Reddit
        })

var Twit =  require('twit');

var stringSimilarity = require('string-similarity');

var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

let options = {
  listing: 'hot',
  limit: 15
}

let title = ' ';
let text = ' ';

snooper.watcher.getListingWatcher('jokes', options)
  .on('item', function(item) {
    if(!item.data.stickied) {
      title = item.data.title;
      text = item.data.selftext;
      combine(title, text);
    }
  })
  .on('error', console.error)

// Object.getOwnPropertyNames(item.data)

function combine(title, text){
  //Check if title is the same as body
  let text_compare = text.substr(0, title.length);
  let similarity = stringSimilarity.compareTwoStrings(title, text_compare);
  if(similarity >= 0.8){
    console.log('Title is the same as text');
  } else {
    //Check its less than 280 characters (Remove new lines?)
    let length = title.length + text.length;
    if(length <= 260){
      let msg = title + ' ' + text; //Combine title and text
      tweetIt(msg);
    }
  }
}

function tweetIt(msg){
  var tweet = {
    status: msg
  }
  T.post('statuses/update', tweet, tweeted)
  function tweeted(err, data, response) {
    if (err){
      console.log('OOPSIE WHOOPSIE!');
    } else {
      console.log('New Tweet');
    }
  }
}
