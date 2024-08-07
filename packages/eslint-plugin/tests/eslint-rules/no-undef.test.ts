import { RuleTester } from '@typescript-eslint/rule-tester';

import { getESLintCoreRule } from '../../src/util/getESLintCoreRule';

const rule = getESLintCoreRule('no-undef');

const ruleTester = new RuleTester();

ruleTester.run('no-undef', rule, {
  valid: [
    `
import Beemo from './Beemo';
import Driver from './Driver';
import Script from './Script';
import Context from './contexts/Context';
import DriverContext from './contexts/DriverContext';
import ScriptContext from './contexts/ScriptContext';

export { Context, Driver, DriverContext, Script, ScriptContext };

export * from './constants';

export * from './types';

export default Beemo;
    `,
    // https://github.com/eslint/typescript-eslint-parser/issues/471
    `
class X {
  field = {};
}
    `,
    // https://github.com/eslint/typescript-eslint-parser/issues/466
    `
/*globals document, selector, NodeListOf, HTMLElement */
const links = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    `,
    {
      code: `
/*globals document, selector */
const links = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      `,
      languageOptions: {
        parserOptions: {
          lib: ['dom'],
        },
      },
    },
    // https://github.com/eslint/typescript-eslint-parser/issues/437
    `
interface Runnable {
  run(): void;
  toString(): string;
}
    `,
    // https://github.com/eslint/typescript-eslint-parser/issues/416
    `
export type SomeThing = {
  id: string;
};
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/20
    `
export abstract class Foo {}
export class FooBar extends Foo {}
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/18
    `
interface IteratorCallback<Subject, Key, Value> {
  (this: Subject, value: Value, key: Key, subject: Subject): void | false;
}
function eachr<Value>(
  subject: Array<Value>,
  callback: IteratorCallback<typeof subject, number, Value>,
): typeof subject;
function eachr<Key, Value>(
  subject: Map<Key, Value>,
  callback: IteratorCallback<typeof subject, Key, Value>,
): typeof subject;
function eachr<Object extends object, Key extends keyof Object>(
  subject: Object,
  callback: IteratorCallback<Object, Key, Object[Key]>,
): Object;
function eachr<Object extends object, Key, Value>(
  subject: Object | Array<Value> | Map<Key, Value>,
  callback: IteratorCallback<typeof subject, Key, Value>,
): typeof subject {
  return subject;
}
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/18
    `
function eachr<Key, Value>(subject: Map<Key, Value>): typeof subject;
    `,
    `
      var a = { b: 3 };
      var c = a?.b;
    `,
    `
      var a = { b: { c: 3 } };
      var d = a?.['b']?.c;
    `,
    `
      var a = { b: 3 };
      var c = {};
      var d = (a || c)?.b;
    `,
    `
      var a = { b: () => {} };
      a?.b();
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/2462
    `
export default class Column {
  isColumnString(column: unknown): column is string {
    return typeof this.column === 'string';
  }
}
    `,
    `
type T = string;
function predicate(arg: any): arg is T {
  return typeof arg === 'string';
}
    `,
    `
function predicate(arg: any): asserts arg {
  if (arg == null) {
    throw 'oops';
  }
}
    `,
    `
type T = string;
function predicate(arg: any): asserts arg is T {
  if (typeof arg !== 'string') {
    throw 'oops';
  }
}
    `,
    `
interface ITest {
  attr: string;
}
let test: unknown;
(test as ITest) = { attr: '' };
    `,
    {
      code: `
function Foo() {}
<Foo />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      code: `
type T = 1;
function Foo() {}
<Foo<T> />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      code: `
const x = 1;
function Foo() {}
<Foo attr={x} />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      code: `
const x = {};
function Foo() {}
<Foo {...x} />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      code: `
const x = {};
function Foo() {}
<Foo>{x}</Foo>;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    // intrinsic elements should not cause errors
    {
      code: `
<div />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      code: `
<span></span>;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    // https://github.com/typescript-eslint/typescript-eslint/issues/2477
    `
const x = 1 as const;
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/2942
    `
declare function deco(...param: any): (...param: any) => any;

@deco({
  components: {
    val: true,
  },
})
class Foo {}
    `,
    // https://github.com/typescript-eslint/typescript-eslint/issues/3006
    `
export type AppState = typeof import('./src/store/reducers').default;
    `,
    `
let self: typeof this;
let foo: typeof this.foo;
const obj = {
  foo: '',
  bar() {
    let self: typeof this;
  },
};
    `,
    `
class Foo {
  [x: string]: any;
}
    `,
  ],
  invalid: [
    {
      code: 'a = 5;',
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'a',
          },
        },
      ],
    },
    {
      code: 'a?.b = 5;',
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'a',
          },
        },
      ],
    },
    {
      code: 'a()?.b = 5;',
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'a',
          },
        },
      ],
    },
    {
      code: '<Foo />;',
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'Foo',
          },
          line: 1,
          column: 2,
        },
      ],
    },
    {
      code: `
function Foo() {}
<Foo attr={x} />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'x',
          },
          line: 3,
          column: 12,
        },
      ],
    },
    {
      code: `
function Foo() {}
<Foo {...x} />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'x',
          },
          line: 3,
          column: 10,
        },
      ],
    },
    {
      code: `
function Foo() {}
<Foo<T> />;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'T',
          },
          line: 3,
          column: 6,
        },
      ],
    },
    {
      code: `
function Foo() {}
<Foo>{x}</Foo>;
      `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'x',
          },
          line: 3,
          column: 7,
        },
      ],
    },
    {
      code: `
class Foo {
  [x: Bar]: string;
}
      `,
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'Bar',
          },
        },
      ],
    },
    {
      code: `
class Foo {
  [x: string]: Bar;
}
      `,
      errors: [
        {
          messageId: 'undef',
          data: {
            name: 'Bar',
          },
        },
      ],
    },
  ],
});
