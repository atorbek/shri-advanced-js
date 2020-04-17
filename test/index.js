import { assert, expect } from 'chai';
import { allKeysAndSymbols } from '../src/index';

describe('Продвинутый JS', () => {
  describe('allKeysAndSymbols', () => {
    it('Возвращает все свойства, символы объекта как объекта так и цепочки прототипов', () => {
      const proto = Object.create(null);
      const foo = Symbol('foo');
      proto.quux = () => {};
      proto.bat = function() {};
      proto.bat = undefined;
      proto.xyzzy = [];
      proto.plugh = {};
      proto[foo] = 'foo';

      function Class() {
        this.bar = 42;
        this.baz = Infinity;
      }
      Class.prototype = proto;

      const object = new Class();
      const props = allKeysAndSymbols(object);

      expect(props).to.deep.equal([
        'bar',
        'baz',
        'quux',
        'bat',
        'xyzzy',
        'plugh',
        foo
      ]);
    });
  });

  describe('createProxy', () => {
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

    it('С proxy оператор in вернет истину только, когда свойство как в самом объекте так и в прототипе', () => {
      assert.equal('value' in object, true);
      assert.equal('year' in object, true);
      assert.equal(symbol in object, true);
    });
    it('С proxy оператор in вернет истину только, когда свойство находится в самом объекте', () => {
      const proxy = createProxy(object);

      assert.equal('value' in proxy, false);
      assert.equal('year' in proxy, true);
      assert.equal(symbol in proxy, true);
    });
  });

  describe('asyncExecutors', () => {
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
          id === ID ? resolve('resolved') : reject('reject');
        }, delayMS);
      });
    }

    it('В функции генератор последовательно выполняются асинхронные действия', done => {
      asyncExecutor(function*() {
        const id = yield getId();
        assert.equal(id, ID);
        const data = yield getDataById(id);
        assert.equal(data, 'resolved');

        done();
      });
    });

    it('В функции генератор асинхронное действие с ошибкой завершит цепочку', done => {
      asyncExecutor(function*() {
        try {
          const id = yield getId();
          assert.equal(id, ID);
          const data = yield getDataById(undefined);
          assert.equal(data, 'resolved');
        } catch (e) {
          assert.equal(e, 'reject');
        } finally {
          done();
        }
      });
    });
  });
});
