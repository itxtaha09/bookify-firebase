import react, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useFirebase  } from '../context/Firebase';

const LoginPage = () => {

    const firebase = useFirebase();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (firebase.isloggedIn){
            //navigate to home
            navigate('/home');
        }
    }, [firebase, navigate]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('loging in a user');
    const result = await firebase.signinUserWithEmailAndPass(email, password);
    console.log('successfull', result);
};
    

    return (
        <div className='container mt-5'>
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter email" />
                </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
        </Form.Group>

    <Button variant="primary" type="submit">
        Login 
    </Button>
    <h2 className='mt-5 mb-5'>OR</h2>
    <button onClick={firebase.signinWithGoogle} variant="Warning">SignIn with Google</button>
    </Form>
    </div>
    );
};

export default LoginPage;