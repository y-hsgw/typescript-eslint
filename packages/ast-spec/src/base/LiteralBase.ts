import type { AST_NODE_TYPES } from '../ast-node-types';
import type { BaseNode } from './BaseNode';

export interface LiteralBase extends BaseNode {
  type: AST_NODE_TYPES.Literal;
  raw: string;
  value: bigint | boolean | number | string | RegExp | null;
}
