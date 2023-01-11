module.exports.buildFilterFromUrl = (query) => {
  if (!query) {
    return [];
  } else {
    const filtersFromUrl = [];

    // Attribute filters
    Object.keys(query).forEach((key) => {
      const filter = query[key];
      if (Array.isArray(filter)) {
        const values = filter
          .map((v) => parseInt(v))
          .filter((v) => isNaN(v) === false);
        if (values.length > 0) {
          filtersFromUrl.push({
            key,
            operation: 'IN',
            value: values.join(',')
          });
        }
      } else {
        // Use regex to check if filter is either started or ended with a '%'
        // If so, use LIKE operation
        const regex = /^%|%$/;
        if (!regex.test(filter)) {
          filtersFromUrl.push({
            key,
            operation: '=',
            value: filter
          });
        } else {
          filtersFromUrl.push({
            key,
            operation: 'LIKE',
            value: filter
          });
        }
      }
    });

    const { sortBy } = query;
    const sortOrder = (query.sortOrder && ['ASC', 'DESC'].includes(query.sortOrder.toUpperCase())) ? query.sortOrder.toUpperCase() : 'ASC';
    if (sortBy) {
      filtersFromUrl.push({
        key: 'sortBy',
        operation: '=',
        value: sortBy
      });
    }

    if (sortOrder !== 'ASC') {
      filtersFromUrl.push({
        key: 'sortOrder',
        operation: '=',
        value: sortOrder
      });
    }
    // Paging
    const page = isNaN(parseInt(query.page)) ? '1' : query.page.toString();
    if (page !== '1') {
      filtersFromUrl.push({ key: 'page', operation: '=', value: page });
    }
    const limit = isNaN(parseInt(query.limit)) ? '20' : query.limit.toString();// TODO: Get from config
    if (limit !== '20') {
      filtersFromUrl.push({ key: 'limit', operation: '=', value: limit });
    }

    return filtersFromUrl;
  }
};
