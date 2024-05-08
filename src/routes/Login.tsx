import React, { useState } from 'react';
import { toast } from 'sonner';

import { supabaseStore } from '@/lib/stores';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await supabaseStore.client.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (res.error) {
      console.error(`Error logging in: ${res.error.message}`);
      toast.error(`Error logging in: ${res.error.message}`);
    } else {
      console.log('Logged in successfully');
      toast.success('Logged in successfully');
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className='grid gap-4 place-content-center h-full'
    >
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' onChange={onEmailChange} />
      </div>

      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input type='password' id='password' onChange={onPasswordChange} />
      </div>

      <Button type='submit' className='font-bold uppercase'>
        Login
      </Button>
    </form>
  );
};

export default Login;
