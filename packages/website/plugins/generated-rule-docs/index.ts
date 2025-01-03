import type { Plugin } from 'unified';

import pluginRules from '@typescript-eslint/eslint-plugin/use-at-your-own-risk/rules';

import { nodeIsParent } from '../utils/nodes';
import { isESLintPluginRuleModule, isVFileWithStem } from '../utils/rules';
import { addESLintHashToCodeBlocksMeta } from './addESLintHashToCodeBlocksMeta';
import { createRuleDocsPage } from './createRuleDocsPage';
import { insertBaseRuleReferences } from './insertions/insertBaseRuleReferences';
import { insertNewRuleReferences } from './insertions/insertNewRuleReferences';
import { insertResources } from './insertions/insertResources';
import { insertRuleDescription } from './insertions/insertRuleDescription';
import { insertRuleOptions } from './insertions/insertRuleOptions';
import { insertWhenNotToUseIt } from './insertions/insertWhenNotToUseIt';
import { removeSourceCodeNotice } from './removeSourceCodeNotice';

export const generatedRuleDocs: Plugin = () => {
  return async (root, file) => {
    if (!nodeIsParent(root) || !isVFileWithStem(file)) {
      return;
    }

    const rule = pluginRules[file.stem];
    if (!isESLintPluginRuleModule(rule)) {
      return;
    }

    const page = createRuleDocsPage(root.children, file, rule);

    removeSourceCodeNotice(page);
    insertRuleDescription(page);

    const eslintrc = rule.meta.docs.extendsBaseRule
      ? insertBaseRuleReferences(page)
      : await insertNewRuleReferences(page);

    insertWhenNotToUseIt(page);
    insertResources(page);
    insertRuleOptions(page);
    addESLintHashToCodeBlocksMeta(page, eslintrc);
  };
};
