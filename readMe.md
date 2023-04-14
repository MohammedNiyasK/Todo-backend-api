Basic url : https://todos-backend-bhv8.onrender.com


1.Register

EndPoint: /auth/register

{
    "userName:"",
    "password:""
}


2.Login

Endpoint: /auth/login

{
    "userName":"",
    "password":""
}

3.Get All Todos

EndPoint: /todos

Token Required, Add token 

Eg: Headers - Authorization - token (token will get for the succesfull login)


4.Delete a todo

Method:POST
Endpoint:/todos/:id

5.update a todo 

Method:PUT
Endpoint:/todos/:id


6.Cancel a todo

Method : PUT

Endpoint: /todos/cancel/:id

7.Complete a todo

Method:PUT

Endpoint:/todos/complete/:id


8.Logout

Method:POST

Endpoint:/logout