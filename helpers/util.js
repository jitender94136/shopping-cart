module.exports = {
  cleanPagingParams(limit, page) {
    // eslint-disable-next-line no-underscore-dangle
    const _limit = parseInt(limit, 10);
    // eslint-disable-next-line no-underscore-dangle
    const _page = parseInt(page, 10);
    const cleanLimit = !Number.isNaN(_limit) ? _limit : 5;
    const cleanPage = !Number.isNaN(_page) ? _page : 0;
    console.log(cleanLimit, cleanPage);
    return { cleanLimit, cleanPage };
  },
};
