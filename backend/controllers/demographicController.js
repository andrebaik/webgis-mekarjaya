const createCrud = require('../lib/crudFactory');

const crud = createCrud('demographics', {
  allowedFields: ['year', 'category', 'label_key', 'label_id', 'value', 'sort_order'],
  orderBy: 'year DESC, category ASC, sort_order ASC',
});

module.exports = { ...crud };
