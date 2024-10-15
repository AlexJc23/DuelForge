// import Cookies from 'js-cookie';


// export async function csrfFetch(url, options = {}) {
//     // set options.method to 'GET' if there is no method
//     options.method = options.method || 'GET';

//     // set options.headers to an empty object if there is no headers
//     options.headers = options.headers || {};

//     // if the options.method is not 'GET', then set the "Content-Type" header to
//     // "application/json", and set the "XSRF-TOKEN" header to the value of the
//     // "XSRF-TOKEN" cookie
//     if (options.method.toUpperCase() !== 'GET') {
//       options.headers['Content-Type'] =
//         options.headers['Content-Type'] || 'application/json';
//       options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
//     }
//     // call the default window's fetch with the url and the options passed in
//     const res = await window.fetch(url, options);

//     // if the response status code is 400 or above, then throw an error with the
//     // error being the response
//     if (res.status >= 400) throw res;

//     // if the response status code is under 400, then return the response to the
//     // next promise chain
//     return res;
// }


// export function restoreCSRF() {
//     return csrfFetch('api/csrf/restore')
// }
import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
    // Set options.method to 'GET' if there is no method
    options.method = options.method || 'GET';

    // Set options.headers to an empty object if there are no headers
    options.headers = options.headers || {};

    // If the options.method is not 'GET', then set the "Content-Type" header
    // and the "XSRF-Token" header to the value of the "XSRF-TOKEN" cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    // Construct the full URL based on the environment
    let baseUrl = '';
    if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://duelforge.onrender.com'; // Production URL
    } else {
        baseUrl = 'http://localhost:5000'; // Development URL
    }

    const fullUrl = `${baseUrl}${url}`; // Create the full URL

    // Call the default window's fetch with the full URL and the options passed in
    const res = await window.fetch(fullUrl, options);

    // If the response status code is 400 or above, then throw an error
    if (res.status >= 400) throw res;

    // Return the response if the status is less than 400
    return res;
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore'); // Note: Ensure the correct URL path here
}
