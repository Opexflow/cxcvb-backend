async (query) => {

  const { axios } = npm;

  const { username, password } = config.serpmaster
  const searchParams = {
    'scraper': 'google_search',
    'domain': 'com',
    'q': query,
    'parse': 'true',
  };

  return axios.post('https://rt.serpmaster.com', searchParams, {
    auth: { username, password }
  }).then((res) => res.data.results);
};
