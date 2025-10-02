const formatCount = (count, intl) => {
  const shouldAbbreviate = count >= 10000;
  return shouldAbbreviate ? intl.formatNumber(count, {
    notation: 'compact'
  }) : intl.formatNumber(count);
};

// eslint-disable-next-line import/prefer-default-export
export { formatCount };
//# sourceMappingURL=numberUtils.js.map