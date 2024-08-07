import { noFormat, RuleTester } from '@typescript-eslint/rule-tester';

import rule from '../../src/rules/explicit-member-accessibility';

const ruleTester = new RuleTester();

ruleTester.run('explicit-member-accessibility', rule, {
  valid: [
    {
      code: `
class Test {
  public constructor(private foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'explicit' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(private readonly foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'explicit' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(private foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(protected foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(public foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(readonly foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(private readonly foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  protected name: string;
  private x: number;
  public getX() {
    return this.x;
  }
}
      `,
    },
    {
      code: `
class Test {
  protected name: string;
  protected foo?: string;
  public 'foo-bar'?: string;
}
      `,
    },
    {
      code: `
class Test {
  public constructor({ x, y }: { x: number; y: number }) {}
}
      `,
    },
    {
      code: `
class Test {
  protected name: string;
  protected foo?: string;
  public getX() {
    return this.x;
  }
}
      `,
      options: [{ accessibility: 'explicit' }],
    },
    {
      code: `
class Test {
  protected name: string;
  protected foo?: string;
  getX() {
    return this.x;
  }
}
      `,
      options: [{ accessibility: 'no-public' }],
    },
    {
      code: `
class Test {
  name: string;
  foo?: string;
  getX() {
    return this.x;
  }
  get fooName(): string {
    return this.foo + ' ' + this.name;
  }
}
      `,
      options: [{ accessibility: 'no-public' }],
    },
    {
      code: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  private set internalValue(value: number) {
    this.x = value;
  }
  public square(): number {
    return this.x * this.x;
  }
}
      `,
      options: [{ overrides: { constructors: 'off', accessors: 'off' } }],
    },
    {
      code: `
class Test {
  private x: number;
  public constructor(x: number) {
    this.x = x;
  }
  public get internalValue() {
    return this.x;
  }
  public set internalValue(value: number) {
    this.x = value;
  }
  public square(): number {
    return this.x * this.x;
  }
  half(): number {
    return this.x / 2;
  }
}
      `,
      options: [{ overrides: { methods: 'off' } }],
    },
    {
      code: `
class Test {
  constructor(private x: number) {}
}
      `,
      options: [{ accessibility: 'no-public' }],
    },
    {
      code: `
class Test {
  constructor(public x: number) {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'off' },
        },
      ],
    },
    {
      code: `
class Test {
  constructor(public foo: number) {}
}
      `,
      options: [{ accessibility: 'no-public' }],
    },
    {
      code: `
class Test {
  public getX() {
    return this.x;
  }
}
      `,
      options: [{ ignoredMethodNames: ['getX'] }],
    },
    {
      code: `
class Test {
  public static getX() {
    return this.x;
  }
}
      `,
      options: [{ ignoredMethodNames: ['getX'] }],
    },
    {
      code: `
class Test {
  get getX() {
    return this.x;
  }
}
      `,
      options: [{ ignoredMethodNames: ['getX'] }],
    },
    {
      code: `
class Test {
  getX() {
    return this.x;
  }
}
      `,
      options: [{ ignoredMethodNames: ['getX'] }],
    },
    {
      code: `
class Test {
  x = 2;
}
      `,
      options: [{ overrides: { properties: 'off' } }],
    },
    {
      code: `
class Test {
  private x = 2;
}
      `,
      options: [{ overrides: { properties: 'explicit' } }],
    },
    {
      code: `
class Test {
  x = 2;
  private x = 2;
}
      `,
      options: [{ overrides: { properties: 'no-public' } }],
    },
    {
      code: `
class Test {
  constructor(private { x }: any[]) {}
}
      `,
      options: [{ accessibility: 'no-public' }],
    },
    // private members
    {
      code: `
class Test {
  #foo = 1;
  #bar() {}
}
      `,
      options: [{ accessibility: 'explicit' }],
    },
  ],
  invalid: [
    {
      code: `
export class XXXX {
  public constructor(readonly value: string) {}
}
      `,
      output: null,
      options: [
        {
          accessibility: 'off',
          overrides: {
            parameterProperties: 'explicit',
          },
        },
      ],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
export class XXXX {
  public constructor(public readonly value: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
export class XXXX {
  public constructor(private readonly value: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
export class XXXX {
  public constructor(protected readonly value: string) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
export class WithParameterProperty {
  public constructor(readonly value: string) {}
}
      `,
      output: null,
      options: [{ accessibility: 'explicit' }],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
export class WithParameterProperty {
  public constructor(public readonly value: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
export class WithParameterProperty {
  public constructor(private readonly value: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
export class WithParameterProperty {
  public constructor(protected readonly value: string) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
export class XXXX {
  public constructor(readonly samosa: string) {}
}
      `,
      output: null,
      options: [
        {
          accessibility: 'off',
          overrides: {
            constructors: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
export class XXXX {
  public constructor(public readonly samosa: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
export class XXXX {
  public constructor(private readonly samosa: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
export class XXXX {
  public constructor(protected readonly samosa: string) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  public constructor(readonly foo: string) {}
}
      `,
      output: null,
      options: [
        {
          accessibility: 'explicit',
          overrides: { parameterProperties: 'explicit' },
        },
      ],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 34,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public constructor(public readonly foo: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  public constructor(private readonly foo: string) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  public constructor(protected readonly foo: string) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  x: number;
  public getX() {
    return this.x;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          data: {
            type: 'class property',
            name: 'x',
          },
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },

              output: `
class Test {
  public x: number;
  public getX() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },

              output: `
class Test {
  private x: number;
  public getX() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },

              output: `
class Test {
  protected x: number;
  public getX() {
    return this.x;
  }
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  private x: number;
  getX() {
    return this.x;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          data: {
            type: 'method definition',
            name: 'getX',
          },
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 7,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  public getX() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  private getX() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  protected getX() {
    return this.x;
  }
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  x?: number;
  getX?() {
    return this.x;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          data: {
            type: 'class property',
            name: 'x',
          },
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public x?: number;
  getX?() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x?: number;
  getX?() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  protected x?: number;
  getX?() {
    return this.x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          data: {
            type: 'method definition',
            name: 'getX',
          },
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 7,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  x?: number;
  public getX?() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  x?: number;
  private getX?() {
    return this.x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  x?: number;
  protected getX?() {
    return this.x;
  }
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  protected name: string;
  protected foo?: string;
  public getX() {
    return this.x;
  }
}
      `,
      options: [{ accessibility: 'no-public' }],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'method definition',
            name: 'getX',
          },
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  protected name: string;
  protected foo?: string;
  getX() {
    return this.x;
  }
}
      `,
    },
    {
      code: `
class Test {
  protected name: string;
  public foo?: string;
  getX() {
    return this.x;
  }
}
      `,
      options: [{ accessibility: 'no-public' }],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'class property',
            name: 'foo',
          },
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  protected name: string;
  foo?: string;
  getX() {
    return this.x;
  }
}
      `,
    },
    {
      code: `
class Test {
  public x: number;
  public getX() {
    return this.x;
  }
}
      `,
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
        {
          messageId: 'unwantedPublicAccessibility',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 9,
        },
      ],
      options: [{ accessibility: 'no-public' }],
      output: `
class Test {
  x: number;
  getX() {
    return this.x;
  }
}
      `,
    },
    {
      code: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 20,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  public get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  private get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  protected get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 10,
          column: 3,
          endLine: 10,
          endColumn: 20,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  public set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  private set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  protected set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
          ],
        },
      ],
      options: [{ overrides: { constructors: 'no-public' } }],
    },
    {
      code: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  public constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  private constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  protected constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 7,
          column: 3,
          endLine: 7,
          endColumn: 20,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  public get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  private get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  protected get internalValue() {
    return this.x;
  }
  set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 10,
          column: 3,
          endLine: 10,
          endColumn: 20,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  public set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  private set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  private x: number;
  constructor(x: number) {
    this.x = x;
  }
  get internalValue() {
    return this.x;
  }
  protected set internalValue(value: number) {
    this.x = value;
  }
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  constructor(public x: number) {}
  public foo(): string {
    return 'foo';
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public constructor(public x: number) {}
  public foo(): string {
    return 'foo';
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private constructor(public x: number) {}
  public foo(): string {
    return 'foo';
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  protected constructor(public x: number) {}
  public foo(): string {
    return 'foo';
  }
}
      `,
            },
          ],
        },
      ],
      options: [
        {
          overrides: { parameterProperties: 'no-public' },
        },
      ],
    },
    {
      code: `
class Test {
  constructor(public x: number) {}
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public constructor(public x: number) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private constructor(public x: number) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  protected constructor(public x: number) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  constructor(public readonly x: number) {}
}
      `,
      options: [
        {
          accessibility: 'off',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 21,
        },
      ],
      output: `
class Test {
  constructor(readonly x: number) {}
}
      `,
    },
    {
      code: `
class Test {
  x = 2;
}
      `,
      output: null,
      options: [
        {
          accessibility: 'off',
          overrides: { properties: 'explicit' },
        },
      ],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 4,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public x = 2;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private x = 2;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  protected x = 2;
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
class Test {
  public x = 2;
  private x = 2;
}
      `,
      options: [
        {
          accessibility: 'off',
          overrides: { properties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  x = 2;
  private x = 2;
}
      `,
    },
    {
      code: `
class Test {
  constructor(public x: any[]) {}
}
      `,
      output: null,
      options: [{ accessibility: 'explicit' }],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class Test {
  public constructor(public x: any[]) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class Test {
  private constructor(public x: any[]) {}
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class Test {
  protected constructor(public x: any[]) {}
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: noFormat`
class Test {
  public /*public*/constructor(private foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  /*public*/constructor(private foo: string) {}
}
      `,
    },
    {
      code: `
class Test {
  @public
  public foo() {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  @public
  foo() {}
}
      `,
    },
    {
      code: `
class Test {
  @public
  public foo;
}
      `,
      options: [
        {
          accessibility: 'no-public',
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  @public
  foo;
}
      `,
    },
    {
      code: `
class Test {
  public foo = '';
}
      `,
      options: [
        {
          accessibility: 'no-public',
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  foo = '';
}
      `,
    },
    {
      code: noFormat`
class Test {
  constructor(public/* Hi there */ readonly foo) {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 21,
        },
      ],
      output: `
class Test {
  constructor(/* Hi there */ readonly foo) {}
}
      `,
    },
    {
      code: `
class Test {
  constructor(public readonly foo: string) {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 15,
          endLine: 3,
          endColumn: 21,
        },
      ],
      output: `
class Test {
  constructor(readonly foo: string) {}
}
      `,
    },
    {
      code: `
class EnsureWhiteSPaceSpan {
  public constructor() {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
class EnsureWhiteSPaceSpan {
  constructor() {}
}
      `,
    },
    {
      code: `
class EnsureWhiteSPaceSpan {
  public /* */ constructor() {}
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
class EnsureWhiteSPaceSpan {
  /* */ constructor() {}
}
      `,
    },
    // quoted names
    {
      code: noFormat`
class Test {
  public 'foo' = 1;
  public 'foo foo' = 2;
  public 'bar'() {}
  public 'bar bar'() {}
}
      `,
      options: [{ accessibility: 'no-public' }],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'class property',
            name: 'foo',
          },
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'class property',
            name: '"foo foo"',
          },
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 9,
        },
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'method definition',
            name: 'bar',
          },
          line: 5,
          column: 3,
          endLine: 5,
          endColumn: 9,
        },
        {
          messageId: 'unwantedPublicAccessibility',
          data: {
            type: 'method definition',
            name: '"bar bar"',
          },
          line: 6,
          column: 3,
          endLine: 6,
          endColumn: 9,
        },
      ],
      output: `
class Test {
  'foo' = 1;
  'foo foo' = 2;
  'bar'() {}
  'bar bar'() {}
}
      `,
    },
    {
      code: `
abstract class SomeClass {
  abstract method(): string;
}
      `,
      output: null,
      options: [{ accessibility: 'explicit' }],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 18,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
abstract class SomeClass {
  public abstract method(): string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
abstract class SomeClass {
  private abstract method(): string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
abstract class SomeClass {
  protected abstract method(): string;
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
abstract class SomeClass {
  public abstract method(): string;
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
abstract class SomeClass {
  abstract method(): string;
}
      `,
    },
    {
      // https://github.com/typescript-eslint/typescript-eslint/issues/3835
      code: `
abstract class SomeClass {
  abstract x: string;
}
      `,
      output: null,
      options: [{ accessibility: 'explicit' }],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 13,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
abstract class SomeClass {
  public abstract x: string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
abstract class SomeClass {
  private abstract x: string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
abstract class SomeClass {
  protected abstract x: string;
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
abstract class SomeClass {
  public abstract x: string;
}
      `,
      options: [
        {
          accessibility: 'no-public',
          overrides: { parameterProperties: 'no-public' },
        },
      ],
      errors: [
        {
          messageId: 'unwantedPublicAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 9,
        },
      ],
      output: `
abstract class SomeClass {
  abstract x: string;
}
      `,
    },
    {
      code: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
      output: null,
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 14,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  public constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  private constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  protected constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 39,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() public readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() private readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() protected readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 16,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() public x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() private x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() protected x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 19,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() public getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() private getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() protected getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 10,
          column: 3,
          endLine: 10,
          endColumn: 8,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  public get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  private get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  protected get y() {
    return this.x;
  }
  @foo @bar() set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
        {
          messageId: 'missingAccessibility',
          line: 13,
          column: 15,
          endLine: 13,
          endColumn: 20,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() public set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() private set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
class DecoratedClass {
  constructor(@foo @bar() readonly arg: string) {}
  @foo @bar() x: string;
  @foo @bar() getX() {
    return this.x;
  }
  @foo
  @bar()
  get y() {
    return this.x;
  }
  @foo @bar() protected set z(@foo @bar() value: x) {
    this.x = x;
  }
}
      `,
            },
          ],
        },
      ],
    },
    {
      code: `
abstract class SomeClass {
  abstract ['computed-method-name'](): string;
}
      `,
      output: null,
      options: [{ accessibility: 'explicit' }],
      errors: [
        {
          messageId: 'missingAccessibility',
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'public' },
              output: `
abstract class SomeClass {
  public abstract ['computed-method-name'](): string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'private' },
              output: `
abstract class SomeClass {
  private abstract ['computed-method-name'](): string;
}
      `,
            },
            {
              messageId: 'addExplicitAccessibility',
              data: { type: 'protected' },
              output: `
abstract class SomeClass {
  protected abstract ['computed-method-name'](): string;
}
      `,
            },
          ],
        },
      ],
    },
  ],
});
