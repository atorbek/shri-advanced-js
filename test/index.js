import { assert } from 'chai';
import { allKeysAndSymbols } from '../src/index';

describe('Продвинутый JS', () => {
  describe('allKeysAndSymbols', () => {
    it('', () => {});
  });

  describe('createProxy', () => {
    it('', () => {
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
  });
});
