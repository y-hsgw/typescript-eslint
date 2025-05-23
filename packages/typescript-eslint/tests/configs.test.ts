import type {
  FlatConfig,
  RuleRecommendation,
} from '@typescript-eslint/utils/ts-eslint';

import rules from '@typescript-eslint/eslint-plugin/use-at-your-own-risk/rules';

import tseslint from '../src/index';

const RULE_NAME_PREFIX = '@typescript-eslint/';
const EXTENSION_RULES = Object.entries(rules)
  .filter(([, rule]) => rule.meta.docs.extendsBaseRule)
  .map(
    ([ruleName, rule]) =>
      [
        `${RULE_NAME_PREFIX}${ruleName}`,
        typeof rule.meta.docs.extendsBaseRule === 'string'
          ? rule.meta.docs.extendsBaseRule
          : ruleName,
      ] as const,
  );

function filterRules(
  values: FlatConfig.Rules | undefined,
): [string, FlatConfig.RuleEntry][] {
  expect(values).toBeDefined();
  return Object.entries(values!)
    .filter((pair): pair is [string, FlatConfig.RuleEntry] => pair[1] != null)
    .filter(([name]) => name.startsWith(RULE_NAME_PREFIX));
}

interface FilterAndMapRuleConfigsSettings {
  excludeDeprecated?: boolean;
  recommendations?: (RuleRecommendation | undefined)[];
  typeChecked?: 'exclude' | 'include-only';
}

function filterAndMapRuleConfigs({
  excludeDeprecated,
  recommendations,
  typeChecked,
}: FilterAndMapRuleConfigsSettings = {}): [string, unknown][] {
  let result = Object.entries(rules);

  if (excludeDeprecated) {
    result = result.filter(([, rule]) => !rule.meta.deprecated);
  }

  if (typeChecked) {
    result = result.filter(([, rule]) =>
      typeChecked === 'exclude'
        ? !rule.meta.docs.requiresTypeChecking
        : rule.meta.docs.requiresTypeChecking,
    );
  }

  if (recommendations) {
    result = result.filter(([, rule]) => {
      switch (typeof rule.meta.docs.recommended) {
        case 'object':
          return Object.keys(rule.meta.docs.recommended).some(recommended =>
            recommendations.includes(recommended as RuleRecommendation),
          );
        case 'string':
          return recommendations.includes(rule.meta.docs.recommended);
        default:
          return false;
      }
    });
  }

  const highestRecommendation = recommendations?.filter(Boolean).at(-1);

  return result.map(([name, rule]) => {
    const customRecommendation =
      highestRecommendation &&
      typeof rule.meta.docs.recommended === 'object' &&
      rule.meta.docs.recommended[
        highestRecommendation as 'recommended' | 'strict'
      ];

    return [
      `${RULE_NAME_PREFIX}${name}`,
      customRecommendation && typeof customRecommendation !== 'boolean'
        ? ['error', customRecommendation[0]]
        : 'error',
    ];
  });
}

function itHasBaseRulesOverriden(
  unfilteredConfigRules: FlatConfig.Rules | undefined,
): void {
  it('has the base rules overriden by the appropriate extension rules', () => {
    expect(unfilteredConfigRules).toBeDefined();
    const ruleNames = new Set(Object.keys(unfilteredConfigRules!));
    EXTENSION_RULES.forEach(([ruleName, extRuleName]) => {
      if (ruleNames.has(ruleName)) {
        // this looks a little weird, but it provides the cleanest test output style
        expect(unfilteredConfigRules).toMatchObject({
          ...unfilteredConfigRules,
          [extRuleName]: 'off',
        });
      }
    });
  });
}

describe('all.ts', () => {
  const unfilteredConfigRules = tseslint.configs.all[2]?.rules;

  it('contains all of the rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: exclude deprecated rules, this config is allowed to change between minor versions
    const ruleConfigs = filterAndMapRuleConfigs({
      excludeDeprecated: true,
    });

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('disable-type-checked.ts', () => {
  const unfilteredConfigRules = tseslint.configs.disableTypeChecked.rules;

  it('disables all type checked rules', () => {
    const configRules = filterRules(unfilteredConfigRules);

    const ruleConfigs: [string, string][] = Object.entries(rules)
      .filter(([, rule]) => rule.meta.docs.requiresTypeChecking)
      .map(([name]) => [`${RULE_NAME_PREFIX}${name}`, 'off']);

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });
});

describe('recommended.ts', () => {
  const unfilteredConfigRules = tseslint.configs.recommended[2]?.rules;

  it('contains all recommended rules, excluding type checked ones', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: include deprecated rules so that the config doesn't change between major bumps
    const ruleConfigs = filterAndMapRuleConfigs({
      recommendations: ['recommended'],
      typeChecked: 'exclude',
    });

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('recommended-type-checked.ts', () => {
  const unfilteredConfigRules =
    tseslint.configs.recommendedTypeChecked[2]?.rules;

  it('contains all recommended rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: include deprecated rules so that the config doesn't change between major bumps
    const ruleConfigs = filterAndMapRuleConfigs({
      recommendations: ['recommended'],
    });

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('recommended-type-checked-only.ts', () => {
  const unfilteredConfigRules =
    tseslint.configs.recommendedTypeCheckedOnly[2]?.rules;

  it('contains only type-checked recommended rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: include deprecated rules so that the config doesn't change between major bumps
    const ruleConfigs = filterAndMapRuleConfigs({
      recommendations: ['recommended'],
      typeChecked: 'include-only',
    }).filter(([ruleName]) => ruleName);

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('strict.ts', () => {
  const unfilteredConfigRules = tseslint.configs.strict[2]?.rules;

  it('contains all strict rules, excluding type checked ones', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: exclude deprecated rules, this config is allowed to change between minor versions
    const ruleConfigs = filterAndMapRuleConfigs({
      excludeDeprecated: true,
      recommendations: ['recommended', 'strict'],
      typeChecked: 'exclude',
    });

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('strict-type-checked.ts', () => {
  const unfilteredConfigRules = tseslint.configs.strictTypeChecked[2]?.rules;

  it('contains all strict rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: exclude deprecated rules, this config is allowed to change between minor versions
    const ruleConfigs = filterAndMapRuleConfigs({
      excludeDeprecated: true,
      recommendations: ['recommended', 'strict'],
    });
    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('strict-type-checked-only.ts', () => {
  const unfilteredConfigRules =
    tseslint.configs.strictTypeCheckedOnly[2]?.rules;

  it('contains only type-checked strict rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: exclude deprecated rules, this config is allowed to change between minor versions
    const ruleConfigs = filterAndMapRuleConfigs({
      excludeDeprecated: true,
      recommendations: ['recommended', 'strict'],
      typeChecked: 'include-only',
    }).filter(([ruleName]) => ruleName);

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('stylistic.ts', () => {
  const unfilteredConfigRules = tseslint.configs.stylistic[2]?.rules;

  it('contains all stylistic rules, excluding deprecated or type checked ones', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: include deprecated rules so that the config doesn't change between major bumps
    const ruleConfigs = filterAndMapRuleConfigs({
      recommendations: ['stylistic'],
      typeChecked: 'exclude',
    });

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('stylistic-type-checked.ts', () => {
  const unfilteredConfigRules = tseslint.configs.stylisticTypeChecked[2]?.rules;
  const configRules = filterRules(unfilteredConfigRules);
  // note: include deprecated rules so that the config doesn't change between major bumps
  const ruleConfigs = filterAndMapRuleConfigs({
    recommendations: ['stylistic'],
  });

  it('contains all stylistic rules, excluding deprecated ones', () => {
    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});

describe('stylistic-type-checked-only.ts', () => {
  const unfilteredConfigRules =
    tseslint.configs.stylisticTypeCheckedOnly[2]?.rules;

  it('contains only type-checked stylistic rules', () => {
    const configRules = filterRules(unfilteredConfigRules);
    // note: include deprecated rules so that the config doesn't change between major bumps
    const ruleConfigs = filterAndMapRuleConfigs({
      recommendations: ['stylistic'],
      typeChecked: 'include-only',
    }).filter(([ruleName]) => ruleName);

    expect(Object.fromEntries(ruleConfigs)).toEqual(
      Object.fromEntries(configRules),
    );
  });

  itHasBaseRulesOverriden(unfilteredConfigRules);
});
