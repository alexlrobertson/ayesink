function isObject(value) {
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

function isFunction(value) {
  const funcTag = '[object Function]';
  const genTag = '[object GeneratorFunction]';
  const tag = isObject(value)
    ? Object.prototype.toString.call(value)
    : '';

  return tag === funcTag || tag === genTag;
}

function sequence(fns) {
  return (callback) => {
    if (!isFunction(callback)) {
      throw new TypeError('callback is not a function');
    }

    function handle2(err, data) {
      callback(null, data);
    }

    function handle1(err, data) {
      fns[1](handle2, data);
    }

    fns[0](handle1);
  };
}

function parallel(fns) {
  let counter = 0;

  return (callback) => {
    if (!isFunction(callback)) {
      throw new TypeError('callback is not a function');
    }

    const results = [];

    function itemCall(err, data) {
      if (err) {
        return callback(err);
      }

      results.push(data);

      if (!(--counter)) {
        callback(null, results);
      }

      return undefined;
    }

    for (let i = 0; i < fns.length; i++) {
      counter++;
      fns[i](itemCall);
    }
  };
}

function race(fns) {
  return (callback) => {
    let done = false;

    function itemCall(err, data) {
      if (done) {
        return;
      }

      done = true;

      if (err) {
        callback(err);
        return;
      }

      callback(null, data);
    }

    for (let i = 0; i < fns.length; i++) {
      fns[i](itemCall);
    }
  };
}

module.exports = {
  sequence,
  parallel,
  race,
};
