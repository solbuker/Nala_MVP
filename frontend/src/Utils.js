export const fetchWithAuth = async (url, options = {}) => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['Authorization'] = localStorage.getItem('token');

  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
    throw new Error('Unauthorized');
  }

  return response;
};

export const fetchEmployeesList = async () => {
  const response = await fetchWithAuth('http://localhost:3000/api/v1/employees', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
