export default function ({$axios, $auth, redirect}) {
    $axios.onError(error => {
        if (error.response.status === 401) {
            $auth.logout();

            redirect('/auth')
        }
    })
    // $axios.onRequest(async config => {
    //     // not being set for some reason
    //     config.headers.common["X-CSRF-TOKEN"] = await $axios.$get('/api/test');
    //   });
}