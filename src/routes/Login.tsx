import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { appStore, calculation, defaults, supabaseStore } from '@/lib/stores';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      throw res.error;
    } else {
      appStore.setGuest(false);
      await supabaseStore.fetchDefaults();
      calculation.updateCalculation();
      console.log('Logged in successfully');
      toast.success('Logged in successfully');
    }
  };

  const logInAsGuest = async () => {
    appStore.setGuest(true);
    defaults.fetchGuestDefaults();
    calculation.updateCalculation();
    navigate('/');
    toast.success('Logged in as guest');
  };

  return (
    <div className='w-full h-full flex items-center'>
      <div className='flex flex-col h-min gap-2 min-w-[250px]'>
        <form
          onSubmit={submitHandler}
          className='grid gap-4 place-content-stretch h-full'
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
        <div className='flex flex-col w-full gap-2'>
          <div className='flex w-full relative'>
            <Separator className='my-3' />
            <span className='absolute uppercase text-xxs flex justify-center w-full'>
              <span className='bg-card p-1 text-muted font-medium'>
                Or continue with
              </span>
            </span>
          </div>

          <Button
            type='button'
            variant='outline'
            className='text-sm uppercase'
            onClick={logInAsGuest}
          >
            Guest login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
