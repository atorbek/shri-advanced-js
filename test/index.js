import { assert } from 'chai';
import { allKeysAndSymbols } from '../src/index';

describe('Продвинутый JS', () => {
  it('allKeysAndSymbols', () => {});

  it('createProxy', () => {
    const proto = { value: 42 };
    const object = Object.create(proto);

    Object.defineProperty(object, 'year', {
      value: 2020,
      writable: true,
      configurable: true,
      enumerable: false
    });

    const symbol = Symbol('bazzinga');
    object[symbol] = 42;

    assert.equal('value' in object, true);
    assert.equal('year' in object, true);
    assert.equal(symbol in object, true);

    const proxy = createProxy(object);

    assert.equal('value' in proxy, false);
    assert.equal('year' in proxy, true);
    assert.equal(symbol in proxy, true);
  });

  it('asyncExecutors', done => {
    const ID = 42;
    const delayMS = 1000;

    function getId() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(ID);
        }, delayMS);
      });
    }

    function getDataById(id) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          id === ID ? resolve('resolved!🍎') : reject('💥reject!');
        }, delayMS);
      });
    }

    asyncExecutor(function*() {
      console.time('Time');

      const id = yield getId();
      const data = yield getDataById(id);
      console.log('Data', data);

      console.timeEnd('Time');

      assert.equal(data, 'resolved!🍎');

      done();
    });
  });
});
