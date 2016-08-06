'use strict';

/* global describe, it */
const assert = require('assert');
const async = require('./');

describe('async', () => {
  describe('has a sequence method that', () => {
    it('runs functions in sequence', done => {
      const fun1 = cb => setTimeout(cb.bind(null, null, 'test'), 10);
      const fun2 = (cb, data) => setTimeout(cb.bind(null, null, `${data}ing`), 10);

      // returns a thunk
      async.sequence([fun1, fun2])((err, data) => {
        if (err) {
          throw new Error();
        }
        assert.equal(data, 'testing');
        done();
      });
    });

    it('correctly handles sync functions in sequence', done => {
      const fun1 = cb => cb(null, 'test1');
      const fun2 = (cb, data) => cb(null, data);

      // returns a thunk
      async.sequence([fun1, fun2])((err, data) => {
        if (err) {
          throw new Error();
        }

        assert.equal(data, 'test1');
        done();
      });
    });

    it('handles delayed thunk invocation', done => {
      const fun1 = cb => cb(null, 'test2');
      const fun2 = (cb, data) => cb(null, data.toUpperCase());

      // returns a thunk
      const setter = async.sequence([fun1, fun2]);

      setTimeout(() =>
        setter((err, data) => {
          if (err) {
            throw new Error();
          }
          assert.equal(data, 'TEST2');
          done();
        })
      , 100);
    });
  });

  describe('has a parallel method that', () =>
    it('runs functions in parallel', done => {
      function fun1(cb) {
        setTimeout(cb.bind(null, null, 'test'), 10);
      }
      function fun2(cb) {
        setTimeout(cb.bind(null, null, 'ing'), 10);
      }

      // returns a thunk
      async.parallel([fun1, fun2])((err, data) => {
        if (err) {
          throw new Error();
        }
        assert.deepEqual(data, ['test', 'ing']);
        done();
      });
    })
  );

  describe('has a race method that', () =>
    it('uses the first completing function', done => {
      function fun1(ms) {
        return cb => setTimeout(cb.bind(null, null, 'test'), ms);
      }
      function fun2(ms) {
        return cb => setTimeout(cb.bind(null, null, 'ing'), ms);
      }

      // returns a thunk
      async.race([fun1(10), fun2(20)])((err, data) => {
        if (err) {
          throw new Error();
        }

        assert.equal(data, 'test');
        async.race([fun1(20), fun2(10)])((err2, data2) => {
          if (err2) {
            throw new Error();
          }

          assert.equal(data2, 'ing');
          done();
        });
      });
    })
  );
});
