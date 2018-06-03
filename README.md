<h1 align="center">Eventish</h1>

Eventish is a lightweight NodeJS library, wrapping over the low-level EventEmitter API for handling events. Set up your events using different formats and trigger them in any convenient format of your choice

It was inspired by [Adebayoh Shalvah's](https://github.com/shalvah/) [burns](https://github.com/shalvah/burns/) library for event set-up and broadcasting.

## What you get
- A flexible wrapper over raw NodeJS EventEmitter API
- Asychronous handling of events i.e if you so choose
- The ability to add event handlers in different formats and any where in your code
- Default event handlers for a group of events
- The ability to trigger events in any format of your choice

## How to use
```bash
npm install --save eventish
```

```js
const eventish = require('eventish');
```

Define an event handler:

```js
// event_handlers/member.js

function send_new_member_email(data){
    mailer.send_email(`Hello ${data.name}, thanks for joining our community. `);
}

function send_password_email(data){
    mailer.send_email(` Hi ${data.name}, please follow this link to set up your password `)
}

function send_privacy_update_email(data){
    mailer.send_email(` Hello ${data.name}, we updated our privacy policy based on GDPR issues`);
}
```

Register the event and attach the handler:
```js
var new_member = require('./event_handlers/member');

// we can use an object of events and their corresponding handlers
eventish.setEvent({new_member:member.send_new_member_email,privacy_policy:member.send_privacy_update_email});

// we can also pass two arguments to the the eventish.setEvent method, any of the event an its array of handlers or the event and its single handler or an array of events and their generic handler. They are shown below:

eventish.setEvent('new_member',member.send_new_member_email); // event and its handler

eventish.setEvent('new_member',[member.send_new_member_email, member.send_password_email]) // an event and its array of handlers

eventish.setEvent(['new_member_password','old_member_password_update'], member.send_password_email);
```

You can trigger the events any time any where in your code.
```js
eventish.trigger_event('new_member', {
    name: new_member.name, 
    id: new_member.id
});
```

### Setting up events
Setting up events is very easy. You call the `set_event` method with an event name with the corresponding handler function in any of the following forms.

```js
eventish.setEvent('new_member',[member.send_new_member_email, member.send_password_email]) 

eventish.setEvent('new_member',member.send_new_member_email); // event and its handler

eventish.setEvent({new_member:[member.send_new_member_email],privacy_policy:member.send_privacy_update_email});

```

### Handlers definition
Handlers are the agents that do work whenever any of the events you set up are triggered. They are normal functions that receive optional data arguments on triggering of the event.
```js
function send_new_member_email(data){
  mailer.send_email(` Welcome to the brother hood ${data.name}`);
  console.log(data);
}
```



#### Setting a default event handler for a group of events
It is possible to specify a `all_events_handler`. Eventish will set an event handler for a group of events in an array

```js
function all_events_handler(data){ 
  console.log(data)
}
eventish.set_event(['new_member','old_member','password_rest'],all_events_handler);

// when you trigger the above events, the `all_events_handler` would be called
```

### Triggering events
In order to trigger an event, call ` trigger_event` with the name of the event:

```js
eventish.trigger_event('new_member');
```

You may also pass in a payload containing data to be transmitted with the event:

```js
eventish.trigger_event('new_member', {
    name:'Ajah',
    id: 7138,
});
```

or an array of events may be passed in at ones

```js
  eventish.trigger_event(['event1','event2','event3']);
```

or you may pass in an object of events and their corresponding data as follows:

```js
  eventish.trigger_event({event1:{name:'ajah'}, event2:['apples','oranges'], event3:'ajah'});
```


## Asynchronous form
It is possible to pass an optional `options` object as a parameter to set if you want the handler to be called asynchronously. That feature is yet to be implemented


## Contributing
In case you have any ideas, features you would like to be included or any bug fixes, you can send a PR.

(Requires Node v6 or above)
- Clone the repo

```bash
git clone https://github.com/ChukwuEmekaAjah/eventish.git
```

## Work still to be done 
- add support for asychronous handler calling with an options object
