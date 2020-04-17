/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

Написать функцию, которая принимает объект и возвращает все свойства и символы как в самом объекте,
так и во всей его цепочке прототипов

Пример:
    allKeysAndSymbols({}) // ["constructor", "__defineGetter__", "__defineSetter__", "hasOwnProperty", ... ]
 */
function allKeysAndSymbols(object) {
  let keysAndSymbols = [];

  const allProps = object => {
    if (object !== null) {
      keysAndSymbols = [
        ...keysAndSymbols,
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
      allProps(Object.getPrototypeOf(object));
    }

    return keysAndSymbols;
  };
  return allProps(object);
}

/*
 Задание 2:

in, который игнорирует свойства прототипа
Написать прокси-объект, для которого оператор in вернет истину только в том случает,
когда свойство находится в самом объекте, но не в его прототипе.

Пример:
    const proto = { value: 42 };
    const object = Object.create(proto);

    Object.defineProperty(object, 'year', {
        value: 2020,
        writable: true,
        configurable: true,
        enumerable: false,
    });

    const symbol = Symbol('bazzinga');
    object[symbol] = 42;

    // без proxy
    console.log('value' in object); // true
    console.log('year' in object); // true
    console.log(symbol in object); // true

    const proxy = // реализация

    // с proxy
    console.log('value' in proxy) // false
    console.log('year' in proxy); // true
    console.log(symbol in proxy); // true
 */

function createProxy(object) {
  return new Proxy(object, {
    has(target, prop) {
      return target.hasOwnProperty(prop);
    }
  });
}

/*
 Задание 3:

asyncExecutor
Написать функцию, которая позволит использовать внутри генератора асинхронные вызовы.
Реализация на Promise, async/await использовать запрещено.

Тесты:

    // тесты
    const ID = 42;
    const delayMS = 1000;

    function getId () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(ID);
            }, delayMS);
        });
    }

    function getDataById (id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                id === ID ? resolve('🍎') : reject('💥');
            }, delayMS);
        });
    }

    asyncExecutor(function* () {
        console.time("Time");

        const id = yield getId();
        const data = yield getDataById(id);
        console.log('Data', data);

        console.timeEnd("Time");
    });
 */
function asyncExecutor(generator) {
  const iterator = generator();

  function next(value) {
    const nextResult = iterator.next(value);
    if (nextResult.done) {
      return nextResult.value;
    }
    Promise.resolve(nextResult.value).then(next);
  }

  next();
}

/*
Дополнительное задание: собственная реализация Set
Написать свой класс, который будет очень поход на ES6 множества.

Тесты:

    // тесты
    const set = new MySet([4, 8, 15, 15, 16, 23, 42]);

    // хранит только уникальные значения
    console.log([...set]); // [ 4, 8, 15, 16, 23, 42 ]

    // есть свойство size
    console.log(set.size); // 6

    // работает в цикле for-of
    for (const item of set) {
        console.log(item); // 4 8 15 16 23 42
    }

    // есть методы keys, values, entries
    for (const item of set.entries()) {
        console.log(item); // [ 4, 4 ] [ 8, 8 ] ...

    // есть метод clear
    set.clear();
    console.log(set.size); // 0

    const object = {
        getValue () { return this.value }
    }

    const data = {
        value: 42
    }

    // есть метод add
    set.add(object);
    set.add(data);

    // есть метод delete
    set.delete(data);

    // есть метод has
    console.log(set.has({})); // false
    console.log(set.has(object)); // true
    console.log(set.has(data)); // false

    // и кое-что еще
    console.log(set === set.valueOf()) // true
    console.log(String(set)) // [object MySet]
    console.log(Object.prototype.toString.call(set)) // [object MySet]

    // задание со звездочкой *
    // есть forEach, который делает какие-то странные вещи...
    set.forEach(function (item) {
        console.log(item.getValue.call(this)); // 42
    }, data)
 */
class MySet {
  // реализация
}

window.allKeysAndSymbols = allKeysAndSymbols;
window.createProxy = createProxy;
window.asyncExecutor = asyncExecutor;

export { allKeysAndSymbols, createProxy, asyncExecutor };
