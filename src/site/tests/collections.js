/*
*  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
*
*  Restricted Rights: Use, duplication, or disclosure by the U.S.
*  Government is subject to restrictions as set forth in subparagraph
*  (c) (1) (ii) of DFARS 252.227-7013, or in FAR 52.227-19, or in FAR
*  52.227-14 Alt. III, as applicable.
*
*  This software is proprietary to and embodies the confidential
*  technology of Northwoods Software Corporation. Possession, use, or
*  copying of this software and media is authorized only pursuant to a
*  valid written license from Northwoods or an authorized sublicensor.
*/
(function() {
  var colls = new TestCollection('Collection');
  TestRoot.add(colls);

  // Lists:
  var lists = new TestCollection('List');
  colls.add(lists);

  lists.add(new Test('add', null,
    function(test) {
      test.list1 = new go.List(/*'string'*/);
      test.list1.add('a');
      test.list1.add('b');
      test.list1.add('c');
    },
    null,
    function(test) {
      test.assert(test.list1.count === 3, 'wrong #');
      test.assert(test.list1.contains('b'), 'ought to contain b');
      test.assert(!test.list1.contains('dummy'), 'should not contain dummy');
      test.assert(test.list1.indexOf('b') === 1, 'b should be at index 1');
      test.assert(test.list1.indexOf('dummy') === -1, 'dummy should be at index -1');
    }
  ));

  lists.add(new Test('remove', null,
    function(test) {
      test.list1 = new go.List(/*'string'*/);
      test.list1.add('a');
      test.list1.add('b');
      test.list1.add('c');
    },
    function(test) {
      test.list1.remove('b');
    },
    function(test) {
      var list1 = test.list1;
      test.assert(list1.count === 2, 'wrong # after remove of b');
      test.assert(!list1.contains('b'), 'ought not to contain b any more');
      var msg;
      msg = '';
      for (var it = list1.iterator; it.next(); ) msg += it.value + ' ';
      test.assert(msg === 'a c ', 'List should hold a & c, not: ' + msg);
      msg = '';
      for (var it = list1.iteratorBackwards; it.next(); ) msg += it.value + ' ';
      test.assert(msg === 'c a ', 'List reversed should hold c & a, not: ' + msg);
    }
  ));

  lists.add(new Test('copy/remove', null,
    function(test) {
      test.list1 = new go.List(/*'string'*/);
      test.list1.add('a');
      test.list1.add('b');
      test.list1.add('c');
    },
    function(test) {
      test.list1.remove('b');
      test.list2 = test.list1.copy();
      test.list2.remove('a');
    },
    function(test) {
      test.assert(test.list2.count === 1, 'did not remove a?');
      test.assert(!test.list2.contains('a'), 'still contains a');
      test.assert(test.list1.count === 2 && test.list1.contains('a'), 'changing copy affected original');
    }
  ));

  lists.add(new Test('empty iterator', null,
    null,
    function(test) {
      test.e = new go.List(/*go.Node*/);
    },
    function(test) {
      var l = test.e;
      test.assert(!(l.iterator.next()), 'empty iterator.next() should be false');
      test.assert(l.iterator.count === 0, 'empty iterator.count should be zero');
      test.assert(l.iterator.first() === null, 'empty iterator.first() should be null');
      var it = l.iterator;
      test.assert(it.next() === false, 'empty iterator.next() should be false');
      test.assert(it.next() === false, 'empty iterator.next() should be false second time');
      it.reset();
      test.assert(it.next() === false, 'empty iterator.next() should be false after reset');
      test.assert(it.next() === false, 'empty iterator.next() should be false after reset second time');
      test.assert(it.first() === null, 'empty iterator.first() should still be null after reset');
      test.assert(it.any(function(x) { return true; }) === false, 'empty iterator.any should always return false');
      test.assert(it.all(function(x) { return false; }) === true, 'empty iterator.all should always return true');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 0, 'iterator.each should have found 0 strings');
      test.assert(it.map(function(x) { return c++; }).count === 0, 'iterator.map should return no numbers');
      test.assert(c === 0, 'iterator.map should have found 0 strings');
      test.assert(it.filter(function(x) { c++; return true; }).count === 0, 'iterator.filter should return no strings');
      test.assert(c === 0, 'iterator.filter should have seen 0 strings');
    }
  ));

  lists.add(new Test('singleton iterator', null,
    null,
    function(test) {
      var l = new go.List(/*'string'*/);
      l.add("FIRST");
      test.e = l;
    },
    function(test) {
      var l = test.e;
      test.assert(l.iterator.next(), 'singleton iterator.next() should be true');
      test.assert(l.iterator.count === 1);
      test.assert(l.iterator.first() === "FIRST");
      var it = l.iterator;
      test.assert(it.next() === true, 'singleton iterator.next() should be true first time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false second time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false third time');
      it.reset();
      test.assert(it.next() === true, 'singleton iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first() === "FIRST", 'singleton iterator.first() should be "FIRST"');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first()');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first() second time');
      test.assert(it.first() === "FIRST", 'singleton iterator.next() should still be "FIRST"');
      test.assert(it.any(function(x) { return x === "FIRST"; }) === true, 'singleton iterator.any should be true');
      test.assert(it.any(function(x) { return x === "nope"; }) === false, 'singleton iterator.any should be true');
      test.assert(it.all(function(x) { return x === "FIRST"; }) === true, 'singleton iterator.all should be false');
      test.assert(it.all(function(x) { return x === "nope"; }) === false, 'singleton iterator.all should be false');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 1, 'iterator.each should have found 1 strings');
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 1, 'iterator.map should return a single number');
      test.assert(c === 1, 'iterator.map should have seen 1 strings');
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 1, 'iterator.filter should return a single string');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return no strings');
      test.assert(c === 2, 'iterator.filter should have seen 2 strings');
    }
  ));

  lists.add(new Test('regular iterator', null,
    null,
    function(test) {
      var l = new go.List(/*'string'*/);
      l.add("FIRST");
      l.add("SECOND");
      l.add("THIRD");
      test.e = l;
    },
    function(test) {
      var l = test.e;
      test.assert(l.iterator.next(), 'regular iterator.next() should be true');
      test.assert(l.iterator.count === 3, 'regular iterator.count should be 3');
      test.assert(l.iterator.first() === "FIRST", 'regular iterator.first() should be "FIRST"');
      var it = l.iterator;
      test.assert(it.next() === true, 'regular iterator.next() should be true first time');
      test.assert(it.next() === true, 'regular iterator.next() should be true second time');
      it.reset();
      test.assert(it.next() === true, 'regular iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first() === "FIRST", 'regular iterator.first() should be "FIRST"');
      test.assert(it.next() === true, 'regular iterator.next() should be true after first');
      test.assert(it.value === "SECOND", 'regular iterator.value should be "SECOND" after next()');
      test.assert(it.first() === "FIRST", 'regular iterator.first() should still be "FIRST"');
      test.assert(it.any(function(x) { return x === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(x) { return x === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(x) { return x === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function(x) { return x === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(x) { return x === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(x) { return x !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');
      it.reset();
      test.assert(it.next() === true && it.next() === true && it.next() === true && it.next() === false && it.next() === false, "iterator should have three items");
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 3, 'iterator.map should return 3 numbers');
      test.assert(it.map(function(x) { return c++; }).all(function(x) { return typeof x === 'number'; }) === true, 'iterator.map should return 3 numbers');
      test.assert(c === 6, 'iterator.map should have seen 3 strings');
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 3, 'iterator.filter should return 3 strings');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return nothing');
      test.assert(c === 6, 'iterator.filter should have seen 6 strings');

      var it2 = l.iteratorBackwards;
      test.assert(it2.next() === true && it2.next() === true && it2.next() === true && it2.next() === false && it2.next() === false, "iterator should have three items");
      it2.reset();

      c = 0;
      test.assert(it2.map(function(w) { return w.length; }).count === 3, 'iterator.map should return three numbers');
      it2.map(function(w) { return w.length; }).each(function(n) { c += n; });
      test.assert(c === 16, "sum of lengths of three strings should be 16");

      var it3 = it2.filter(function(x) { return x > "M"; });  // still searching backwards
      test.assert(it3.first() === "THIRD", "first string > M should be THIRD");
      test.assert(it3.count === 2, "two strings starting > M");

      it3 = it2.filter(function(x) { return x > "M"; });
      test.assert(it3.first() === "THIRD", "first string > M should be THIRD");
      test.assert(it3.count === 2, "two strings starting > M");
    }
  ));

  lists.add(new Test('any/all/each', null,
    null,
    function(test) {
      var l = new go.List(/*'string'*/);
      l.add("FIRST");
      l.add("SECOND");
      l.add("THIRD");
      test.e = l;
    },
    function(test) {
      var l = test.e;
      test.assert(l.any(function(x) { return x === "FIRST"; }) === true, 'List.any should be true');
      test.assert(l.any(function(x) { return x === "SECOND"; }) === true, 'List.any should be true');
      test.assert(l.any(function(x) { return x === "nope"; }) === false, 'List.any should be false');
      test.assert(l.all(function(x) { return x === "FIRST"; }) === false, 'List.all should be false');
      test.assert(l.all(function(x) { return x === "SECOND"; }) === false, 'List.all should be false');
      test.assert(l.all(function(x) { return x !== "nope"; }) === true, 'List.all not nope should be true');
      var c = 0;
      l.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');

      var it = l.iterator;
      test.assert(it.any(function (x) { return x === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (x) { return x === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (x) { return x === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function (x) { return x === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (x) { return x === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (x) { return x !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function (x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');
    }
  ));

  function ConstructListOfNumbers(test) {
    var l = new go.List(/*'number'*/);
    l.add(17);
    l.add(41);
    l.add(23);
    l.add(5);
    l.add(16);
    test.list1 = l;
  }

  function CheckListOfNumbers(test, arr) {
    var l = test.list1;
    test.assert(l.count === arr.length, 'wrong # in list: ' + l.count);
    for (var i = 0; i < arr.length; i++) {
      test.assert(l.elt(i) === arr[i], 'wrong value in list: ' + l.elt(i) + ' instead of ' + arr[i]);
    }
  }

  lists.add(new Test('filter', null,
    ConstructListOfNumbers,
    null,
    function(test) {
      var it = test.list1.iterator;
      it.predicate = function(n) { return n > 20; };
      var count = 0;
      while (it.next()) {
        count++;
        test.assert(it.value > 20, 'filtered iterator returned a number <= 20: ' + it.value);
      }
      test.assert(count === 2, 'filtered iterator found wrong # numbers > 20: ' + count + ' instead of 2');
      // note that these uses of count or first() happen after calls to next()
      test.assert(it.count === 2, 'filtered iterator.count should be 2');
      test.assert(it.first() === 41, 'filtered iterator.first() should be 41');

      var sit = test.list1.iterator;
      test.assert(sit.first() === 17, 'unfiltered iterator.first() should be 17');
    }
  ));

  lists.add(new Test('sort', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sort(function(x, y) { return x - y; });
    },
    function(test) {
      CheckListOfNumbers(test, [5, 16, 17, 23, 41]);
    }
  ));

  lists.add(new Test('sortRange none', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 2, 2);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 41, 23, 5, 16]);
    }
  ));

  lists.add(new Test('sortRange one', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 2, 3);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 41, 23, 5, 16]);
    }
  ));

  lists.add(new Test('sortRange two', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 1, 3);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 23, 41, 5, 16]);
    }
  ));

  lists.add(new Test('sortRange all', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; });
    },
    function(test) {
      CheckListOfNumbers(test, [5, 16, 17, 23, 41]);
    }
  ));

  lists.add(new Test('sortRange not beginning', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 1);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 5, 16, 23, 41]);
    }
  ));

  lists.add(new Test('sortRange not end', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 0, 3);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 23, 41, 5, 16]);
    }
  ));

  lists.add(new Test('sortRange middle', null,
    ConstructListOfNumbers,
    function(test) {
      test.list1.sortRange(function(x, y) { return x - y; }, 1, 4);
    },
    function(test) {
      CheckListOfNumbers(test, [17, 5, 23, 41, 16]);
    }
  ));

  lists.add(new Test('copy types', null, null, null,
    function(test) {
      var l = new go.List(/*'boolean'*/);
      l.add(true);
      l.add(false);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === true && c.elt(1) === false, 'copied List of boolean does not have the 2 items true and false');
      var l = new go.List(/*Boolean*/);
      l.add(true);
      l.add(false);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === true && c.elt(1) === false, 'copied List of boolean does not have the 2 items true and false');

      var l = new go.List(/*'number'*/);
      l.add(2);
      l.add(3);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === 2 && c.elt(1) === 3, 'copied List of number does not have the 2 items 2 and 3');
      var l = new go.List(/*Number*/);
      l.add(2);
      l.add(3);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === 2 && c.elt(1) === 3, 'copied List of number does not have the 2 items 2 and 3');

      var l = new go.List(/*'string'*/);
      l.add('two');
      l.add('three');
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === 'two' && c.elt(1) === 'three', 'copied List of string does not have the 2 items "two" and "three"');
      var l = new go.List(/*String*/);
      l.add('two');
      l.add('three');
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === 'two' && c.elt(1) === 'three', 'copied List of string does not have the 2 items "two" and "three"');

      var first = { first: 1 };
      var second = { second: 2 };
      var l = new go.List(/*'object'*/);
      l.add(first);
      l.add(second);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === first && c.elt(1) === second, 'copied List of object does not have the 2 items { first: 1 } and { second: 2 }');
      var l = new go.List(/*Object*/);
      l.add(first);
      l.add(second);
      var c = l.copy();
      test.assert(c.count === 2 && c.elt(0) === first && c.elt(1) === second, 'copied List of object does not have the 2 items { first: 1 } and { second: 2 }');
    }
  ));

  lists.add(new Test('conversions', null, null, null,
    function(test) {
      var l = new go.List(/*'string'*/);
      l.add("a");
      l.add("b");
      l.add("c");
      var a = l.toArray();
      test.assert(Array.isArray(a) && a.length === 3 && a[0] === "a" && a[1] === "b" && a[2] === "c", "List.toArray() is not an Array with the three strings");
      var s = l.toSet();
      test.assert(s instanceof go.Set && s.count === 3 && s.contains("a") && s.contains("b") && s.contains("c"), "List.toSet() is not a Set containing the three strings");
    }
  ));


  var sets = new TestCollection('Set');
  colls.add(sets);

  sets.add(new Test('add', null,
    function(test) {
      test.set1 = new go.Set(/*'string'*/);
      test.set1.add('a');
      test.set1.add('b');
      test.set1.add('c');
      test.set1.add('b');
    },
    null,
    function(test) {
      var s = test.set1;
      test.assert(s.count === 3, 'wrong #');
      test.assert(s.contains('b'), 'ought to contain b');
      var it = s.iterator;
      test.assert(it.next() === true, 'iterator.next() should be true first time');
      test.assert(it.key === 'a' && it.value === 'a', 'iterator.key and .value should be "a" and "a"');
      test.assert(it.next() === true, 'iterator.next() should be true second time');
      test.assert(it.key === 'b' && it.value === 'b', 'iterator.key and .value should be "b" and "b"');
      test.assert(it.next() === true, 'iterator.next() should be true third time');
      test.assert(it.next() === false, 'iterator.next() should be false fourth time');
      test.assert(it.next() === false, 'iterator.next() should be false fifth time');
      it.reset();
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.count === 3, 'count should still be 3');
      test.assert(it.value === 'b', 'iterator.value should now be "b" after two next()s');
      test.assert(it.first() === 'a', 'iterator.first() should still be "a"');
      test.assert(it.next() === true, 'iterator.next() should be true after first()');
      test.assert(it.value === 'b', 'iterator.value should now be "b" after first() & next()');
    }
  ));

  sets.add(new Test('remove', null,
    function(test) {
      test.set1 = new go.Set(/*'string'*/);
      test.set1.add('a');
      test.set1.add('b');
      test.set1.add('c');
    },
    function(test) {
      test.set1.remove('b');
    },
    function(test) {
      test.assert(test.set1.count === 2, 'wrong # after remove');
      var msg = '';
      for (var it = test.set1.iterator; it.next(); ) msg += it.value + ' ';
      test.assert(msg === 'a c ' || msg === 'c a ', 'Set should hold a & c, not: ' + msg);
    }
  ));

  sets.add(new Test('copy/remove', null,
    function(test) {
      test.set1 = new go.Set(/*'string'*/);
      test.set1.add('a');
      test.set1.add('b');
      test.set1.add('c');
      test.set1.remove('b');
    },
    function(test) {
      test.set2 = test.set1.copy();
      test.set2.remove('a');
    },
    function(test) {
      test.assert(test.set2.count === 1, 'did not remove?');
      test.assert(!test.set2.contains('a'), 'still contains a');
      test.assert(test.set1.count === 2 && test.set1.contains('a'), 'changing copy affected original');
    }
  ));

  sets.add(new Test('empty iterator', null,
    null,
    function(test) {
      test.e = new go.Set(/*go.Node*/);
    },
    function(test) {
      test.assert(!(test.e.iterator.next()));
      test.assert(test.e.iterator.count === 0, 'empty iterator.count should be zero');
      var it = test.e.iterator;
      test.assert(it.first() === null, 'empty iterator.first() should be null');
      test.assert(it.any(function(x) { return true; }) === false, 'empty iterator.any should always return false');
      test.assert(it.all(function(x) { return false; }) === true, 'empty iterator.all should always return true');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 0, 'iterator.each should have found 0 strings');
      test.assert(it.map(function(x) { return c++; }).count === 0, 'iterator.map should return no numbers');
      test.assert(c === 0, 'iterator.map should have found 0 strings');
      test.assert(it.filter(function(x) { c++; return true; }).count === 0, 'iterator.filter should return no strings');
      test.assert(c === 0, 'iterator.filter should have seen 0 strings');
    }
  ));

  sets.add(new Test('singleton iterator', null,
    null,
    function(test) {
      var s = new go.Set(/*'string'*/);
      s.add("FIRST");
      test.e = s;
    },
    function(test) {
      var s = test.e;
      test.assert(s.iterator.next(), 'singleton iterator.next() should be true');
      test.assert(s.iterator.count === 1);
      test.assert(s.iterator.first() === "FIRST");
      var it = s.iterator;
      test.assert(it.next() === true, 'singleton iterator.next() should be true first time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false second time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false third time');
      it.reset();
      test.assert(it.next() === true, 'singleton iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first() === "FIRST", 'singleton iterator.first() should be "FIRST"');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first()');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first() second time');
      test.assert(it.first() === "FIRST", 'singleton iterator.next() should still be "FIRST"');
      test.assert(it.any(function(x) { return x === "FIRST"; }) === true, 'singleton iterator.any should be true');
      test.assert(it.any(function(x) { return x === "nope"; }) === false, 'singleton iterator.any should be true');
      test.assert(it.all(function(x) { return x === "FIRST"; }) === true, 'singleton iterator.all should be false');
      test.assert(it.all(function(x) { return x === "nope"; }) === false, 'singleton iterator.all should be false');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 1, 'iterator.each should have found 1 strings');
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 1, 'iterator.map should return a single number');
      test.assert(c === 1, 'iterator.map should have seen 1 strings');
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 1, 'iterator.filter should return a single string');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return no strings');
      test.assert(c === 2, 'iterator.filter should have seen 2 strings');
    }
  ));

  sets.add(new Test('regular iterator', null,
    null,
    function(test) {
      var s = new go.Set(/*'string'*/);
      s.add("FIRST");
      s.add("SECOND");
      s.add("THIRD");
      test.e = s;
    },
    function(test) {
      var s = test.e;
      test.assert(s.iterator.next(), 'regular iterator.next() should be true');
      test.assert(s.iterator.count === 3, 'regular iterator.count should be 3');
      test.assert(s.iterator.first() === "FIRST", 'regular iterator.first() should be "FIRST"');
      var it = s.iterator;
      test.assert(it.next() === true, 'regular iterator.next() should be true first time');
      test.assert(it.next() === true, 'regular iterator.next() should be true second time');
      it.reset();
      test.assert(it.next() === true, 'regular iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first() === "FIRST", 'regular iterator.first() should be "FIRST"');  //??? this shouldn't be depending on any particular order
      test.assert(it.next() === true, 'regular iterator.next() should be true after first');
      test.assert(it.value === "SECOND", 'regular iterator.value should be "SECOND" after next()');
      test.assert(it.first() === "FIRST", 'regular iterator.first() should still be "FIRST"');
      test.assert(it.any(function(x) { return x === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(x) { return x === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(x) { return x === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function(x) { return x === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(x) { return x === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(x) { return x !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');
      it.reset();
      test.assert(it.next() === true && it.next() === true && it.next() === true && it.next() === false && it.next() === false, "iterator should have three items");
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 3, 'iterator.map should return 3 numbers');
      test.assert(it.map(function(x) { return c++; }).all(function(x) { return typeof x === 'number'; }) === true, 'iterator.map should return 3 numbers');
      test.assert(c === 6, 'iterator.map should have seen 3 strings');
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 3, 'iterator.filter should return 3 strings');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return nothing');
      test.assert(c === 6, 'iterator.filter should have seen 6 strings');
    }
  ));

  sets.add(new Test('any/all/each', null,
    null,
    function(test) {
      var s = new go.Set(/*'string'*/);
      s.add("FIRST");
      s.add("SECOND");
      s.add("THIRD");
      test.e = s;
    },
    function(test) {
      var s = test.e;
      test.assert(s.any(function(x) { return x === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(s.any(function(x) { return x === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(s.any(function(x) { return x === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(s.all(function(x) { return x === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(s.all(function(x) { return x === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(s.all(function(x) { return x !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      s.each(function(x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');

      var it = s.iterator;
      test.assert(it.any(function (x) { return x === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (x) { return x === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (x) { return x === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function (x) { return x === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (x) { return x === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (x) { return x !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function (x) { if (typeof x === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 strings');
    }
  ));

  sets.add(new Test('copy types', null, null, null,
    function(test) {
      var s = new go.Set(/*'number'*/);
      s.add(2);
      s.add(3);
      var c = s.copy();
      test.assert(c.count === 2 && c.contains(2) && c.contains(3), 'copied Set of number does not have the 2 items 2 and 3');
      var s = new go.Set(/*Number*/);
      s.add(2);
      s.add(3);
      var c = s.copy();
      test.assert(c.count === 2 && c.contains(2) && c.contains(3), 'copied Set of number does not have the 2 items 2 and 3');

      var s = new go.Set(/*'string'*/);
      s.add('two');
      s.add('three');
      var c = s.copy();
      test.assert(c.count === 2 && c.contains('two') && c.contains('three'), 'copied Set of string does not have the 2 items "two" and "three"');
      var s = new go.Set(/*String*/);
      s.add('two');
      s.add('three');
      var c = s.copy();
      test.assert(c.count === 2 && c.contains('two') && c.contains('three'), 'copied Set of string does not have the 2 items "two" and "three"');

      var first = { first: 1 };
      var second = { second: 2 };
      var s = new go.Set(/*'object'*/);
      s.add(first);
      s.add(second);
      var c = s.copy();
      test.assert(c.count === 2 && c.contains(first) && c.contains(second), 'copied Set of object does not have the 2 items { first: 1 } and { second: 2 }');
      var s = new go.Set(/*Object*/);
      s.add(first);
      s.add(second);
      var c = s.copy();
      test.assert(c.count === 2 && c.contains(first) && c.contains(second), 'copied Set of object does not have the 2 items { first: 1 } and { second: 2 }');
    }
  ));

  sets.add(new Test('conversions', null, null, null,
    function(test) {
      var s = new go.Set(/*'string'*/);
      s.add("a");
      s.add("b");
      s.add("c");
      var a = s.toArray();
      test.assert(Array.isArray(a) && a.length === 3 &&
                  (a[0] === "a" || a[1] === "a" || a[2] === "a") &&
                  (a[0] === "b" || a[1] === "b" || a[2] === "b") &&
                  (a[0] === "c" || a[1] === "c" || a[2] === "c"),
                  "Set.toArray() is not an Array with the three strings");
      var l = s.toList();
      test.assert(l instanceof go.List && l.count === 3 && l.elt(0) === "a" && l.elt(1) ===  "b" && l.elt(2) === "c", "Set.toList() is not a List containing the three strings");
    }
  ));


  var maps = new TestCollection('Map');
  colls.add(maps);

  maps.add(new Test('add', null,
    function(test) {
      test.map1 = new go.Map(/*'string', 'number'*/);
      test.map1.add('a', 1);
      test.map1.add('b', 2);
      test.map1.add('c', 3);
    },
    function(test) {
    },
    function(test) {
      var m = test.map1;
      test.assert(m.count === 3, 'wrong #');
      test.assert(m.contains('b'), 'ought to contain b');
      var it = m.iterator;
      test.assert(it.next() === true, 'iterator.next() should be true first time');
      test.assert(it.key === 'a' && it.value === 1, 'iterator.key and .value should be "a" and 1');
      test.assert(it.next() === true, 'iterator.next() should be true second time');
      test.assert(it.key === 'b' && it.value === 2, 'iterator.key and .value should be "b" and 2');
      test.assert(it.next() === true, 'iterator.next() should be true third time');
      test.assert(it.next() === false, 'iterator.next() should be false fourth time');
      test.assert(it.next() === false, 'iterator.next() should be false fifth time');
      it.reset();
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.count === 3, 'count should still be 3');
      test.assert(it.key === 'b', 'iterator.key should now be "b" after two next()s');
      test.assert(it.first().key === 'a', 'iterator.first().key should still be "a"');
      test.assert(it.first().value === 1, 'iterator.first().value should still be 1');
      test.assert(it.next() === true, 'iterator.next() should be true after first()');
      test.assert(it.key === 'b', 'iterator.value should now be "b" after first() & next()');
    }
  ));

  maps.add(new Test('addAll', null,
    function (test) {
    },
    function (test) {
      var map1 = new go.Map(/*'string', 'number'*/);
      map1.add('a', 1);
      map1.add('b', 2);
      map1.add('c', 3);
      test.map2 = new go.Map(map1);
      test.map3 = new go.Map();
      test.map3.addAll(map1);
    },
    function (test) {
      var m = test.map2;
      test.assert(m.count === 3, 'wrong #');
      test.assert(m.contains('b'), 'ought to contain b');
      var it = m.iterator;
      test.assert(it.next() === true, 'iterator.next() should be true first time');
      test.assert(it.key === 'a' && it.value === 1, 'iterator.key and .value should be "a" and 1');
      test.assert(it.next() === true, 'iterator.next() should be true second time');
      test.assert(it.key === 'b' && it.value === 2, 'iterator.key and .value should be "b" and 2');
      test.assert(it.next() === true, 'iterator.next() should be true third time');
      test.assert(it.next() === false, 'iterator.next() should be false fourth time');
      test.assert(it.next() === false, 'iterator.next() should be false fifth time');
      it.reset();
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.count === 3, 'count should still be 3');
      test.assert(it.key === 'b', 'iterator.key should now be "b" after two next()s');
      test.assert(it.first().key === 'a', 'iterator.first().key should still be "a"');
      test.assert(it.first().value === 1, 'iterator.first().value should still be 1');
      test.assert(it.next() === true, 'iterator.next() should be true after first()');
      test.assert(it.key === 'b', 'iterator.value should now be "b" after first() & next()');

      var m = test.map3;
      test.assert(m.count === 3, 'wrong #');
      test.assert(m.contains('b'), 'ought to contain b');
      var it = m.iterator;
      test.assert(it.next() === true, 'iterator.next() should be true first time');
      test.assert(it.key === 'a' && it.value === 1, 'iterator.key and .value should be "a" and 1');
      test.assert(it.next() === true, 'iterator.next() should be true second time');
      test.assert(it.key === 'b' && it.value === 2, 'iterator.key and .value should be "b" and 2');
      test.assert(it.next() === true, 'iterator.next() should be true third time');
      test.assert(it.next() === false, 'iterator.next() should be false fourth time');
      test.assert(it.next() === false, 'iterator.next() should be false fifth time');
      it.reset();
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.next() === true, 'iterator.next() should be true after reset()');
      test.assert(it.count === 3, 'count should still be 3');
      test.assert(it.key === 'b', 'iterator.key should now be "b" after two next()s');
      test.assert(it.first().key === 'a', 'iterator.first().key should still be "a"');
      test.assert(it.first().value === 1, 'iterator.first().value should still be 1');
      test.assert(it.next() === true, 'iterator.next() should be true after first()');
      test.assert(it.key === 'b', 'iterator.value should now be "b" after first() & next()');
    }
  ));

  maps.add(new Test('replace', null,
    function(test) {
      test.map1 = new go.Map(/*'string', 'number'*/);
      test.map1.add('a', 1);
      test.map1.add('b', 2);
      test.map1.add('c', 3);
      test.map1.add('b', 222);
    },
    function(test) {
    },
    function(test) {
      test.assert(test.map1.count === 3, 'wrong #');
      test.assert(test.map1.contains('b'), 'ought to contain b');
      test.assert(test.map1.getValue('b') === 222, 'value for b ought to have been replaced with 222');
    }
  ));

  maps.add(new Test('remove', null,
    function(test) {
      test.map1 = new go.Map(/*'string', 'number'*/);
      test.map1.add('a', 1);
      test.map1.add('b', 2);
      test.map1.add('c', 3);
    },
    function(test) {
      test.map1.remove('b');
    },
    function(test) {
      test.assert(test.map1.count === 2, 'wrong # after remove');
      msg = '';
      for (var it = test.map1.iterator; it.next(); ) msg += it.value + ' ';
      test.assert(msg === '1 3 ' || msg === '3 1 ', 'Map should hold 1 & 3, not: ' + msg);
    }
  ));

  maps.add(new Test('copy/remove', null,
    function(test) {
      test.map1 = new go.Map(/*'string', 'number'*/);
      test.map1.add('a', 1);
      test.map1.add('b', 2);
      test.map1.add('c', 3);
    },
    function(test) {
      test.map1.remove('b');
      test.map2 = test.map1.copy();
      test.map2.remove('a');
    },
    function(test) {
      test.assert(test.map2.count === 1, 'did not remove?');
      test.assert(!test.map2.contains('a'), 'still contains a');
      test.assert(test.map1.count === 2 && test.map1.contains('a'), 'changing copy affected original');
    }
  ));

  maps.add(new Test('copy/remove again', null,
    function(test) {
      test.map1 = new go.Map(/*'string', 'number'*/);
      test.map1.add('a', 1);
      test.map1.add('b', 2);
      test.map1.add('c', 3);
    },
    function(test) {
      test.map1.remove('b');
      test.map2 = test.map1.copy();
      test.map2.remove('a');
      test.map1.remove('c');
      test.map1.remove('a');
    },
    function(test) {
      test.assert(test.map1.count === 0, 'map1 should now be empty');
      test.assert(test.map2.count === 1, 'map2 should be unaffected');
    }
  ));

  maps.add(new Test('empty iterator', null,
    null,
    function(test) {
      test.e = new go.Map(/*go.Node, go.Link*/);
    },
    function(test) {
      test.assert(!(test.e.iterator.next()));
      var it = test.e.iterator;
      test.assert(it.count === 0, 'empty iterator.count should be zero');
      test.assert(it.first() === null, 'empty iterator.first() should be null');
      test.assert(it.any(function(x) { return true; }) === false, 'empty iterator.any should always return false');
      test.assert(it.all(function(x) { return false; }) === true, 'empty iterator.all should always return true');
      var c = 0;
      it.each(function(x) { c++; });
      test.assert(c === 0, 'iterator.each should have found 0 key-value-pairs');
      test.assert(it.map(function(x) { return c++; }).count === 0, 'iterator.map should return no numbers');
      test.assert(c === 0, 'iterator.map should have found 0 strings');
      test.assert(it.filter(function(x) { c++; return true; }).count === 0, 'iterator.filter should return no pairs');
      test.assert(c === 0, 'iterator.filter should have seen 0 pairs');
    }
  ));

  maps.add(new Test('singleton iterator', null,
    null,
    function(test) {
      var m = new go.Map(/*'string', 'number'*/);
      m.add("FIRST", 1);
      test.e = m;
    },
    function(test) {
      var m = test.e;
      test.assert(m.iterator.next(), 'singleton iterator.next() should be true');
      test.assert(m.iterator.count === 1);
      test.assert(typeof m.iterator.first() === 'object' && m.iterator.first().key === "FIRST" && m.iterator.first().value === 1, 'regular iterator.first().key should be "FIRST"');
      var it = m.iterator;
      test.assert(it.next() === true, 'singleton iterator.next() should be true first time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false second time');
      test.assert(it.next() === false, 'singleton iterator.next() should be false third time');
      it.reset();
      test.assert(it.next() === true, 'singleton iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first().key === "FIRST", 'singleton iterator.first().key should be "FIRST"');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first()');
      test.assert(it.next() === false, 'singleton iterator.next() should be false after first() second time');
      test.assert(it.first().key === "FIRST", 'singleton iterator .first() should still be "FIRST" after .next()');
      test.assert(it.any(function(kvp) { return kvp.key === "FIRST"; }) === true, 'singleton iterator.any should be true');
      test.assert(it.any(function(kvp) { return kvp.key === "nope"; }) === false, 'singleton iterator.any should be true');
      test.assert(it.all(function(kvp) { return kvp.key === "FIRST"; }) === true, 'singleton iterator.all should be false');
      test.assert(it.all(function(kvp) { return kvp.key === "nope"; }) === false, 'singleton iterator.all should be false');
      var c = 0;
      it.each(function(kvp) { if (typeof kvp.key === 'string') c++; });
      test.assert(c === 1, 'iterator.each should have found 1 strings');
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 1, 'iterator.map should return a single pair');
      test.assert(c === 1, 'iterator.map should have seen 1 pairs');
      test.assert(it.map(function(x) { return x.value; }).first() === 1, "iterator.map should return a singleton sequence: 1");
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 1, 'iterator.filter should return a single pair');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return no pairs');
      test.assert(c === 2, 'iterator.filter should have seen 2 pairs');
      test.assert(it.filter(function(x) { return true; }).first().key === "FIRST", "iterator.filter should return a k-v-p that is FIRST, 1");
      test.assert(it.filter(function(x) { return true; }).first().value === 1, "iterator.filter should return a k-v-p that is FIRST, 1");
    }
  ));

  maps.add(new Test('regular iterator', null,
    null,
    function(test) {
      var m = new go.Map(/*'string', 'number'*/);
      m.add("FIRST", 1);
      m.add("SECOND", 2);
      m.add("THIRD", 3);
      test.e = m;
    },
    function(test) {
      var m = test.e;
      test.assert(m.iterator.next(), 'regular iterator.next() should be true');
      test.assert(m.iterator.count === 3, 'regular iterator.count should be 3');
      test.assert(typeof m.iterator.first() === 'object' && m.iterator.first().key === "FIRST" && m.iterator.first().value === 1, 'regular iterator.first().key should be "FIRST"');
      var it = m.iterator;
      test.assert(it.next() === true, 'regular iterator.next() should be true first time');
      test.assert(it.next() === true, 'regular iterator.next() should be true second time');
      it.reset();
      test.assert(it.next() === true, 'regular iterator.next() should be true after reset');
      it.reset();
      test.assert(it.first().key === "FIRST", 'regular iterator.first() should be "FIRST"');  //??? this shouldn't be depending on any particular order
      test.assert(it.next() === true, 'regular iterator.next() should be true after first');
      test.assert(it.key === "SECOND", 'regular iterator.key should be "SECOND" after next()');
      test.assert(it.value === 2, 'regular iterator.value should be 2 after next()');
      test.assert(it.first().key === "FIRST", 'regular iterator.first() should still be "FIRST" after .next()');
      test.assert(it.any(function(kvp) { return kvp.key === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(kvp) { return kvp.key === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function(kvp) { return kvp.key === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function(kvp) { return kvp.key === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(kvp) { return kvp.key === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function(kvp) { return kvp.key !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function(kvp) { if (typeof kvp.key === 'string') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 string keys');
      c = 0;
      test.assert(it.map(function(x) { return c++; }).count === 3, 'iterator.map should return 3 numbers');
      test.assert(it.map(function(x) { return c++; }).all(function(x) { return typeof x === 'number'; }) === true, 'iterator.map should return 3 numbers');
      test.assert(c === 6, 'iterator.map should have seen 3 pairs');
      c = 0;
      test.assert(it.filter(function(x) { c++; return true; }).count === 3, 'iterator.filter should return 3 pairs');
      test.assert(it.filter(function(x) { c++; return false; }).count === 0, 'iterator.filter should return nothing');
      test.assert(c === 6, 'iterator.filter should have seen 6 pairs');
      test.assert(it.filter(function(x) { return x.value > 1; }).all(function(x) { return typeof x === 'object' && typeof x.key === 'string' && typeof x.value === 'number'; }) === true, 'iterator.filter should return 2 pairs of strings, numbers');
      test.assert(it.filter(function(x) { return x.value > 1; }).count === 2, 'iterator.filter should return 2 pairs of strings, numbers');
    }
  ));

  maps.add(new Test('any/all/each', null,
    null,
    function(test) {
      var m = new go.Map(/*'string', 'number'*/);
      m.add("FIRST", 1);
      m.add("SECOND", 2);
      m.add("THIRD", 3);
      test.e = m;
    },
    function(test) {
      var m = test.e;
      test.assert(m.any(function(kvp) { return kvp.key === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(m.any(function(kvp) { return kvp.key === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(m.any(function(kvp) { return kvp.key === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(m.all(function(kvp) { return kvp.key === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(m.all(function(kvp) { return kvp.key === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(m.all(function(kvp) { return kvp.key !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      m.each(function(kvp) { if (typeof kvp.key === 'string' && typeof kvp.value === 'number') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 string keys');

      var it = m.iterator;
      test.assert(it.any(function (kvp) { return kvp.key === "FIRST"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (kvp) { return kvp.key === "SECOND"; }) === true, 'regular iterator.any should be true');
      test.assert(it.any(function (kvp) { return kvp.key === "nope"; }) === false, 'regular iterator.any should be false');
      test.assert(it.all(function (kvp) { return kvp.key === "FIRST"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (kvp) { return kvp.key === "SECOND"; }) === false, 'regular iterator.all should be false');
      test.assert(it.all(function (kvp) { return kvp.key !== "nope"; }) === true, 'regular iterator.all not nope should be true');
      var c = 0;
      it.each(function (kvp) { if (typeof kvp.key === 'string' && typeof kvp.value === 'number') c++; });
      test.assert(c === 3, 'iterator.each should have found 3 string key-value-pairs');
      it.reset();
      test.assert(it.next() === true && it.next() === true && it.next() === true && it.next() === false && it.next() === false, "iterator should have three items");

      var it = m.iteratorKeys;
      test.assert(it.any(function (k) { return k === "FIRST"; }) === true, 'regular iteratorKeys.any should be true');
      test.assert(it.any(function (k) { return k === "SECOND"; }) === true, 'regular iteratorKeys.any should be true');
      test.assert(it.any(function (k) { return k === "nope"; }) === false, 'regular iteratorKeys.any should be false');
      test.assert(it.all(function (k) { return k === "FIRST"; }) === false, 'regular iteratorKeys.all should be false');
      test.assert(it.all(function (k) { return k === "SECOND"; }) === false, 'regular iteratorKeys.all should be false');
      test.assert(it.all(function (k) { return k !== "nope"; }) === true, 'regular iteratorKeys.all not nope should be true');
      var c = 0;
      it.each(function (k) { if (typeof k === 'string') c++; });
      test.assert(c === 3, 'iteratorKeys.each should have found 3 string keys');
      it.reset();
      test.assert(it.next() === true && it.next() === true && it.next() === true && it.next() === false && it.next() === false, "iterator should have three items");

      var it = m.iteratorValues;
      test.assert(it.any(function (v) { return v === 1; }) === true, 'regular iteratorValues.any should be true');
      test.assert(it.any(function (v) { return v === 2; }) === true, 'regular iteratorValues.any should be true');
      test.assert(it.any(function (v) { return v === -17; }) === false, 'regular iteratorValues.any should be false');
      test.assert(it.all(function (v) { return v === 1; }) === false, 'regular iteratorValues.all should be false');
      test.assert(it.all(function (v) { return v === 2; }) === false, 'regular iteratorValues.all should be false');
      test.assert(it.all(function (v) { return v !== -17; }) === true, 'regular iteratorValues.all not nope should be true');
      var c = 0;
      it.each(function (v) { if (typeof v === 'number') c++; });
      test.assert(c === 3, 'iteratorValues.each should have found 3 number values');
      it.reset();
      test.assert(it.next() === true && it.next() === true && it.next() === true && it.next() === false && it.next() === false, "iterator should have three items");
    }
  ));

  maps.add(new Test('Map.toKeySet keys', null,
    function(test) {
      test.map3 = new go.Map(/*'string', 'number'*/);
      test.map3.add('a', 1);
      test.map3.add('b', 2);
      test.map3.add('c', 3);
    },
    function(test) {
      test.keys = test.map3.toKeySet();  // read-only collection of the keys in map3
    },
    function(test) {
      var keys = test.keys;
      test.assert(keys instanceof go.Set, 'MapKeySet should inherit from Set');
      test.assert(keys.count === 3, 'should have 3 keys from map3');
      try {
        keys.add('d', 4);  // check read-only-ness
        if (go.Debug) test.assert(true, 'MapKeySet.add should throw error');
      } catch (ex) {
      }
    }
  ));

  maps.add(new Test('MapKeySet iterator', null,
    function(test) {
      test.map3 = new go.Map(/*'string', 'number'*/);
      test.map3.add('a', 1);
      test.map3.add('b', 2);
      test.map3.add('c', 3);
    },
    function(test) {
      test.keys = test.map3.toKeySet();  // read-only collection of the keys in map3
    },
    function(test) {
      var keys = test.keys;
      var keycntr = 0;  // try MapKeySet iterator
      var kit1 = keys.iterator;
      while (kit1.next()) {
        var k = kit1.value;
        test.assert(k === 'a' || k === 'b' || k === 'c', 'should find keys from map3');
        var kit2 = keys.iterator;
        while (kit2.next()) {  // make sure the iterators are independent of each other
          keycntr++;
          k = kit2.value;
          test.assert(k === 'a' || k === 'b' || k === 'c', 'should find keys from map3');
        }
      }
      test.assert(keycntr === 9, '3 loops over 3 loops');
    }
  ));

  maps.add(new Test('MapKeySet.next', null,
    function(test) {
      test.map3 = new go.Map(/*'string', 'number'*/);
      test.map3.add('a', 1);
      test.map3.add('b', 2);
      test.map3.add('c', 3);
    },
    function(test) {
      test.map3.add('d', 4);  // now modify underlying Map: map3
      test.keys = test.map3.toKeySet();  // read-only collection of the keys in map3
    },
    function(test) {
      var kit3 = test.keys.iterator;  // get new iterator from keys collection
      test.assert(kit3.next(), 'first MapKeySet.next()');
      test.assert(kit3.next(), 'second MapKeySet.next()');
      test.assert(kit3.next(), 'third MapKeySet.next()');
      test.assert(kit3.next(), 'fourth MapKeySet.next()');
      test.assert(kit3.value === 'd', 'fourth should be "d"');
    }
  ));

  maps.add(new Test('MapKeySet independence', null,
    function(test) {
      test.map3 = new go.Map(/*'string', 'number'*/);
      test.map3.add('a', 1);
      test.map3.add('b', 2);
      test.map3.add('c', 3);
    },
    function(test) {
      test.map3.add('d', 4);  // now modify underlying Map: map3
      test.keys = test.map3.toKeySet();  // read-only collection of the keys in map3
      test.map3.remove('d');
    },
    function(test) {
      test.assert(test.map3.count === 3, 'back to three items in map3');
      try {
        var kit4 = test.keys.iterator;  // use iterator
        kit4.next();
        test.map3.add('d', 4);  // then modify underlying Map
        kit4.next();
        if (go.Debug) test.assert(true, 'MapKeySet.next() after map.add should throw error');
      } catch (ex) {
      }
    }
  ));

  maps.add(new Test('copy types', null, null, null,
    function(test) {
      var m = new go.Map(/*'number', 'number'*/);
      m.add(2, 22);
      m.add(3, -33);
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue(2) === 22 && c.getValue(3) === -33, 'copied List of number does not have the 2 items 22 and -33');
      var m = new go.Map(/*Number, Number*/);
      m.add(2, 22);
      m.add(3, -33);
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue(2) === 22 && c.getValue(3) === -33, 'copied List of number does not have the 2 items 22 and -33');

      var m = new go.Map(/*'string', 'string'*/);
      m.add('two', 'ni');
      m.add('three', 'san');
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue('two') === 'ni' && c.getValue('three') === 'san', 'copied List of string does not have the 2 items "ni" and "san"');
      var m = new go.Map(/*String, String*/);
      m.add('two', 'ni');
      m.add('three', 'san');
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue('two') === 'ni' && c.getValue('three') === 'san', 'copied List of string does not have the 2 items "ni" and "san"');

      var first = { first: 1 };
      var second = { second: 2 };
      var m = new go.Map(/*'object', 'object'*/);
      m.add(first, test);
      m.add(second, m);
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue(first) === test && c.getValue(second) === m, 'copied List of object does not have the 2 items (test) and (map)');
      var m = new go.Map(/*Object, Object*/);
      m.add(first, test);
      m.add(second, m);
      var c = m.copy();
      test.assert(c.count === 2 && c.getValue(first) === test && c.getValue(second) === m, 'copied List of object does not have the 2 items (test) and (map)');
    }
  ));

  maps.add(new Test('conversions', null, null, null,
    function(test) {
      var m = new go.Map(/*'string', 'number'*/);
      m.add('a', 1);
      m.add('b', 2);
      m.add('c', 3);
      var a = m.toArray();
      test.assert(Array.isArray(a) && a.length === 3 &&
                  ((a[0].key === "a" && a[0].value === 1) || (a[1].key === "a" && a[1].value === 1) || (a[2].key === "a" && a[2].value === 1)) &&
                  ((a[0].key === "b" && a[0].value === 2) || (a[1].key === "b" && a[1].value === 2) || (a[2].key === "b" && a[2].value === 2)) &&
                  ((a[0].key === "c" && a[0].value === 3) || (a[1].key === "c" && a[1].value === 3) || (a[2].key === "c" && a[2].value === 3)),
                  "Set.toArray() is not an Array with the three key-value pairs");
      var s = m.toKeySet();
      test.assert(s instanceof go.Set && s.count === 3 && s.contains("a") && s.contains("b") && s.contains("c"), "Map.toKeySet() is not a Set containing the three strings");
      try {
        s.add('d', 4);  // check read-only-ness
        if (go.Debug) test.assert(true, 'MapKeySet.add should throw error');
      } catch (ex) {
      }
    }
  ));

})();
