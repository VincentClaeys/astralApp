import { useRouter } from "next/router";

export async function checkIfLoggedIn(router) {
 const token = localStorage.getItem('jwt');
 const response = await fetch('/api/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `${token}`
  }
 });
 
 if (response.ok) {
  const data = await response.json();
  if (data.valid) {
    console.log('Gebruiker is ingelogd');
    if (router.pathname == '/login' || router.pathname == '/') {
      router.push('/home');
    }
  } else {
    console.log('Gebruiker is niet ingelogd');
    router.push('/login');
  }
 } else {
  console.log('Er is geen gebruiker ingelogd');
  router.push('/login');

 }
}
