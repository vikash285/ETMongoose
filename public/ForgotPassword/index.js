async function forgotPassword(event) {
    try {
    event.preventDefault();
    console.log(event.target.name);
    const form = new FormData(event.target);

    const userDetails = {
        email: form.get("email"),

    }
    console.log(userDetails)
    const response = await axios.post('http://localhost:3000/password/forgotPassword',userDetails)
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
}
