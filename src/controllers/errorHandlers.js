const setErrorResponse = (err, response) => {
  console.log(err.message); 
  response.status(503).send(); 
};

const setRouteResponse = (request, response, next) => {
  if (request.path === '/healthz') {
      return next();
  }
  response.status(404).send(); 
};

const setResponse = (request, response) => {
  if (request.method === 'GET') {
      if (request.headers['content-length'] > 0 || (request.body && Object.keys(request.body).length > 0)) {
          return response.status(400).send(); 
      }
      response.set('Cache-Control', 'no-cache');
      return response.status(200).send();
  } else {
      return response.status(405).send(); 
  }
};

module.exports = {
  setErrorResponse,
  setRouteResponse,
  setResponse,
};