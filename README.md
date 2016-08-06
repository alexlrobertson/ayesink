# AyeSink

`npm install ayesink`

## `sequence`

```javascript
const ayesink = require('ayesink');

function getUser(userId) {
  return (cb) => {
    setTimeout(() => {
      cb(null, { userId: userId, name: 'Joe' });
    }, Math.random() * 100);
  };
}

function upperCaseName(cb, user) {
  cb(null, user.name.toUpperCase());
}

const userThunk = getUser(22);

ayesink.sequence([userThunk, upperCaseName])((err, data) => {
  console.log(data); // JOE
});
```

## `parallel`

```javascript
const userThunk1 = getUser(1);
const userThunk2 = getUser(2);

ayesink.parallel([userThunk1, userThunk2])((err, users) => {
  console.log(users); // [ { userId: 1, name: 'Joe' }, { userId: 2, name: 'Joe' } ]
});
```

## `race`

```javascript
function faster (cb) {
  setTimeout(cb.bind(null, null, "I'm faster"), 10);
}

ayesink.race([userThunk1, faster])((err, winner) => {
  console.log(winner); // I'm faster
});
```
